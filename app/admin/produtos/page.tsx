import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { AlternarStatusBotao } from "@/components/admin/AlternarStatusBotao";

interface SearchParams {
  busca?: string;
  status?: string;
  categoria?: string;
}

export default async function AdminProdutosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const produtos = await prisma.produto.findMany({
    where: {
      ...(params.busca ? { nome: { contains: params.busca, mode: "insensitive" } } : {}),
      ...(params.status ? { status: params.status as "DISPONIVEL" | "ESGOTADO" } : {}),
      ...(params.categoria ? { categoria: { slug: params.categoria } } : {}),
    },
    include: { imagens: true, categoria: true },
    orderBy: { createdAt: "desc" },
  });

  const categorias = await prisma.categoria.findMany({ orderBy: { nome: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[var(--color-texto)]">Produtos</h1>
          <p className="text-[var(--color-texto-suave)] mt-1">{produtos.length} produtos</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 bg-[var(--color-ouro)] hover:bg-[var(--color-terroso)] text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Novo produto
        </Link>
      </div>

      {/* Filtros */}
      <form method="GET" className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          name="busca"
          defaultValue={params.busca}
          placeholder="Buscar por nome..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-40 focus:outline-none focus:border-[var(--color-ouro)]"
        />
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-ouro)]"
        >
          <option value="">Todos os status</option>
          <option value="DISPONIVEL">Disponível</option>
          <option value="ESGOTADO">Esgotado</option>
        </select>
        <select
          name="categoria"
          defaultValue={params.categoria ?? ""}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-ouro)]"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.nome}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-[var(--color-ouro)] text-white px-4 py-2 rounded-lg text-sm hover:bg-[var(--color-terroso)] transition-colors"
        >
          Filtrar
        </button>
        {(params.busca || params.status || params.categoria) && (
          <Link href="/admin/produtos" className="text-sm text-red-500 hover:text-red-700 px-3 py-2">
            Limpar
          </Link>
        )}
      </form>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {produtos.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-[var(--color-texto-suave)] gap-3">
            <Package className="w-10 h-10 opacity-30" />
            <p>Nenhum produto encontrado.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-[var(--color-texto-suave)]">Produto</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--color-texto-suave)]">Categoria</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--color-texto-suave)]">Preço</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--color-texto-suave)]">Status</th>
                <th className="text-left px-5 py-3 font-medium text-[var(--color-texto-suave)]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {produtos.map((produto) => (
                <tr key={produto.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-bege)] overflow-hidden flex-shrink-0">
                        {produto.imagens[0] && (
                          <img
                            src={produto.imagens[0].url}
                            alt={produto.nome}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-texto)]">{produto.nome}</p>
                        <p className="text-xs text-[var(--color-texto-suave)]">#{produto.codigo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-texto-suave)]">
                    {produto.categoria?.nome ?? "—"}
                  </td>
                  <td className="px-5 py-4 font-medium text-[var(--color-texto)]">
                    R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
                  </td>
                  <td className="px-5 py-4">
                    <AlternarStatusBotao id={produto.id} status={produto.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/produtos/${produto.id}`}
                        className="text-[var(--color-ouro)] hover:text-[var(--color-terroso)] font-medium transition-colors"
                      >
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
