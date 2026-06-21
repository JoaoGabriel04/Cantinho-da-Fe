import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, Eye } from "lucide-react";
import { AcaoDeletarPedido } from "./AcaoDeletarPedido";

interface SearchParams {
  status?: string;
  pagina?: string;
}

const rotulosStatus: Record<string, string> = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  CANCELADO: "Cancelado",
};

const coresStatus: Record<string, string> = {
  PENDENTE: "bg-amber-100 text-amber-700",
  CONFIRMADO: "bg-green-100 text-green-700",
  CANCELADO: "bg-red-100 text-red-700",
};

export default async function AdminPedidosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const status = params.status;
  const pagina = Math.max(1, Number(params.pagina) || 1);
  const porPagina = 20;

  const where = {
    ...(status ? { status: status as "PENDENTE" | "CONFIRMADO" | "CANCELADO" } : {}),
  };

  const [pedidos, total] = await Promise.all([
    prisma.pedido.findMany({
      where,
      include: { itens: true },
      orderBy: { createdAt: "desc" },
      skip: (pagina - 1) * porPagina,
      take: porPagina,
    }),
    prisma.pedido.count({ where }),
  ]);

  const totalPaginas = Math.ceil(total / porPagina);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-texto">Pedidos</h1>
        <p className="text-texto-suave mt-1">{total} pedidos</p>
      </div>

      <form method="GET" className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-3">
        <select name="status" defaultValue={status ?? ""}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ouro">
          <option value="">Todos os status</option>
          <option value="PENDENTE">Pendente</option>
          <option value="CONFIRMADO">Confirmado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
        <button type="submit"
          className="bg-ouro text-white px-4 py-2 rounded-lg text-sm hover:bg-terroso transition-colors">
          Filtrar
        </button>
        {status && (
          <Link href="/admin/pedidos" className="text-sm text-red-500 hover:text-red-700 px-3 py-2">
            Limpar
          </Link>
        )}
      </form>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        {pedidos.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-texto-suave gap-3">
            <ShoppingBag className="w-10 h-10 opacity-30" />
            <p>Nenhum pedido encontrado.</p>
          </div>
        ) : (
          <table className="min-w-200 w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-texto-suave">Pedido</th>
                <th className="text-left px-5 py-3 font-medium text-texto-suave">Cliente</th>
                <th className="text-left px-5 py-3 font-medium text-texto-suave">Itens</th>
                <th className="text-left px-5 py-3 font-medium text-texto-suave">Total</th>
                <th className="text-left px-5 py-3 font-medium text-texto-suave">Status</th>
                <th className="text-left px-5 py-3 font-medium text-texto-suave">Data</th>
                <th className="text-left px-5 py-3 font-medium text-texto-suave">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-mono text-texto-suave">
                    {pedido.codigo}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-texto">{pedido.clienteNome}</p>
                    <p className="text-xs text-texto-suave">{pedido.clienteWhatsapp}</p>
                  </td>
                  <td className="px-5 py-4 text-texto-suave">
                    {pedido.itens.reduce((acc, i) => acc + i.quantidade, 0)} itens
                  </td>
                  <td className="px-5 py-4 font-medium text-texto">
                    R$ {Number(pedido.total).toFixed(2).replace(".", ",")}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${coresStatus[pedido.status]}`}>
                      {rotulosStatus[pedido.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-texto-suave text-xs whitespace-nowrap">
                    {new Date(pedido.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/pedidos/${pedido.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-ouro hover:text-terroso transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Detalhes
                      </Link>
                      {pedido.status !== "PENDENTE" && (
                        <AcaoDeletarPedido pedidoId={pedido.id} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/pedidos?pagina=${p}${status ? `&status=${status}` : ""}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                p === pagina ? "bg-ouro text-white" : "bg-white text-texto-suave hover:bg-gray-100"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
