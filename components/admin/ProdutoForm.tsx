"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Categoria {
  id: string;
  nome: string;
}

interface Imagem {
  id: string;
  url: string;
  ordem: number;
}

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  categoriaId: string;
  status: "DISPONIVEL" | "ESGOTADO";
  destaque: boolean;
  ativo: boolean;
  imagens: Imagem[];
}

interface Props {
  categorias: Categoria[];
  produto?: Produto;
}

type ImagemState =
  | { tipo: "existente"; url: string }
  | { tipo: "novo"; file: File; preview: string };

export function ProdutoForm({ categorias, produto }: Props) {
  const router = useRouter();
  const editando = !!produto;

  const [nome, setNome] = useState(produto?.nome ?? "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [preco, setPreco] = useState(produto?.preco?.toString() ?? "");
  const [quantidade, setQuantidade] = useState(produto?.quantidade ?? 0);
  const [categoriaId, setCategoriaId] = useState(produto?.categoriaId ?? "");
  const [status, setStatus] = useState<"DISPONIVEL" | "ESGOTADO">(produto?.status ?? "DISPONIVEL");
  const [destaque, setDestaque] = useState(produto?.destaque ?? false);
  const [ativo, setAtivo] = useState(produto?.ativo ?? true);
  const [imagens, setImagens] = useState<ImagemState[]>(
    (produto?.imagens.map((i) => ({ tipo: "existente" as const, url: i.url })) ?? [])
  );
  const [enviandoImagens, setEnviandoImagens] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");

  // Limpa blob URLs ao desmontar (cancelamento)
  useEffect(() => {
    return () => {
      imagens.forEach((img) => {
        if (img.tipo === "novo") URL.revokeObjectURL(img.preview);
      });
    };
  }, []);

  function handleSelectArquivos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    const novas = Array.from(files).map((file) => ({
      tipo: "novo" as const,
      file,
      preview: URL.createObjectURL(file),
    }));
    setImagens((prev) => [...prev, ...novas]);
    e.target.value = "";
  }

  function removerImagem(item: ImagemState) {
    if (item.tipo === "novo") URL.revokeObjectURL(item.preview);
    setImagens((prev) => prev.filter((i) => i !== item));
  }

  function definirComoPrincipal(item: ImagemState) {
    setImagens((prev) => [item, ...prev.filter((i) => i !== item)]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!categoriaId) {
      setErro("Selecione uma categoria.");
      return;
    }

    if (imagens.length === 0) {
      setErro("Adicione pelo menos uma imagem.");
      return;
    }

    setSalvando(true);

    try {
      // Sobe as imagens novas para o Cloudinary apenas no momento do submit
      const novasUrls: string[] = [];
      const arquivosNovos = imagens.filter(
        (img): img is { tipo: "novo"; file: File; preview: string } => img.tipo === "novo"
      );

      if (arquivosNovos.length > 0) {
        setEnviandoImagens(true);
        const fd = new FormData();
        arquivosNovos.forEach((n) => fd.append("files", n.file));

        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Erro ao enviar imagens para o Cloudinary");

        const data = await res.json();
        novasUrls.push(...data.urls);
        setEnviandoImagens(false);
      }

      // Monta array final mantendo a ordem definida pelo usuário
      let idxUrl = 0;
      const todasUrls = imagens.map((img) =>
        img.tipo === "existente" ? img.url : novasUrls[idxUrl++]
      );

      const body = {
        nome, descricao, preco: parseFloat(preco),
        quantidade, categoriaId, status, destaque, ativo,
        imagens: todasUrls,
      };

      const res = editando
        ? await fetch(`/api/produtos/${produto!.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
        : await fetch("/api/produtos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

      if (!res.ok) {
        const data = await res.json();
        setErro(data.error ?? "Erro ao salvar o produto.");
        return;
      }

      // Limpa as blob URLs após salvar com sucesso
      imagens.forEach((img) => {
        if (img.tipo === "novo") URL.revokeObjectURL(img.preview);
      });

      router.push("/admin/produtos");
      router.refresh();
    } catch (err) {
      setErro("Erro ao salvar o produto. Verifique as imagens e tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir() {
    if (!produto) return;
    if (!confirm(`Tem certeza que deseja excluir "${produto.nome}"?`)) return;

    setExcluindo(true);
    await fetch(`/api/produtos/${produto.id}`, { method: "DELETE" });
    setExcluindo(false);
    router.push("/admin/produtos");
    router.refresh();
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ouro focus:ring-2 focus:ring-ouro/20 transition-all";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {erro}
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
        <h2 className="font-semibold text-texto">Informações básicas</h2>

        <div>
          <label className="block text-sm font-medium text-texto mb-1.5">Nome *</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className={inputCls}
            placeholder="Ex: Terço de Madeira"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-texto mb-1.5">Descrição *</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            rows={4}
            className={inputCls}
            placeholder="Descreva o produto..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-texto mb-1.5">Preço (R$) *</label>
            <input
              type="number"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
              min="0"
              step="0.01"
              className={inputCls}
              placeholder="0,00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-texto mb-1.5">Categoria *</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className={inputCls}
            >
              <option value="">Selecione...</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Imagens */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h2 className="font-semibold text-texto">Imagens</h2>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-ouro hover:bg-bege transition-all">
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleSelectArquivos} />
          {enviandoImagens ? (
            <div className="flex items-center gap-2 text-texto-suave">
              <div className="w-5 h-5 border-2 border-ouro border-t-transparent rounded-full animate-spin" />
              Enviando imagens para o servidor...
            </div>
          ) : (
            <>
              <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-texto-suave">Clique para selecionar imagens</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG ou WEBP</p>
            </>
          )}
        </label>

        {imagens.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {imagens.map((item, i) => (
              <div key={item.tipo === "existente" ? item.url : item.preview}
                className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => definirComoPrincipal(item)}>
                {item.tipo === "existente" ? (
                  <Image src={item.url} alt={`Imagem ${i + 1}`} fill sizes="(max-width: 640px) 33vw, 200px" className="object-cover" />
                ) : (
                  <img src={item.preview} alt={`Nova imagem ${i + 1}`} className="w-full h-full object-cover" />
                )}
                <button type="button" onClick={(e) => { e.stopPropagation(); removerImagem(item); }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                  ×
                </button>
                {i === 0 && (
                  <span className="absolute bottom-2 left-2 bg-ouro text-white text-xs px-2 py-0.5 rounded-full">
                    Principal
                  </span>
                )}
                {i !== 0 && (
                  <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Definir como principal
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Configurações */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h2 className="font-semibold text-texto">Configurações</h2>

        <div>
          <label className="block text-sm font-medium text-texto mb-2">Status de estoque</label>
          <div className="flex gap-3">
            {(["DISPONIVEL", "ESGOTADO"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                  status === s
                    ? s === "DISPONIVEL"
                      ? "bg-green-50 border-green-500 text-green-700"
                      : "bg-red-50 border-red-500 text-red-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {s === "DISPONIVEL" ? "✓ Disponível" : "✗ Esgotado"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-texto mb-1.5">
            Quantidade em estoque
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden w-36">
              <button
                type="button"
                onClick={() => setQuantidade(Math.max(0, quantidade - 1))}
                className="px-4 py-3 text-texto-suave hover:bg-gray-50 transition-colors font-bold text-lg leading-none"
              >
                −
              </button>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                step="1"
                className="w-full text-center text-sm font-medium text-texto focus:outline-none py-3 bg-transparent"
              />
              <button
                type="button"
                onClick={() => setQuantidade(quantidade + 1)}
                className="px-4 py-3 text-texto-suave hover:bg-gray-50 transition-colors font-bold text-lg leading-none"
              >
                +
              </button>
            </div>
            <span className="text-sm text-texto-suave">
              {quantidade === 0
                ? "Sem estoque"
                : quantidade === 1
                ? "1 unidade"
                : `${quantidade} unidades`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={destaque}
              onChange={(e) => setDestaque(e.target.checked)}
              className="w-4 h-4 accent-ouro"
            />
            <span className="text-sm text-texto">Destaque na home</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              className="w-4 h-4 accent-ouro"
            />
            <span className="text-sm text-texto">Produto ativo (visível)</span>
          </label>
        </div>
      </div>

      {/* Botões */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={salvando}
          className="flex-1 bg-ouro hover:bg-terroso text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
        >
          {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Criar produto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/produtos")}
          className="px-5 py-3 border border-gray-200 rounded-xl text-sm text-texto-suave hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        {editando && (
          <button
            type="button"
            onClick={handleExcluir}
            disabled={excluindo}
            className="px-5 py-3 border border-red-200 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
          >
            {excluindo ? "Excluindo..." : "Excluir"}
          </button>
        )}
      </div>
    </form>
  );
}
