"use client";

import Image from "next/image";
import { useOrcamento } from "@/store/orcamento";
import { montarLinkWhatsapp } from "@/lib/whatsapp";

interface Props {
  aberto: boolean;
  onFechar: () => void;
}

export function DrawerOrcamento({ aberto, onFechar }: Props) {
  const { itens, removerItem, atualizarQuantidade, limparOrcamento } = useOrcamento();

  function enviarOrcamento() {
    if (itens.length === 0) return;
    const link = montarLinkWhatsapp(
      itens.map((i) => ({ codigo: i.codigo, nome: i.nome, quantidade: i.quantidade }))
    );
    limparOrcamento();
    window.open(link, "_blank");
    onFechar();
  }

  const totalPreco = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

  return (
    <>
      {/* Overlay */}
      {aberto && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onFechar}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-[var(--color-creme)] z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          aberto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-ouro)]/20">
          <h2 className="font-serif text-xl text-[var(--color-texto)]">
            Lista de Orçamento
          </h2>
          <button
            onClick={onFechar}
            className="p-2 rounded-lg hover:bg-[var(--color-bege)] text-[var(--color-texto-suave)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Itens */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {itens.length === 0 ? (
            <div className="text-center py-16 text-[var(--color-texto-suave)]">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>Nenhum item adicionado ainda.</p>
            </div>
          ) : (
            itens.map((item) => (
              <div key={item.produtoId} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--color-bege)]">
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
                  <p className="text-sm font-medium text-[var(--color-texto)] truncate">
                    {item.nome}
                  </p>
                  <p className="text-xs text-[var(--color-texto-suave)] mb-2">
                    #{item.codigo} · R$ {item.preco.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => atualizarQuantidade(item.produtoId, item.quantidade - 1)}
                      className="w-7 h-7 rounded-full border border-[var(--color-ouro)]/40 flex items-center justify-center text-[var(--color-ouro)] hover:bg-[var(--color-ouro)] hover:text-white transition-colors text-sm font-bold"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantidade}</span>
                    <button
                      onClick={() => atualizarQuantidade(item.produtoId, item.quantidade + 1)}
                      className="w-7 h-7 rounded-full border border-[var(--color-ouro)]/40 flex items-center justify-center text-[var(--color-ouro)] hover:bg-[var(--color-ouro)] hover:text-white transition-colors text-sm font-bold"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removerItem(item.produtoId)}
                      className="ml-auto text-red-400 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {itens.length > 0 && (
          <div className="px-5 py-4 border-t border-[var(--color-ouro)]/20 space-y-3">
            <div className="flex justify-between text-sm text-[var(--color-texto-suave)]">
              <span>Total estimado:</span>
              <span className="font-bold text-[var(--color-texto)]">
                R$ {totalPreco.toFixed(2)}
              </span>
            </div>
            <button
              onClick={enviarOrcamento}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enviar orçamento via WhatsApp
            </button>
            <button
              onClick={limparOrcamento}
              className="w-full text-sm text-[var(--color-texto-suave)] hover:text-red-500 transition-colors"
            >
              Limpar lista
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
