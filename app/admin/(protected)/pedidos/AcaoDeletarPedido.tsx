"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export function AcaoDeletarPedido({ pedidoId }: { pedidoId: string }) {
  const [carregando, setCarregando] = useState(false);

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;

    setCarregando(true);
    try {
      const res = await fetch(`/api/pedidos/${pedidoId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "Erro ao excluir.");
      } else {
        window.location.reload();
      }
    } catch {
      alert("Erro de conexão.");
    }
    setCarregando(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={carregando}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
      {carregando ? "Excluindo..." : "Excluir"}
    </button>
  );
}
