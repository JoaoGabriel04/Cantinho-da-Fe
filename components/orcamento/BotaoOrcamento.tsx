"use client";

import { useSyncExternalStore } from "react";
import { ClipboardList } from "lucide-react";
import { useOrcamento } from "@/store/orcamento";

export function BotaoOrcamento() {
  const rehydrated = useSyncExternalStore(
    (cb) => {
      const unsub = useOrcamento.persist.onFinishHydration(() => cb());
      return () => unsub?.();
    },
    () => useOrcamento.persist.hasHydrated(),
    () => false
  );
  const abrirDrawer = useOrcamento((s) => s.abrirDrawer);
  const total = useOrcamento((s) => s.totalItens)();

  return (
    <button
      onClick={() => abrirDrawer()}
      className="relative p-2 rounded-lg text-texto-suave hover:text-ouro hover:bg-bege transition-colors"
      aria-label="Lista de orçamento"
    >
      <ClipboardList className="w-6 h-6" />
      {rehydrated && total > 0 && (
        <span className="absolute -top-1 -right-1 bg-ouro text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
          {total > 9 ? "9+" : total}
        </span>
      )}
    </button>
  );
}
