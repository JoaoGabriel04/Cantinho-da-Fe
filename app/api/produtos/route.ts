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

async function gerarCodigo(): Promise<string> {
  const ultimo = await prisma.produto.findFirst({
    orderBy: { codigo: "desc" },
    select: { codigo: true },
  });
  const proximo = ultimo ? parseInt(ultimo.codigo, 10) + 1 : 1;
  return String(proximo).padStart(4, "0");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ativo = searchParams.get("ativo");
  const categoriaSlug = searchParams.get("categoria");
  const status = searchParams.get("status");
  const busca = searchParams.get("busca");
  const pagina = Math.max(1, Number(searchParams.get("pagina") ?? 1));
  const porPagina = Number(searchParams.get("porPagina") ?? 20);

  const where = {
    ...(ativo !== null ? { ativo: ativo === "true" } : {}),
    ...(categoriaSlug ? { categoria: { slug: categoriaSlug } } : {}),
    ...(status ? { status: status as "DISPONIVEL" | "ESGOTADO" } : {}),
    ...(busca
      ? { nome: { contains: busca, mode: "insensitive" as const } }
      : {}),
  };

  const [produtos, total] = await Promise.all([
    prisma.produto.findMany({
      where,
      include: { imagens: true, categoria: true },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      skip: (pagina - 1) * porPagina,
      take: porPagina,
    }),
    prisma.produto.count({ where }),
  ]);

  return NextResponse.json({ produtos, total, pagina, totalPaginas: Math.ceil(total / porPagina) });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const { nome, descricao, preco, quantidade, categoriaId, status, destaque, ativo, imagens } = body;

  if (!nome || !descricao || !preco || !categoriaId) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  const baseSlug = gerarSlug(nome);
  let slug = baseSlug;
  let tentativa = 1;
  while (await prisma.produto.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${tentativa++}`;
  }

  const codigo = await gerarCodigo();

  const produto = await prisma.produto.create({
    data: {
      codigo,
      nome,
      slug,
      descricao,
      preco,
      categoriaId,
      status: status ?? "DISPONIVEL",
      quantidade: quantidade ?? 0,
      destaque: destaque ?? false,
      ativo: ativo ?? true,
      imagens: imagens?.length
        ? {
            create: imagens.map((url: string, i: number) => ({ url, ordem: i })),
          }
        : undefined,
    },
    include: { imagens: true, categoria: true },
  });

  return NextResponse.json(produto, { status: 201 });
}
