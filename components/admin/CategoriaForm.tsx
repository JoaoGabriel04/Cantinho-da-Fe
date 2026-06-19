"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Categoria {
  id: string;
  nome: string;
  imagemUrl: string | null;
}

interface Props {
  categoria?: Categoria;
}

export function CategoriaForm({ categoria }: Props) {
  const router = useRouter();
  const editando = !!categoria;

  const [nome, setNome] = useState(categoria?.nome ?? "");
  const [imagemUrl, setImagemUrl] = useState(categoria?.imagemUrl ?? "");
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");

  async function handleUploadImagem(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setEnviandoImagem(true);
    const fd = new FormData();
    fd.append("files", arquivo);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setImagemUrl(data.urls[0]);
    setEnviandoImagem(false);
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    const body = { nome, imagemUrl: imagemUrl || null };
    const res = editando
      ? await fetch(`/api/categorias/${categoria!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/categorias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    setSalvando(false);

    if (!res.ok) {
      const data = await res.json();
      setErro(data.error ?? "Erro ao salvar.");
      return;
    }

    router.push("/admin/categorias");
    router.refresh();
  }

  async function handleExcluir() {
    if (!categoria) return;
    if (!confirm(`Excluir "${categoria.nome}"? Produtos associados serão desvinculados.`)) return;
    setExcluindo(true);
    await fetch(`/api/categorias/${categoria.id}`, { method: "DELETE" });
    setExcluindo(false);
    router.push("/admin/categorias");
    router.refresh();
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ouro focus:ring-2 focus:ring-ouro/20 transition-all";

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-6">
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {erro}
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-texto mb-1.5">
            Nome da categoria *
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className={inputCls}
            placeholder="Ex: Terços e Rosários"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-texto mb-2">
            Imagem de capa (opcional)
          </label>

          {imagemUrl ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3">
              <Image src={imagemUrl} alt="Capa" fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImagemUrl("")}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition-colors"
              >
                Remover
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-ouro hover:bg-bege transition-all">
              <input type="file" accept="image/*" className="hidden" onChange={handleUploadImagem} />
              {enviandoImagem ? (
                <div className="flex items-center gap-2 text-texto-suave">
                  <div className="w-4 h-4 border-2 border-ouro border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </div>
              ) : (
                <p className="text-sm text-texto-suave">Clique para selecionar imagem</p>
              )}
            </label>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={salvando}
          className="flex-1 bg-ouro hover:bg-terroso text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60"
        >
          {salvando ? "Salvando..." : editando ? "Salvar" : "Criar categoria"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categorias")}
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
            {excluindo ? "..." : "Excluir"}
          </button>
        )}
      </div>
    </form>
  );
}
