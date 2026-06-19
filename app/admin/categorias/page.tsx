import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Tag, Plus } from "lucide-react";

export default async function AdminCategoriasPage() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { nome: "asc" },
    include: { _count: { select: { produtos: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[var(--color-texto)]">Categorias</h1>
          <p className="text-[var(--color-texto-suave)] mt-1">{categorias.length} categorias</p>
        </div>
        <Link
          href="/admin/categorias/nova"
          className="flex items-center gap-2 bg-[var(--color-ouro)] hover:bg-[var(--color-terroso)] text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nova categoria
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categorias.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[var(--color-bege)] overflow-hidden flex-shrink-0">
              {cat.imagemUrl ? (
                <img src={cat.imagemUrl} alt={cat.nome} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Tag className="w-6 h-6 text-[var(--color-ouro)]/60" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--color-texto)] truncate">{cat.nome}</p>
              <p className="text-xs text-[var(--color-texto-suave)]">
                {cat._count.produtos} {cat._count.produtos === 1 ? "produto" : "produtos"}
              </p>
            </div>
            <Link
              href={`/admin/categorias/${cat.id}`}
              className="text-sm text-[var(--color-ouro)] hover:text-[var(--color-terroso)] font-medium transition-colors flex-shrink-0"
            >
              Editar
            </Link>
          </div>
        ))}

        {categorias.length === 0 && (
          <div className="col-span-full flex flex-col items-center py-16 text-[var(--color-texto-suave)] bg-white rounded-2xl border border-gray-100 gap-3">
            <Tag className="w-10 h-10 opacity-30" />
            <p>Nenhuma categoria cadastrada ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
