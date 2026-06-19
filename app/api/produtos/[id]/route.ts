import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function gerarSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
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
  await prisma.produto.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
