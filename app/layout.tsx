import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "CriptoPassivo — Dashboard Renda Passiva Cripto",
    template: "%s | CriptoPassivo",
  },
  description: "Dashboard SaaS para acompanhar carteira de renda passiva em cripto: alocação, rendimento projetado, rebalanceamento e cálculo de IR — preço real via CoinGecko.",
  keywords: ["cripto", "renda passiva", "staking", "portfolio", "dashboard", "IR", "imposto de renda", "coinGecko", "BRL"],
  authors: [{ name: "CriptoPassivo" }],
  creator: "CriptoPassivo",
  publisher: "CriptoPassivo",
  formatDetection: { telephone: false },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "CriptoPassivo",
    title: "CriptoPassivo — Dashboard Renda Passiva Cripto",
    description: "Sua carteira de renda passiva em cripto, em tempo real. Alocação, rendimento, IR e rebalanceamento.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CriptoPassivo Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CriptoPassivo — Dashboard Renda Passiva Cripto",
    description: "Dashboard SaaS para acompanhar carteira de renda passiva em cripto",
    images: ["/og-image.png"],
    creator: "@criptopassivo",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}