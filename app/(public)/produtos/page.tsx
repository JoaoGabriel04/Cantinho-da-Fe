import { prisma } from "@/lib/prisma";
import { ProdutoCard } from "@/components/produto/ProdutoCard";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de Produtos",
  description: "Explore nosso catálogo completo de artigos religiosos. Terços, bíblias, imagens, decoração e muito mais.",
};

interface SearchParams {
  categoria?: string;
  status?: string;
  busca?: string;
  pagina?: string;
}

const POR_PAGINA = 16;

async function getDados(params: SearchParams) {
  const pagina = Math.max(1, Number(params.pagina ?? 1));
  const skip = (pagina - 1) * POR_PAGINA;

  const where = {
    ativo: true,
    ...(params.categoria && { categoria: { slug: params.categoria } }),
    ...(params.status === "disponivel" && { status: "DISPONIVEL" as const }),
    ...(params.status === "esgotado" && { status: "ESGOTADO" as const }),
    ...(params.busca && {
      nome: { contains: params.busca, mode: "insensitive" as const },
    }),
  };

  const [produtos, total, categorias] = await Promise.all([
    prisma.produto.findMany({
      where,
      include: { imagens: true },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      skip,
      take: POR_PAGINA,
    }),
    prisma.produto.count({ where }),
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
  ]);

  return { produtos, total, categorias, pagina, totalPaginas: Math.ceil(total / POR_PAGINA) };
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { produtos, total, categorias, pagina, totalPaginas } = await getDados(params);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Cabeçalho */}
      <div className="gsap-fade-up mb-10">
        <h1 className="font-serif text-4xl text-texto mb-2">Catálogo</h1>
        <p className="text-texto-suave">
          {total} {total === 1 ? "produto encontrado" : "produtos encontrados"}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filtros */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-5 border border-ouro/10 shadow-sm sticky top-24">
            <h2 className="font-semibold text-texto mb-4">Filtros</h2>

            {/* Busca */}
            <form method="GET" className="mb-5">
              {params.categoria && <input type="hidden" name="categoria" value={params.categoria} />}
              {params.status && <input type="hidden" name="status" value={params.status} />}
              <label className="block text-xs font-medium text-texto-suave uppercase tracking-wider mb-2">
                Buscar
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="busca"
                  defaultValue={params.busca}
                  placeholder="Nome do produto..."
                  className="min-w-0 flex-1 border border-ouro/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ouro focus:ring-1 focus:ring-ouro"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 bg-ouro text-white px-3 py-2 rounded-lg text-sm hover:bg-terroso transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Categorias */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-texto-suave uppercase tracking-wider mb-2">
                Categoria
              </label>
              <div className="space-y-1">
                <Link
                  href={`/produtos?${new URLSearchParams({ ...(params.busca ? { busca: params.busca } : {}), ...(params.status ? { status: params.status } : {}) }).toString()}`}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!params.categoria ? "bg-ouro text-white" : "text-texto-suave hover:bg-bege"}`}
                >
                  Todas
                </Link>
                {categorias.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/produtos?${new URLSearchParams({ categoria: cat.slug, ...(params.busca ? { busca: params.busca } : {}), ...(params.status ? { status: params.status } : {}) }).toString()}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${params.categoria === cat.slug ? "bg-ouro text-white" : "text-texto-suave hover:bg-bege"}`}
                  >
                    {cat.nome}
                  </Link>
                ))}
              </div>
            </div>

            {/* Disponibilidade */}
            <div>
              <label className="block text-xs font-medium text-texto-suave uppercase tracking-wider mb-2">
                Disponibilidade
              </label>
              <div className="space-y-1">
                {[
                  { label: "Todos", value: "" },
                  { label: "Disponível", value: "disponivel" },
                  { label: "Esgotado", value: "esgotado" },
                ].map((opt) => (
                  <Link
                    key={opt.value}
                    href={`/produtos?${new URLSearchParams({ ...(params.categoria ? { categoria: params.categoria } : {}), ...(params.busca ? { busca: params.busca } : {}), ...(opt.value ? { status: opt.value } : {}) }).toString()}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${(params.status ?? "") === opt.value ? "bg-ouro text-white" : "text-texto-suave hover:bg-bege"}`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Grid de produtos */}
        <div className="flex-1">
          {produtos.length === 0 ? (
            <div className="text-center py-20 text-texto-suave">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <p className="text-lg font-medium mb-2">Nenhum produto encontrado</p>
              <p className="text-sm">Tente outros filtros ou termos de busca.</p>
            </div>
          ) : (
            <>
              <div className="gsap-stagger grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {produtos.map((produto) => (
                  <ProdutoCard
                    key={produto.id}
                    produto={{
                      ...produto,
                      preco: Number(produto.preco),
                      imagens: produto.imagens,
                    }}
                  />
                ))}
              </div>

              {/* Paginação */}
              {totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {pagina > 1 && (
                    <Link
                      href={`/produtos?${new URLSearchParams({ ...params, pagina: String(pagina - 1) }).toString()}`}
                      className="px-4 py-2 rounded-lg border border-ouro/30 text-ouro hover:bg-ouro hover:text-white transition-colors"
                    >
                      ← Anterior
                    </Link>
                  )}
                  <span className="text-sm text-texto-suave px-4">
                    Página {pagina} de {totalPaginas}
                  </span>
                  {pagina < totalPaginas && (
                    <Link
                      href={`/produtos?${new URLSearchParams({ ...params, pagina: String(pagina + 1) }).toString()}`}
                      className="px-4 py-2 rounded-lg border border-ouro/30 text-ouro hover:bg-ouro hover:text-white transition-colors"
                    >
                      Próxima →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
