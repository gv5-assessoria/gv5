import type { Metadata, Viewport } from "next";
import "./global.css";
import Consentimento from "@/components/layout/Consentimento";
import { URL_SITE, ogPagina } from "@/lib/site";

export const viewport: Viewport = { themeColor: "#09111c", width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITE),
  title: "GV5 Assessoria - Agência de Marketing Digital",
  description: "Fazemos o seu restaurante vender R$ 15 a cada R$ 1 investido em tráfego pago.",
  alternates: { canonical: "/" },
  // Ícones e imagem de compartilhamento ficam em public/essenciais (fora do app/ para não poluir a pasta de rotas).
  icons: {
    icon: { url: "/essenciais/icone.png", type: "image/png", sizes: "192x192" },
    apple: "/essenciais/icone-apple.png",
  },
  openGraph: ogPagina(
    "GV5 Assessoria - Agência de Marketing Digital",
    "Fazemos o seu restaurante vender R$ 15 a cada R$ 1 investido em tráfego pago.",
    "/",
  ),
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Consentimento />
      </body>
    </html>
  );
}
