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

export interface UltimoPedidoSalvo {
  codigo: string;
  total: number;
  clienteWhatsapp: string;
  criadoEm: string;
}

type EtapaDrawer = "lista" | "checkout" | "confirmacao";

interface OrcamentoStore {
  itens: ItemOrcamento[];
  drawerAberto: boolean;
  etapa: EtapaDrawer;
  ultimoPedido: UltimoPedidoSalvo | null;
  abrirDrawer: (checkout?: boolean) => void;
  fecharDrawer: () => void;
  setEtapa: (etapa: EtapaDrawer) => void;
  adicionarItem: (item: Omit<ItemOrcamento, "quantidade">, quantidade?: number) => void;
  removerItem: (produtoId: string) => void;
  atualizarQuantidade: (produtoId: string, quantidade: number) => void;
  limparOrcamento: () => void;
  limparUltimoPedido: () => void;
  salvarUltimoPedido: (pedido: UltimoPedidoSalvo) => void;
  totalItens: () => number;
}

export const useOrcamento = create<OrcamentoStore>()(
  persist(
    (set, get) => ({
      itens: [],
      drawerAberto: false,
      etapa: "lista",
      ultimoPedido: null,

      abrirDrawer: (checkout = false) => set({ drawerAberto: true, etapa: checkout ? "checkout" : "lista" }),
      fecharDrawer: () => set({ drawerAberto: false, etapa: "lista" }),
      setEtapa: (etapa) => set({ etapa }),

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

      salvarUltimoPedido: (pedido) => set({ ultimoPedido: pedido }),

      limparUltimoPedido: () => set({ ultimoPedido: null }),

      totalItens: () => get().itens.reduce((acc, i) => acc + i.quantidade, 0),
    }),
    {
      name: "cantinho-orcamento",
      partialize: (state) => ({ itens: state.itens, ultimoPedido: state.ultimoPedido }),
    }
  )
);
