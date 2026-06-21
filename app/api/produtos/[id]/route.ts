import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { deletarImagem, extrairPublicId } from "@/lib/cloudinary";

function gerarSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const produto = await prisma.produto.findUnique({
    where: { id },
    include: { imagens: true, categoria: true },
  });
  if (!produto) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(produto);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { nome, imagens, ...rest } = body;

  // Deleta do Cloudinary as imagens removidas pelo usuário
  if (imagens !== undefined) {
    const produtoAtual = await prisma.produto.findUnique({
      where: { id },
      select: { imagens: { select: { url: true } } },
    });

    if (produtoAtual) {
      const urlsAntigas = produtoAtual.imagens.map((i) => i.url);
      const urlsRemovidas = urlsAntigas.filter((url) => !imagens.includes(url));

      await Promise.allSettled(
        urlsRemovidas.map((url) => deletarImagem(extrairPublicId(url)))
      );
    }
  }

  const slugUpdate = nome ? { slug: gerarSlug(nome) } : {};

  const produto = await prisma.produto.update({
    where: { id },
    data: {
      ...rest,
      ...(nome ? { nome } : {}),
      ...slugUpdate,
      ...(imagens !== undefined
        ? {
            imagens: {
              deleteMany: {},
              create: imagens.map((url: string, i: number) => ({ url, ordem: i })),
            },
          }
        : {}),
    },
    include: { imagens: true, categoria: true },
  });

  return NextResponse.json(produto);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;

  // Remove as imagens do Cloudinary antes de excluir o produto
  const produto = await prisma.produto.findUnique({
    where: { id },
    select: { imagens: { select: { url: true } } },
  });

  if (produto) {
    await Promise.allSettled(
      produto.imagens.map((img) => deletarImagem(extrairPublicId(img.url)))
    );
  }

  await prisma.produto.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
