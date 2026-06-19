import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BotaoWhatsAppFlutuante } from "@/components/layout/BotaoWhatsAppFlutuante";
import { DrawerOrcamento } from "@/components/orcamento/DrawerOrcamento";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BotaoWhatsAppFlutuante />
      {/* Drawer renderizado fora do Header para evitar conflito de stacking context */}
      <DrawerOrcamento />
    </div>
  );
}
