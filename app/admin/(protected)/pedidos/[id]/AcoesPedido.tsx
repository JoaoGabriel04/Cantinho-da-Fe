"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  clienteWhatsapp: string;
  codigo: string;
  total: number;
}

export function AcoesPedido({ id, clienteWhatsapp, codigo, total }: Props) {
  const router = useRouter();
  const [carregando, setCarregando] = useState<string | null>(null);

  async function alterarStatus(novoStatus: string) {
    setCarregando(novoStatus);
    const res = await fetch(`/api/pedidos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error ?? "Erro ao atualizar pedido");
    }
    setCarregando(null);
  }

  async function confirmarComCliente() {
    setCarregando("CONFIRMADO_COM_CLIENTE");
    const res = await fetch(`/api/pedidos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CONFIRMADO" }),
    });

    if (res.ok) {
      const mensagem =
        `Olá! Seu pedido #${codigo} no Cantinho Religioso foi confirmado com sucesso.\n\n` +
        `Valor total: R$ ${total.toFixed(2).replace(".", ",")}\n\n` +
        `Você pode retirar na loja ou combinar a entrega pelo WhatsApp.` +
        `\n\nAgradecemos pela preferência!`;

      window.open(
        `https://wa.me/${clienteWhatsapp}?text=${encodeURIComponent(mensagem)}`,
        "_blank"
      );
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error ?? "Erro ao atualizar pedido");
    }
    setCarregando(null);
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h2 className="font-semibold text-texto mb-4">Ações</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => alterarStatus("CONFIRMADO")}
          disabled={carregando !== null}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
        >
          {carregando === "CONFIRMADO" ? "Confirmando..." : "✓ Confirmar Pedido"}
        </button>
        <button
          onClick={confirmarComCliente}
          disabled={carregando !== null}
          className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
        >
          {carregando === "CONFIRMADO_COM_CLIENTE" ? "Confirmando..." : "Confirmar e Notificar Cliente"}
        </button>
        <button
          onClick={() => {
            if (confirm("Cancelar este pedido? O estoque será restaurado.")) {
              alterarStatus("CANCELADO");
            }
          }}
          disabled={carregando !== null}
          className="flex-1 border border-red-200 text-red-500 hover:bg-red-50 py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
        >
          {carregando === "CANCELADO" ? "Cancelando..." : "✗ Cancelar Pedido"}
        </button>
      </div>
    </div>
  );
}
