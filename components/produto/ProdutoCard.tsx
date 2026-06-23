"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { StatusSelo } from "./StatusSelo";
import MarqueeText from "./MarqueeText";
import { useOrcamento } from "@/store/orcamento";

interface Produto {
  id: string;
  codigo: string;
  nome: string;
  slug: string;
  preco: number;
  status: "DISPONIVEL" | "ESGOTADO";
  imagens: { url: string; ordem: number }[];
}

interface Props {
  produto: Produto;
}

export function ProdutoCard({ produto }: Props) {
  const [adicionado, setAdicionado] = useState(false);
  const adicionarItem = useOrcamento((s) => s.adicionarItem);
  const imagemPrincipal = produto.imagens.sort((a, b) => a.ordem - b.ordem)[0]?.url;
  const disponivel = produto.status === "DISPONIVEL";

  function handleAdicionar(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!disponivel) return;
    adicionarItem({
      produtoId: produto.id,
      codigo: produto.codigo,
      nome: produto.nome,
      preco: produto.preco,
      imagemUrl: imagemPrincipal ?? "",
    });
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 1500);
  }

  return (
    <Link href={`/produtos/${produto.slug}`} className="group block">
      <div className={`bg-white rounded-xl overflow-hidden shadow-sm hover-lift border border-ouro/10 ${!disponivel ? "opacity-70" : ""}`}>
        {/* Imagem */}
        <div className="relative aspect-square bg-bege overflow-hidden">
          {imagemPrincipal ? (
            <Image
              src={imagemPrincipal}
              alt={produto.nome}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-texto-suave/30">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <StatusSelo status={produto.status} />
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[9px] text-texto-suave mb-1">#{produto.codigo}</p>
          <MarqueeText className="font-medium text-texto mb-2 leading-snug">
            {produto.nome}
          </MarqueeText>
          <div className="flex items-center justify-between gap-2">
            <span className="text-base font-bold text-ouro">
              R$ {produto.preco.toFixed(2).replace(".", ",")}
            </span>
            {disponivel && (
              <button
                onClick={handleAdicionar}
                className={`flex items-center gap-1.5 text-[10px] font-medium px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200 ${
                  adicionado
                    ? "bg-green-500 text-white"
                    : "bg-dourado-claro text-dourado hover:bg-dourado hover:text-white border border-dourado/40"
                }`}
              >
                {adicionado ? (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="hidden md:flex">Adicionado</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden md:flex">Adicionar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
