"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  status: "DISPONIVEL" | "ESGOTADO";
}

export function AlternarStatusBotao({ id, status: statusInicial }: Props) {
  const [status, setStatus] = useState(statusInicial);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function alternar() {
    const novoStatus = status === "DISPONIVEL" ? "ESGOTADO" : "DISPONIVEL";

    startTransition(async () => {
      await fetch(`/api/produtos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });
      setStatus(novoStatus);
      router.refresh();
    });
  }

  return (
    <button
      onClick={alternar}
      disabled={isPending}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        status === "DISPONIVEL"
          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700"
          : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700"
      } ${isPending ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
      title={status === "DISPONIVEL" ? "Clique para marcar como esgotado" : "Clique para marcar como disponível"}
    >
      {isPending ? "..." : status === "DISPONIVEL" ? "✓ Disponível" : "✗ Esgotado"}
    </button>
  );
}
