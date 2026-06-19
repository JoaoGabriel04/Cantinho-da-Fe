import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cantinho da Fé — Artigos Religiosos",
    template: "%s | Cantinho da Fé",
  },
  description:
    "Catálogo de artigos religiosos com terços, imagens, bíblias, decoração e muito mais. Compre pelo WhatsApp com atendimento humanizado.",
  keywords: ["artigos religiosos", "terços", "bíblias", "imagens sacras", "rosários"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Cantinho da Fé",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
