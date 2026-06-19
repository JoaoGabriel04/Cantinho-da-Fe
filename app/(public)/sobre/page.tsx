import type { Metadata } from "next";
import { Star, MessageCircle, Layers, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description: "Conheça a história da nossa loja de artigos religiosos. Atendimento humanizado e produtos de qualidade.",
};

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <p className="text-dourado font-medium tracking-widest uppercase text-sm mb-3">
          ✦ Nossa história ✦
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-texto mb-4">
          Sobre nós
        </h1>
        <p className="text-texto-suave text-lg max-w-2xl mx-auto">
          Uma loja que nasceu da fé e do desejo de servir.
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-2xl p-8 md:p-12 border border-ouro/10 shadow-sm mb-8">
          <h2 className="font-serif text-2xl text-texto mb-4">Nossa missão</h2>
          <p className="text-texto-suave leading-relaxed mb-4">
            O Cantinho da Fé nasceu da vontade de oferecer artigos religiosos de qualidade com um atendimento diferenciado, humano e carinhoso. Acreditamos que cada produto que vendemos carrega um significado especial e merece ser escolhido com cuidado.
          </p>
          <p className="text-texto-suave leading-relaxed">
            Nossa missão é ser um elo entre a fé das pessoas e os objetos que expressam essa fé, seja um terço passado de geração em geração, uma bíblia presenteada a um ente querido ou uma imagem que adorna um lar com paz e espiritualidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {(
            [
              { titulo: "Qualidade", desc: "Selecionamos cada produto com atenção e cuidado para garantir o melhor para você.", Icone: Star },
              { titulo: "Atendimento", desc: "Estamos sempre disponíveis para ajudar você a encontrar o produto ideal.", Icone: MessageCircle },
              { titulo: "Variedade", desc: "Terços, bíblias, imagens, decoração e muito mais para toda a família.", Icone: Layers },
              { titulo: "Confiança", desc: "Transparência e honestidade em cada venda, do início ao fim.", Icone: ShieldCheck },
            ] as { titulo: string; desc: string; Icone: LucideIcon }[]
          ).map((item) => (
            <div key={item.titulo} className="flex gap-4 p-6 bg-bege rounded-xl">
              <item.Icone className="w-7 h-7 text-ouro flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-texto mb-1">{item.titulo}</h3>
                <p className="text-sm text-texto-suave">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-texto text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-serif text-2xl text-ouro-suave mb-4">Fale conosco</h2>
          <div className="space-y-3 text-white/80 mb-8">
            <p><strong className="text-white">Horário de atendimento</strong></p>
            <p>Segunda a Sexta: 8h às 18h</p>
            <p>Sábado: 8h às 13h</p>
          </div>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMERO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-8 py-3 rounded-full font-medium transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
