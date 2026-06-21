import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, CheckCircle, XCircle, Tag, Plus, ShoppingBag } from "lucide-react";

async function getStats() {
  const [total, disponiveis, esgotados, categorias, pedidosPendentes] = await Promise.all([
    prisma.produto.count({ where: { ativo: true } }),
    prisma.produto.count({ where: { ativo: true, status: "DISPONIVEL" } }),
    prisma.produto.count({ where: { ativo: true, status: "ESGOTADO" } }),
    prisma.categoria.count(),
    prisma.pedido.count({ where: { status: "PENDENTE" } }),
  ]);
  return { total, disponiveis, esgotados, categorias, pedidosPendentes };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      titulo: "Total de Produtos",
      valor: stats.total,
      cor: "bg-blue-50 border-blue-200",
      corValor: "text-blue-700",
      Icone: Package,
      corIcone: "text-blue-400",
      href: "/admin/produtos",
    },
    {
      titulo: "Disponíveis",
      valor: stats.disponiveis,
      cor: "bg-green-50 border-green-200",
      corValor: "text-green-700",
      Icone: CheckCircle,
      corIcone: "text-green-400",
      href: "/admin/produtos?status=DISPONIVEL",
    },
    {
      titulo: "Esgotados",
      valor: stats.esgotados,
      cor: "bg-red-50 border-red-200",
      corValor: "text-red-700",
      Icone: XCircle,
      corIcone: "text-red-400",
      href: "/admin/produtos?status=ESGOTADO",
    },
    {
      titulo: "Categorias",
      valor: stats.categorias,
      cor: "bg-amber-50 border-amber-200",
      corValor: "text-amber-700",
      Icone: Tag,
      corIcone: "text-amber-400",
      href: "/admin/categorias",
    },
    {
      titulo: "Pedidos Pendentes",
      valor: stats.pedidosPendentes,
      cor: "bg-purple-50 border-purple-200",
      corValor: "text-purple-700",
      Icone: ShoppingBag,
      corIcone: "text-purple-400",
      href: "/admin/pedidos?status=PENDENTE",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-texto">Dashboard</h1>
        <p className="text-texto-suave mt-1">Visão geral da loja</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {cards.map((card) => (
          <Link
            key={card.titulo}
            href={card.href}
            className={`p-6 rounded-2xl border ${card.cor} hover:shadow-md transition-all hover-lift`}
          >
            <card.Icone className={`w-8 h-8 mb-3 ${card.corIcone}`} />
            <p className={`text-4xl font-bold mb-1 ${card.corValor}`}>{card.valor}</p>
            <p className="text-sm text-texto-suave">{card.titulo}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-texto mb-4">Ações rápidas</h2>
          <div className="space-y-3">
            <Link
              href="/admin/produtos/novo"
              className="flex items-center gap-3 p-4 bg-bege rounded-xl hover:bg-ouro/10 transition-colors"
            >
              <Plus className="w-6 h-6 text-ouro shrink-0" />
              <div>
                <p className="font-medium text-sm text-texto">Novo produto</p>
                <p className="text-xs text-texto-suave">Cadastrar um produto no catálogo</p>
              </div>
            </Link>
            <Link
              href="/admin/categorias/nova"
              className="flex items-center gap-3 p-4 bg-bege rounded-xl hover:bg-ouro/10 transition-colors"
            >
              <Tag className="w-6 h-6 text-ouro shrink-0" />
              <div>
                <p className="font-medium text-sm text-texto">Nova categoria</p>
                <p className="text-xs text-texto-suave">Criar uma nova categoria de produtos</p>
              </div>
            </Link>
            <Link
              href="/admin/pedidos"
              className="flex items-center gap-3 p-4 bg-bege rounded-xl hover:bg-ouro/10 transition-colors"
            >
              <ShoppingBag className="w-6 h-6 text-ouro shrink-0" />
              <div>
                <p className="font-medium text-sm text-texto">Ver pedidos</p>
                <p className="text-xs text-texto-suave">Gerenciar pedidos dos clientes</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-texto mb-4">Estoque resumido</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-texto-suave">Em estoque</span>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 bg-green-400 rounded-full"
                  style={{
                    width: `${stats.total > 0 ? (stats.disponiveis / stats.total) * 120 : 0}px`,
                    minWidth: "8px",
                    maxWidth: "120px",
                  }}
                />
                <span className="text-sm font-medium text-green-700">{stats.disponiveis}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-texto-suave">Esgotados</span>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 bg-red-400 rounded-full"
                  style={{
                    width: `${stats.total > 0 ? (stats.esgotados / stats.total) * 120 : 0}px`,
                    minWidth: "8px",
                    maxWidth: "120px",
                  }}
                />
                <span className="text-sm font-medium text-red-700">{stats.esgotados}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
