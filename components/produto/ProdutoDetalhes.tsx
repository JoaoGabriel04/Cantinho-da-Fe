"use client";

import Image from "next/image";
import { useState } from "react";
import { StatusSelo } from "./StatusSelo";
import { ProdutoCard } from "./ProdutoCard";
import { useOrcamento } from "@/store/orcamento";
import { montarLinkWhatsapp } from "@/lib/whatsapp";

interface Imagem {
  id: string;
  url: string;
  ordem: number;
}

interface Produto {
  id: string;
  codigo: string;
  nome: string;
  slug: string;
  descricao: string;
  preco: number;
  status: "DISPONIVEL" | "ESGOTADO";
  categoria: { nome: string; slug: string } | null;
  imagens: Imagem[];
}

interface Props {
  produto: Produto;
  relacionados: Produto[];
}

export function ProdutoDetalhes({ produto, relacionados }: Props) {
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [quantidade, setQuantidade] = useState(1);
  const [adicionado, setAdicionado] = useState(false);
  const adicionarItem = useOrcamento((s) => s.adicionarItem);

  const disponivel = produto.status === "DISPONIVEL";
  const imagens = produto.imagens.sort((a, b) => a.ordem - b.ordem);

  function handleAdicionar() {
    if (!disponivel) return;
    adicionarItem(
      {
        produtoId: produto.id,
        codigo: produto.codigo,
        nome: produto.nome,
        preco: produto.preco,
        imagemUrl: imagens[0]?.url ?? "",
      },
      quantidade
    );
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  }

  function handleComprarDireto() {
    const link = montarLinkWhatsapp([
      { codigo: produto.codigo, nome: produto.nome, quantidade },
    ]);
    window.open(link, "_blank");
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galeria */}
        <div>
          <div className="relative aspect-square bg-bege rounded-2xl overflow-hidden mb-4">
            {imagens[imagemAtiva] ? (
              <Image
                src={imagens[imagemAtiva].url}
                alt={produto.nome}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-texto-suave/20">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          {imagens.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagens.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setImagemAtiva(i)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    i === imagemAtiva
                      ? "border-ouro"
                      : "border-transparent hover:border-ouro/40"
                  }`}
                >
                  <Image src={img.url} alt={`Imagem ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações */}
        <div className="flex flex-col">
          <div className="mb-3">
            <StatusSelo status={produto.status} tamanho="md" />
          </div>
          <p className="text-sm text-texto-suave mb-1">#{produto.codigo}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-texto mb-2 leading-tight">
            {produto.nome}
          </h1>
          {produto.categoria && (
            <a
              href={`/produtos?categoria=${produto.categoria.slug}`}
              className="text-sm text-ouro hover:underline mb-4 inline-block"
            >
              {produto.categoria.nome}
            </a>
          )}

          <p className="text-3xl font-bold text-ouro mb-6">
            R$ {produto.preco.toFixed(2).replace(".", ",")}
          </p>

          {disponivel && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-ouro/30 rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                  className="px-4 py-2 text-ouro hover:bg-bege transition-colors font-bold"
                >
                  −
                </button>
                <span className="px-4 py-2 font-medium text-texto min-w-[3rem] text-center">
                  {quantidade}
                </span>
                <button
                  onClick={() => setQuantidade(quantidade + 1)}
                  className="px-4 py-2 text-ouro hover:bg-bege transition-colors font-bold"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAdicionar}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-medium transition-all duration-200 ${
                  adicionado
                    ? "bg-green-500 text-white"
                    : "border-2 border-ouro text-ouro hover:bg-ouro hover:text-white"
                }`}
              >
                {adicionado ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Adicionado à lista!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Adicionar à lista
                  </>
                )}
              </button>
            </div>
          )}

          <button
            onClick={handleComprarDireto}
            disabled={!disponivel}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-medium text-lg transition-all duration-200 mb-6 bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {disponivel ? "Comprar pelo WhatsApp" : "Produto Esgotado"}
          </button>

          {/* Descrição */}
          <div className="border-t border-ouro/10 pt-6">
            <h2 className="font-serif text-xl text-texto mb-3">Descrição</h2>
            <p className="text-texto-suave leading-relaxed whitespace-pre-wrap">
              {produto.descricao}
            </p>
          </div>
        </div>
      </div>

      {/* Produtos relacionados */}
      {relacionados.length > 0 && (
        <section className="mt-20 pt-12 border-t border-ouro/10">
          <h2 className="font-serif text-2xl text-texto mb-8">
            Você também pode gostar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relacionados.map((p) => (
              <ProdutoCard key={p.id} produto={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
