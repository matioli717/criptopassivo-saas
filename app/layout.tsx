import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CriptoPassivo — Dashboard",
  description: "Sua carteira de renda passiva em cripto, em tempo real.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
