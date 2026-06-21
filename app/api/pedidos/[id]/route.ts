import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;

  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: { itens: { include: { produto: { select: { slug: true } } } } },
  });

  if (!pedido) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  return NextResponse.json(pedido);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { status: novoStatus } = body;

  if (!["PENDENTE", "CONFIRMADO", "CANCELADO"].includes(novoStatus)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: { itens: true },
  });

  if (!pedido) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    // Se está cancelando um pedido pendente, restaura o estoque
    if (novoStatus === "CANCELADO" && pedido.status === "PENDENTE") {
      for (const item of pedido.itens) {
        const produto = await tx.produto.findUnique({ where: { id: item.produtoId } });
        if (produto) {
          await tx.produto.update({
            where: { id: item.produtoId },
            data: {
              quantidade: produto.quantidade + item.quantidade,
              status: "DISPONIVEL",
            },
          });
        }
      }
    }

    await tx.pedido.update({
      where: { id },
      data: { status: novoStatus },
    });
  });

  const atualizado = await prisma.pedido.findUnique({
    where: { id },
    include: { itens: { include: { produto: { select: { slug: true } } } } },
  });

  return NextResponse.json(atualizado);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;

  const pedido = await prisma.pedido.findUnique({ where: { id } });
  if (!pedido) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  if (pedido.status === "PENDENTE") {
    return NextResponse.json({ error: "Só é possível excluir pedidos confirmados ou cancelados." }, { status: 400 });
  }

  await prisma.pedido.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
