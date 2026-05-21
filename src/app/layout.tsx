import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinançasPessoais — Controle seu dinheiro",
  description: "App de gestão financeira pessoal simples e visual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full bg-background antialiased">{children}</body>
    </html>
  );
}
