import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
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
    <html lang="pt-BR" className={`${lora.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
