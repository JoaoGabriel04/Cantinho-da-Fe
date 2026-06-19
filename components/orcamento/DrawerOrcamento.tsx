"use client";

import Image from "next/image";
import { X, Trash2, Minus, Plus, MessageCircle, FileText } from "lucide-react";
import { useOrcamento } from "@/store/orcamento";
import { montarLinkWhatsapp } from "@/lib/whatsapp";

export function DrawerOrcamento() {
  const {
    itens,
    drawerAberto,
    fecharDrawer,
    removerItem,
    atualizarQuantidade,
    limparOrcamento,
  } = useOrcamento();

  function enviarOrcamento() {
    if (itens.length === 0) return;
    const link = montarLinkWhatsapp(
      itens.map((i) => ({ codigo: i.codigo, nome: i.nome, quantidade: i.quantidade }))
    );
    limparOrcamento();
    fecharDrawer();
    window.open(link, "_blank");
  }

  const totalPreco = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

  return (
    <>
      {/* Overlay — sempre no DOM, opacidade controlada */}
      <div
        aria-hidden="true"
        onClick={fecharDrawer}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          drawerAberto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        aria-label="Lista de orçamento"
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-creme z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          drawerAberto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dourado/30 flex-shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-dourado" />
            <h2 className="font-serif text-xl text-texto">
              Lista de Orçamento
            </h2>
          </div>
          <button
            onClick={fecharDrawer}
            className="p-2 rounded-lg hover:bg-bege text-texto-suave transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Itens */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {itens.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-texto-suave py-16 gap-3">
              <FileText className="w-12 h-12 opacity-30" />
              <p className="text-sm">Nenhum item adicionado ainda.</p>
            </div>
          ) : (
            itens.map((item) => (
              <div key={item.produtoId} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-bege">
                  {item.imagemUrl && (
                    <Image
                      src={item.imagemUrl}
                      alt={item.nome}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-texto truncate">
                    {item.nome}
                  </p>
                  <p className="text-xs text-texto-suave mb-2">
                    #{item.codigo} · R$ {item.preco.toFixed(2).replace(".", ",")}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => atualizarQuantidade(item.produtoId, item.quantidade - 1)}
                      className="w-7 h-7 rounded-full border border-dourado/50 flex items-center justify-center text-dourado hover:bg-dourado hover:text-white transition-colors"
                      aria-label="Diminuir"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center select-none">
                      {item.quantidade}
                    </span>
                    <button
                      onClick={() => atualizarQuantidade(item.produtoId, item.quantidade + 1)}
                      className="w-7 h-7 rounded-full border border-dourado/50 flex items-center justify-center text-dourado hover:bg-dourado hover:text-white transition-colors"
                      aria-label="Aumentar"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removerItem(item.produtoId)}
                      className="ml-auto text-red-400 hover:text-red-600 transition-colors p-1"
                      aria-label="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {itens.length > 0 && (
          <div className="px-5 py-4 border-t border-dourado/30 flex-shrink-0 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-texto-suave">Total estimado:</span>
              <span className="font-bold text-texto">
                R$ {totalPreco.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <button
              onClick={enviarOrcamento}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Enviar orçamento via WhatsApp
            </button>
            <button
              onClick={limparOrcamento}
              className="w-full text-sm text-texto-suave hover:text-red-500 transition-colors py-1"
            >
              Limpar lista
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
