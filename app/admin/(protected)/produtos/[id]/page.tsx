import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProdutoForm } from "@/components/admin/ProdutoForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarProdutoPage({ params }: Props) {
  const { id } = await params;
  const [produto, categorias] = await Promise.all([
    prisma.produto.findUnique({
      where: { id },
      include: { imagens: { orderBy: { ordem: "asc" } } },
    }),
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
  ]);

  if (!produto) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-texto">Editar produto</h1>
        <p className="text-texto-suave mt-1">#{produto.codigo} — {produto.nome}</p>
      </div>
      <ProdutoForm
        categorias={categorias}
        produto={{
          ...produto,
          preco: Number(produto.preco),
          quantidade: produto.quantidade,
        }}
      />
    </div>
  );
}
