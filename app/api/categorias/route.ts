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

export async function GET() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { nome: "asc" },
    include: { _count: { select: { produtos: true } } },
  });
  return NextResponse.json(categorias);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const { nome, imagemUrl } = body;

  if (!nome) return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });

  const baseSlug = gerarSlug(nome);
  let slug = baseSlug;
  let tentativa = 1;
  while (await prisma.categoria.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${tentativa++}`;
  }

  const categoria = await prisma.categoria.create({
    data: { nome, slug, imagemUrl: imagemUrl ?? null },
  });

  return NextResponse.json(categoria, { status: 201 });
}
