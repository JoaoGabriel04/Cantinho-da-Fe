import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AcoesPedido } from "./AcoesPedido";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
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

export default async function PedidoDetalhePage({ params }: Props) {
  const { id } = await params;

  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: { itens: true },
  });

  if (!pedido) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link href="/admin/pedidos" className="flex gap-2 items-center text-texto-suave text-xs">
          <ArrowLeft size={10}/>
          Voltar
        </Link>
        <h1 className="font-serif text-3xl text-texto">
          Pedido {pedido.codigo}
        </h1>
        <p className="text-texto-suave mt-1">
          Aberto em {new Date(pedido.createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit", month: "long", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </p>
      </div>

      <div className="space-y-6">
        {/* Cliente */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-texto mb-4">Cliente</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-texto-suave">Nome</span>
              <span className="font-medium text-texto">{pedido.clienteNome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-texto-suave">WhatsApp</span>
              <a
                href={`https://wa.me/${pedido.clienteWhatsapp}`}
                target="_blank"
                className="font-medium text-green-600 hover:underline"
              >
                {pedido.clienteWhatsapp}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-texto-suave">Status</span>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${coresStatus[pedido.status]}`}>
                {rotulosStatus[pedido.status]}
              </span>
            </div>
          </div>
        </div>

        {/* Itens */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-texto mb-4">Itens</h2>
          <div className="divide-y divide-gray-100">
            {pedido.itens.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-texto">
                    #{item.codigo} — {item.nome}
                  </p>
                  <p className="text-xs text-texto-suave">
                    R$ {Number(item.precoUnitario).toFixed(2).replace(".", ",")} cada
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-texto">
                    {item.quantidade}x
                  </p>
                  <p className="text-xs text-texto-suave">
                    R$ {(Number(item.precoUnitario) * item.quantidade).toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100">
            <span className="font-semibold text-texto">Total</span>
            <span className="font-bold text-lg text-ouro">
              R$ {Number(pedido.total).toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        {/* Pix */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-texto mb-2">Pagamento</h2>
          <p className="text-sm text-texto-suave mb-3">
            Este pedido ainda não possui pagamento integrado. Informe o cliente:
          </p>
          <div className="bg-bege rounded-xl p-4 space-y-2">
            <p className="text-sm">
              <span className="font-medium text-texto">Pix:</span>{" "}
              <span className="text-ouro font-mono">jgabrielcastro04@gmail.com</span>
            </p>
            <p className="text-xs text-texto-suave">
              O cliente pode pagar por Pix agora ou em dinheiro/cartão na retirada.
            </p>
          </div>
        </div>

        {/* Ações */}
        {pedido.status === "PENDENTE" && (
          <AcoesPedido
            id={pedido.id}
            clienteWhatsapp={pedido.clienteWhatsapp}
            codigo={pedido.codigo}
            total={Number(pedido.total)}
          />
        )}
      </div>
    </div>
  );
}
