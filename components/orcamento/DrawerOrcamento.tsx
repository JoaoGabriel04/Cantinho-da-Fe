"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Trash2, Minus, Plus, MessageCircle, ShoppingBag, ArrowLeft, Check } from "lucide-react";
import { useOrcamento } from "@/store/orcamento";

const CHAVE_PIX = "jgabrielcastro04@gmail.com";

export function DrawerOrcamento() {
  const {
    itens,
    drawerAberto,
    etapa,
    ultimoPedido,
    fecharDrawer,
    setEtapa,
    removerItem,
    atualizarQuantidade,
    limparOrcamento,
    salvarUltimoPedido,
    limparUltimoPedido,
  } = useOrcamento();

  useEffect(() => {
    if (ultimoPedido) {
      const idade = Date.now() - new Date(ultimoPedido.criadoEm).getTime();
      if (idade >= 7 * 24 * 60 * 60 * 1000) limparUltimoPedido();
    }
  }, [ultimoPedido, limparUltimoPedido]);
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [pedidoCodigo, setPedidoCodigo] = useState("");
  const [pedidoWhatsapp, setPedidoWhatsapp] = useState("");
  const [pedidoTotal, setPedidoTotal] = useState(0);

  function voltarParaLista() {
    setEtapa("lista");
    setNome("");
    setWhatsapp("");
    setErro("");
  }

  function abrirCheckout() {
    setErro("");
    setEtapa("checkout");
  }

  async function handleFinalizar() {
    setErro("");

    const whatsappLimpo = whatsapp.replace(/\s/g, "").replace(/[^\d]/g, "");
    if (!nome.trim()) { setErro("Informe seu nome."); return; }
    if (!whatsappLimpo || whatsappLimpo.length < 10) { setErro("Informe um WhatsApp válido com DDD."); return; }

    setCarregando(true);

    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteNome: nome.trim(),
          clienteWhatsapp: whatsappLimpo,
          itens: itens.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error ?? "Erro ao finalizar pedido.");
        setCarregando(false);
        return;
      }

      setPedidoCodigo(data.codigo);
      setPedidoWhatsapp(whatsappLimpo);
      setPedidoTotal(Number(data.total));
      salvarUltimoPedido({
        codigo: data.codigo,
        total: Number(data.total),
        clienteWhatsapp: whatsappLimpo,
        criadoEm: new Date().toISOString(),
      });
      setEtapa("confirmacao");
      limparOrcamento();
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    }

    setCarregando(false);
  }

  const NUMERO_LOJA = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO;

  function abrirWhatsAppConfirmacao() {
    const corpo =
      `Olá! Finalizei o pedido #${pedidoCodigo} no site Cantinho da Fé no valor de R$ ${pedidoTotal.toFixed(2).replace(".", ",")}.\n\n` +
      `Vou realizar o pagamento via Pix e enviar o comprovante em seguida.`;

    const link = `https://wa.me/${NUMERO_LOJA}?text=${encodeURIComponent(corpo)}`;
    window.open(link, "_blank");
  }

  const totalPreco = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={etapa === "lista" ? fecharDrawer : undefined}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          drawerAberto ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        aria-label="Lista de orçamento"
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-creme z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          drawerAberto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-dourado/30 shrink-0">
          <div className="flex items-center gap-2">
            {etapa !== "lista" && (
              <button onClick={voltarParaLista} className="p-1 text-texto-suave hover:text-texto transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <ShoppingBag className="w-5 h-5 text-dourado" />
            <h2 className="font-serif text-xl text-texto">
              {etapa === "confirmacao" ? "Pedido Confirmado!" : "Finalizar Pedido"}
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

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {etapa === "lista" && (
            <>
              {itens.length === 0 ? (
                <>
                  {ultimoPedido ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="font-serif text-lg text-texto mb-1">Seu último pedido</h3>
                        <p className="text-sm text-texto-suave">Você ainda não adicionou novos itens.</p>
                      </div>

                      <div className="bg-white rounded-xl p-4 border border-dourado/20 space-y-2">
                        <p className="text-sm">
                          <span className="font-medium text-texto">Pedido:</span>{" "}
                          <span className="font-mono text-ouro">{ultimoPedido.codigo}</span>
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-texto">Valor total:</span>{" "}
                          <span className="font-bold text-ouro">
                            R$ {ultimoPedido.total.toFixed(2).replace(".", ",")}
                          </span>
                        </p>
                        <p className="text-xs text-texto-suave">
                          Feito em{" "}
                          {new Date(ultimoPedido.criadoEm).toLocaleDateString("pt-BR", {
                            day: "2-digit", month: "long", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <div className="bg-bege rounded-xl p-4 space-y-2">
                        <h4 className="font-medium text-sm text-texto">Pagamento via Pix</h4>
                        <p className="text-xs text-texto-suave">
                          Pague com Pix e retire na loja, ou pague em dinheiro/cartão na retirada.
                        </p>
                        <div className="bg-white rounded-lg p-3 text-center mt-2">
                          <p className="text-xs text-texto-suave mb-1">Chave Pix (email)</p>
                          <p className="font-mono text-sm font-bold text-ouro select-all">{CHAVE_PIX}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const link = `https://wa.me/${NUMERO_LOJA}?text=${encodeURIComponent(
                            `Olá! Finalizei o pedido #${ultimoPedido.codigo} no site Cantinho da Fé no valor de R$ ${ultimoPedido.total.toFixed(2).replace(".", ",")}.\n\n` +
                            `Vou realizar o pagamento via Pix e enviar o comprovante em seguida.`
                          )}`;
                          window.open(link, "_blank");
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Falar no WhatsApp
                      </button>

                      <button
                        onClick={() => limparUltimoPedido()}
                        className="w-full text-sm text-texto-suave hover:text-red-500 transition-colors py-1"
                      >
                        Descartar pedido
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-texto-suave py-16 gap-3">
                      <ShoppingBag className="w-12 h-12 opacity-30" />
                      <p className="text-sm">Nenhum item adicionado ainda.</p>
                    </div>
                  )}
                </>
              ) : (
                itens.map((item) => (
                  <div key={item.produtoId} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-bege">
                      {item.imagemUrl && (
                        <Image src={item.imagemUrl} alt={item.nome} fill sizes="64px" className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-texto truncate">{item.nome}</p>
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
                        <span className="text-sm font-medium w-6 text-center select-none">{item.quantidade}</span>
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
            </>
          )}

          {etapa === "checkout" && (
            <div className="space-y-4">
              <p className="text-sm text-texto-suave">
                Preencha seus dados para finalizar o pedido. Após a confirmação, você será redirecionado ao WhatsApp.
              </p>

              {erro && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {erro}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-texto mb-1.5">Nome completo *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ouro focus:ring-2 focus:ring-ouro/20 transition-all"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-texto mb-1.5">WhatsApp com DDD *</label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ouro focus:ring-2 focus:ring-ouro/20 transition-all"
                  placeholder="61999999999"
                />
              </div>

              <div className="bg-bege rounded-xl p-4 space-y-2">
                <h3 className="font-medium text-sm text-texto">Resumo do pedido</h3>
                {itens.map((item) => (
                  <div key={item.produtoId} className="flex justify-between text-sm">
                    <span className="text-texto-suave truncate mr-2">
                      {item.nome} × {item.quantidade}
                    </span>
                    <span className="font-medium text-texto">
                      R$ {(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-sm pt-2 border-t border-dourado/20">
                  <span className="font-medium text-texto">Total</span>
                  <span className="font-bold text-ouro">
                    R$ {totalPreco.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {etapa === "confirmacao" && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>

              <div>
                <h3 className="font-serif text-xl text-texto mb-1">Pedido {pedidoCodigo}</h3>
                <p className="text-sm text-texto-suave">
                  Seu pedido foi registrado com sucesso! O estoque já foi reservado.
                </p>
              </div>

              <div className="bg-bege rounded-xl p-4 text-left space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-texto">Valor total:</span>{" "}
                  <span className="text-ouro font-bold">
                    R$ {pedidoTotal.toFixed(2).replace(".", ",")}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-texto">Status:</span>{" "}
                  <span className="text-amber-600 font-medium">Aguardando pagamento</span>
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-dourado/20 text-left space-y-2">
                <h4 className="font-medium text-sm text-texto">Pagamento via Pix</h4>
                <p className="text-xs text-texto-suave">
                  Pague agora com Pix e retire na loja. Ou pague em dinheiro/cartão na retirada.
                </p>
                <div className="bg-bege rounded-lg p-3 text-center">
                  <p className="text-xs text-texto-suave mb-1">Chave Pix (email)</p>
                  <p className="font-mono text-sm font-bold text-ouro select-all">{CHAVE_PIX}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {etapa === "lista" && itens.length > 0 && (
          <div className="px-5 py-4 border-t border-dourado/30 shrink-0 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-texto-suave">Total estimado:</span>
              <span className="font-bold text-texto">
                R$ {totalPreco.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <button
              onClick={abrirCheckout}
              className="w-full flex items-center justify-center gap-2 bg-ouro hover:bg-terroso text-white py-3 rounded-xl font-medium transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Finalizar Pedido
            </button>
            <button
              onClick={limparOrcamento}
              className="w-full text-sm text-texto-suave hover:text-red-500 transition-colors py-1"
            >
              Limpar lista
            </button>
          </div>
        )}

        {etapa === "checkout" && (
          <div className="px-5 py-4 border-t border-dourado/30 shrink-0 space-y-3">
            <button
              onClick={handleFinalizar}
              disabled={carregando}
              className="w-full flex items-center justify-center gap-2 bg-ouro hover:bg-terroso text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
            >
              {carregando ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Finalizando...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Confirmar Pedido
                </>
              )}
            </button>
          </div>
        )}

        {etapa === "confirmacao" && (
          <div className="px-5 py-4 border-t border-dourado/30 shrink-0 space-y-3">
            <button
              onClick={abrirWhatsAppConfirmacao}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </button>
            <button
              onClick={() => { fecharDrawer(); setEtapa("lista"); }}
              className="w-full text-sm text-texto-suave hover:text-texto transition-colors py-1"
            >
              Fechar
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
