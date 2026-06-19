import { CategoriaForm } from "@/components/admin/CategoriaForm";

export default function NovaCategoriaPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--color-texto)]">Nova categoria</h1>
        <p className="text-[var(--color-texto-suave)] mt-1">Preencha os dados da categoria</p>
      </div>
      <CategoriaForm />
    </div>
  );
}
