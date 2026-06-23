import Link from "next/link";

export function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-texto text-bege mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Sobre */}
          <div>
            <h3 className="font-serif text-xl text-ouro-suave mb-4">
              ✦ Cantinho da Fé
            </h3>
            <p className="text-sm text-bege/70 leading-relaxed">
              Com amor e fé, levamos artigos religiosos de qualidade até você.
              Atendimento humanizado e direto pelo WhatsApp.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-ouro-suave mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Início" },
                { href: "/produtos", label: "Catálogo" },
                { href: "/sobre", label: "Sobre nós" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-bege/70 hover:text-ouro-suave transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-ouro-suave mb-4">Contato</h4>
            <div className="space-y-3 text-sm text-bege/70">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-ouro-suave shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>Rua Vicente Santana, 117<br />Centro — Grajaú, MA</p>
              </div>
              <div>
                <p className="font-medium text-bege/90">Horário de atendimento</p>
                <p>Seg – Sex: 8h às 17h</p>
                <p>Sáb: 8h às 12h</p>
              </div>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMERO}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-medium"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-bege/10 mt-10 pt-6 flex items-center justify-between text-xs text-bege/40">
          <span>© {ano} Cantinho da Fé. Todos os direitos reservados.</span>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 hover:text-ouro-suave transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Área administrativa
          </Link>
        </div>
      </div>
    </footer>
  );
}
