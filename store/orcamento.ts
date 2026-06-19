"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ItemOrcamento {
  produtoId: string;
  codigo: string;
  nome: string;
  preco: number;
  imagemUrl: string;
  quantidade: number;
}

interface OrcamentoStore {
  itens: ItemOrcamento[];
  drawerAberto: boolean;
  abrirDrawer: () => void;
  fecharDrawer: () => void;
  adicionarItem: (item: Omit<ItemOrcamento, "quantidade">, quantidade?: number) => void;
  removerItem: (produtoId: string) => void;
  atualizarQuantidade: (produtoId: string, quantidade: number) => void;
  limparOrcamento: () => void;
  totalItens: () => number;
}

export const useOrcamento = create<OrcamentoStore>()(
  persist(
    (set, get) => ({
      itens: [],
      drawerAberto: false,

      abrirDrawer: () => set({ drawerAberto: true }),
      fecharDrawer: () => set({ drawerAberto: false }),

      adicionarItem: (item, quantidade = 1) => {
        const { itens } = get();
        const existente = itens.find((i) => i.produtoId === item.produtoId);
        if (existente) {
          set({
            itens: itens.map((i) =>
              i.produtoId === item.produtoId
                ? { ...i, quantidade: i.quantidade + quantidade }
                : i
            ),
          });
        } else {
          set({ itens: [...itens, { ...item, quantidade }] });
        }
      },

      removerItem: (produtoId) => {
        set({ itens: get().itens.filter((i) => i.produtoId !== produtoId) });
      },

      atualizarQuantidade: (produtoId, quantidade) => {
        if (quantidade <= 0) {
          get().removerItem(produtoId);
          return;
        }
        set({
          itens: get().itens.map((i) =>
            i.produtoId === produtoId ? { ...i, quantidade } : i
          ),
        });
      },

      limparOrcamento: () => set({ itens: [] }),

      totalItens: () => get().itens.reduce((acc, i) => acc + i.quantidade, 0),
    }),
    {
      name: "cantinho-orcamento",
      partialize: (state) => ({ itens: state.itens }),
    }
  )
);
