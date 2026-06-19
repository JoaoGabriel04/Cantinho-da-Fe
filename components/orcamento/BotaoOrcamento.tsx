"use client";

import { ClipboardList } from "lucide-react";
import { useOrcamento } from "@/store/orcamento";

export function BotaoOrcamento() {
  const abrirDrawer = useOrcamento((s) => s.abrirDrawer);
  const totalItens = useOrcamento((s) => s.totalItens);
  const total = totalItens();

  return (
    <button
      onClick={abrirDrawer}
      className="relative p-2 rounded-lg text-[var(--color-texto-suave)] hover:text-[var(--color-ouro)] hover:bg-[var(--color-bege)] transition-colors"
      aria-label="Lista de orçamento"
    >
      <ClipboardList className="w-6 h-6" />
      {total > 0 && (
        <span className="absolute -top-1 -right-1 bg-[var(--color-ouro)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
          {total > 9 ? "9+" : total}
        </span>
      )}
    </button>
  );
}
