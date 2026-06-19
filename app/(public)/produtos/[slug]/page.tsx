import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProdutoDetalhes } from "@/components/produto/ProdutoDetalhes";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduto(slug: string) {
  return prisma.produto.findUnique({
    where: { slug, ativo: true },
    include: { imagens: true, categoria: true },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const produto = await getProduto(slug);
  if (!produto) return { title: "Produto não encontrado" };

  return {
    title: produto.nome,
    description: produto.descricao.slice(0, 160),
    openGraph: {
      images: produto.imagens[0]?.url ? [{ url: produto.imagens[0].url }] : [],
    },
  };
}

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params;
  const produto = await getProduto(slug);
  if (!produto) notFound();

  const relacionados = await prisma.produto.findMany({
    where: { categoriaId: produto.categoriaId, ativo: true, id: { not: produto.id } },
    include: { imagens: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--color-texto-suave)] mb-8 flex items-center gap-2">
        <a href="/" className="hover:text-[var(--color-ouro)] transition-colors">Início</a>
        <span>/</span>
        <a href="/produtos" className="hover:text-[var(--color-ouro)] transition-colors">Catálogo</a>
        <span>/</span>
        <span className="text-[var(--color-texto)] truncate max-w-48">{produto.nome}</span>
      </nav>

      <ProdutoDetalhes
        produto={{
          ...produto,
          preco: Number(produto.preco),
          imagens: produto.imagens,
          categoria: produto.categoria,
        }}
        relacionados={relacionados.map((p) => ({
          ...p,
          preco: Number(p.preco),
          imagens: p.imagens,
          categoria: null,
        }))}
      />
    </div>
  );
}
