import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoriaForm } from "@/components/admin/CategoriaForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarCategoriaPage({ params }: Props) {
  const { id } = await params;
  const categoria = await prisma.categoria.findUnique({ where: { id } });
  if (!categoria) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--color-texto)]">Editar categoria</h1>
        <p className="text-[var(--color-texto-suave)] mt-1">{categoria.nome}</p>
      </div>
      <CategoriaForm categoria={categoria} />
    </div>
  );
}
