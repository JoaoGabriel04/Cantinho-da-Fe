"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const resultado = await signIn("credentials", {
      email,
      senha,
      redirect: false,
    });

    setCarregando(false);

    if (resultado?.error) {
      setErro("E-mail ou senha incorretos.");
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-bege flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-texto mb-1">
            ✦ Cantinho da Fé
          </h1>
          <p className="text-texto-suave text-sm">Painel Administrativo</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 shadow-sm border border-ouro/10"
        >
          <h2 className="font-serif text-xl text-texto mb-6">Entrar</h2>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {erro}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-texto mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full border border-ouro/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ouro focus:ring-2 focus:ring-ouro/20 transition-all"
                placeholder="admin@loja.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-texto mb-1.5">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full border border-ouro/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ouro focus:ring-2 focus:ring-ouro/20 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full mt-6 bg-ouro hover:bg-terroso text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm text-texto-suave hover:text-ouro transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao site
        </Link>
      </div>
    </div>
  );
}
