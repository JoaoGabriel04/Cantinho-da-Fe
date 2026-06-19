"use client";

import { useState } from "react";
import { useOrcamento } from "@/store/orcamento";
import { DrawerOrcamento } from "./DrawerOrcamento";

export function BotaoOrcamento() {
  const [aberto, setAberto] = useState(false);
  const totalItens = useOrcamento((s) => s.totalItens);
  const total = totalItens();

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="relative p-2 rounded-lg text-[var(--color-texto-suave)] hover:text-[var(--color-ouro)] hover:bg-[var(--color-bege)] transition-colors"
        aria-label="Lista de orçamento"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        {total > 0 && (
          <span className="absolute -top-1 -right-1 bg-[var(--color-ouro)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {total > 9 ? "9+" : total}
          </span>
        )}
      </button>
      <DrawerOrcamento aberto={aberto} onFechar={() => setAberto(false)} />
    </>
  );
}
