import Link from "next/link";
import Image from "next/image";
import { Search, ClipboardList, MessageCircle, Tag, BookOpen, Layers, Sparkles, Gift, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProdutoCard } from "@/components/produto/ProdutoCard";

export const dynamic = "force-dynamic";

async function getDados() {
  const [categorias, destaques] = await Promise.all([
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
    prisma.produto.findMany({
      where: { destaque: true, ativo: true },
      include: { imagens: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);
  return { categorias, destaques };
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type IconeCategoria = React.ElementType;

const iconesCategorias: Record<string, IconeCategoria> = {
  default: Tag,
  "tercos-e-rosarios": ClipboardList,
  biblias: BookOpen,
  "imagens-e-estatuas": Layers,
  decoracao: Sparkles,
  acessorios: Gift,
};

const passos = [
  {
    num: "1",
    titulo: "Explore o catálogo",
    desc: "Navegue pelos produtos, filtre por categoria e encontre o que procura.",
    Icone: Search,
  },
  {
    num: "2",
    titulo: "Escolha o produto",
    desc: "Veja fotos, descrição, preço e disponibilidade. Adicione à sua lista.",
    Icone: ClipboardList,
  },
  {
    num: "3",
    titulo: "Finalize pelo WhatsApp",
    desc: "Entre em contato direto conosco para tirar dúvidas e confirmar o pedido.",
    Icone: MessageCircle,
  },
];

export default async function HomePage() {
  const { categorias, destaques } = await getDados();

  return (
    <>
      {/* Hero */}
      <section className="gsap-hero relative overflow-hidden bg-linear-to-br from-marfim via-bege to-creme py-24 md:py-36">
        <div className="absolute inset-0 opacity-5 select-none pointer-events-none">
          <div className="gsap-hero-deco absolute top-10 left-10 text-9xl">
            <span className="hero-sparkle inline-block" data-duration="8" data-delay="0">✦</span>
          </div>
          <div className="gsap-hero-deco absolute bottom-10 right-10 text-7xl">
            <span className="hero-sparkle inline-block" data-duration="12" data-delay="2">✦</span>
          </div>
          <div className="gsap-hero-deco absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] leading-none">
            <span className="hero-sparkle inline-block" data-duration="22" data-delay="5">✦</span>
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <p className="gsap-hero-label text-ouro font-medium tracking-widest uppercase text-sm mb-4">
            ✦ Com fé e carinho ✦
          </p>
          <h1 className="gsap-hero-title font-serif text-4xl md:text-6xl lg:text-7xl text-texto mb-6 leading-tight">
            <span className="gsap-title-line block">Artigos Religiosos para</span>
            <span className="gsap-title-line block text-gradient-azul">nutrir a sua fé</span>
          </h1>
          <p className="gsap-hero-sub text-texto-suave text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Terços, bíblias, imagens sacras, decoração e muito mais. Escolha com calma e finalize sua compra pelo WhatsApp com atendimento humanizado.
          </p>
          <div className="gsap-hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 bg-ouro hover:bg-terroso text-white px-8 py-4 rounded-full font-medium text-lg transition-colors duration-200 shadow-lg shadow-blue-600/30"
            >
              Ver Catálogo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMERO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-linear-to-r from-dourado via-ouro-suave to-dourado hover:text-white text-dourado px-8 py-4 rounded-full font-medium text-lg transition-all duration-500 border border-dourado/40 shadow-sm"
            >
              <WhatsAppIcon />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Categorias */}
      {categorias.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="gsap-fade-up text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-texto mb-3">
              Explore por Categoria
            </h2>
            <p className="text-texto-suave">
              Encontre exatamente o que procura
            </p>
          </div>
          <div className="gsap-stagger grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categorias.map((cat) => {
              const Icone = iconesCategorias[cat.slug] ?? iconesCategorias.default;
              return (
                <Link
                  key={cat.id}
                  href={`/produtos?categoria=${cat.slug}`}
                  className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-ouro/20 hover:border-dourado/60 hover:shadow-md hover:shadow-dourado/10 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:translate-x-1 hover:-rotate-1"
                >
                  <div className="w-16 h-16 rounded-full bg-bege group-hover:bg-ouro-suave/50 flex items-center justify-center overflow-hidden relative">
                    {cat.imagemUrl ? (
                      <Image src={cat.imagemUrl} alt={cat.nome} fill className="object-cover" />
                    ) : (
                      <Icone className="w-7 h-7 text-ouro group-hover:text-dourado" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-texto text-center group-hover:text-dourado transition-colors">
                    {cat.nome}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Destaques */}
      {destaques.length > 0 && (
        <section className="py-20 px-4 bg-bege">
          <div className="max-w-7xl mx-auto">
            <div className="gsap-fade-up text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-texto mb-3">
                Mais Procurados
              </h2>
              <p className="text-texto-suave">
                Os produtos favoritos dos nossos clientes
              </p>
            </div>
            <div className="gsap-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {destaques.map((produto) => (
                <ProdutoCard
                  key={produto.id}
                  produto={{
                    ...produto,
                    preco: Number(produto.preco),
                    imagens: produto.imagens,
                  }}
                />
              ))}
            </div>
            <div className="gsap-fade-up text-center mt-10">
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 border-2 border-ouro text-ouro hover:bg-ouro hover:text-white px-8 py-3 rounded-full font-medium transition-colors duration-200"
              >
                Ver catálogo completo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Como funciona */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="gsap-fade-up font-serif text-3xl md:text-4xl text-texto mb-3">
            Como Funciona
          </h2>
          <p className="gsap-fade-up text-texto-suave mb-14">
            Simples, rápido e com atendimento humano
          </p>
          <div className="gsap-stagger grid grid-cols-1 md:grid-cols-3 gap-8">
            {passos.map((passo) => (
              <div key={passo.num} className="flex flex-col items-center gap-4 p-6">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-ouro to-terroso flex items-center justify-center text-white font-serif text-2xl font-bold shadow-lg">
                  {passo.num}
                </div>
                <div className="w-12 h-12 rounded-full bg-bege flex items-center justify-center">
                  <passo.Icone className="w-6 h-6 text-ouro" />
                </div>
                <h3 className="font-serif text-xl text-texto">{passo.titulo}</h3>
                <p className="text-texto-suave text-sm leading-relaxed">{passo.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloco de confiança */}
      <section className="py-16 px-4 bg-linear-to-r from-texto to-terroso text-white">
        <div className="gsap-scale-up max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-4 select-none text-dourado">✦</div>
          <h2 className="font-serif text-2xl md:text-3xl mb-4 text-ouro-suave">
            Atendimento com coração
          </h2>
          <p className="text-white/80 leading-relaxed mb-8">
            Nossa loja nasceu da fé e do desejo de levar artigos religiosos de qualidade para quem tem fé. Cada produto é escolhido com cuidado e cada cliente atendido com carinho. Fale com a gente pelo WhatsApp — estamos sempre prontos para ajudar.
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMERO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            <WhatsAppIcon />
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
