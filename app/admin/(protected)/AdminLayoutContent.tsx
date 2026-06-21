"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { useViewportHeight } from "@/hooks/useViewportHeight";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/categorias", label: "Categorias" },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const ativo = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClick}
            className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              ativo
                ? "bg-ouro text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

export function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const vh = useViewportHeight();

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-texto text-white flex items-center justify-between px-4 h-14">
        <h1 className="font-serif text-base text-ouro-suave">✦ Cantinho da Fé</h1>
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
        >
          {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay menu */}
      {menuAberto && (
        <div className="lg:hidden fixed inset-0 z-20 bg-texto pt-14 flex flex-col">
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <NavLinks onClick={() => setMenuAberto(false)} />
          </nav>
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link
              href="/"
              onClick={() => setMenuAberto(false)}
              className="block px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm"
            >
              Ver site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="w-full text-left px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm"
            >
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="w-64 bg-texto text-white shrink-0 hidden lg:flex flex-col sticky top-0" style={{ height: vh }}>
        <div className="p-6 border-b border-white/10 shrink-0">
          <h1 className="font-serif text-lg text-ouro-suave">✦ Cantinho da Fé</h1>
          <p className="text-xs text-white/40 mt-1">Painel Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-white/10 space-y-2 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ver site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 pt-14 lg:pt-0 p-4 lg:p-8 overflow-auto ${menuAberto ? "hidden lg:block" : ""}`}>
        {children}
      </main>
    </>
  );
}
