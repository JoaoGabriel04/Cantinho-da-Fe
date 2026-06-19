import { prisma } from "@/lib/prisma";
import { ProdutoForm } from "@/components/admin/ProdutoForm";

export default async function NovoProdutoPage() {
  const categorias = await prisma.categoria.findMany({ orderBy: { nome: "asc" } });
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-texto">Novo produto</h1>
        <p className="text-texto-suave mt-1">Preencha os dados do produto</p>
      </div>
      <ProdutoForm categorias={categorias} />
    </div>
  );
}
