import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function gerarCodigoPedido(): Promise<string> {
  const ultimo = await prisma.pedido.findFirst({
    orderBy: { codigo: "desc" },
    select: { codigo: true },
  });
  const proximo = ultimo ? parseInt(ultimo.codigo.replace("PED-", ""), 10) + 1 : 1;
  return `PED-${String(proximo).padStart(4, "0")}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { clienteNome, clienteWhatsapp, itens } = body;

  if (!clienteNome || !clienteWhatsapp || !itens?.length) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  const produtos = await prisma.produto.findMany({
    where: { id: { in: itens.map((i: { produtoId: string }) => i.produtoId) } },
  });

  const produtosMap = new Map(produtos.map((p) => [p.id, p]));

  for (const item of itens) {
    const produto = produtosMap.get(item.produtoId);
    if (!produto) {
      return NextResponse.json(
        { error: `Produto não encontrado: ${item.produtoId}` },
        { status: 400 }
      );
    }
    if (produto.quantidade < item.quantidade) {
      return NextResponse.json(
        { error: `Estoque insuficiente para "${produto.nome}". Disponível: ${produto.quantidade}` },
        { status: 400 }
      );
    }
  }

  const codigo = await gerarCodigoPedido();
  let total = 0;

  const pedido = await prisma.$transaction(async (tx) => {
    for (const item of itens) {
      const produto = produtosMap.get(item.produtoId)!;
      total += Number(produto.preco) * item.quantidade;

      const novaQtd = produto.quantidade - item.quantidade;
      await tx.produto.update({
        where: { id: produto.id },
        data: {
          quantidade: novaQtd,
          ...(novaQtd === 0 ? { status: "ESGOTADO" as const } : {}),
        },
      });
    }

    return tx.pedido.create({
      data: {
        codigo,
        clienteNome,
        clienteWhatsapp,
        total,
        itens: {
          create: itens.map((item: { produtoId: string; quantidade: number }) => {
            const produto = produtosMap.get(item.produtoId)!;
            return {
              produtoId: produto.id,
              codigo: produto.codigo,
              nome: produto.nome,
              quantidade: item.quantidade,
              precoUnitario: produto.preco,
            };
          }),
        },
      },
      include: { itens: true },
    });
  });

  return NextResponse.json(pedido, { status: 201 });
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const pagina = Math.max(1, Number(searchParams.get("pagina") ?? 1));
  const porPagina = Number(searchParams.get("porPagina") ?? 20);

  const where = {
    ...(status ? { status: status as "PENDENTE" | "CONFIRMADO" | "CANCELADO" } : {}),
  };

  const [pedidos, total] = await Promise.all([
    prisma.pedido.findMany({
      where,
      include: { itens: { include: { produto: { select: { slug: true } } } } },
      orderBy: { createdAt: "desc" },
      skip: (pagina - 1) * porPagina,
      take: porPagina,
    }),
    prisma.pedido.count({ where }),
  ]);

  return NextResponse.json({ pedidos, total, pagina, totalPaginas: Math.ceil(total / porPagina) });
}
