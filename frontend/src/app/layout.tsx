import { Provider } from "jotai";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Barbearia - Estilo e Atitude",
  description: "A melhor barbearia da cidade. Agende seu horário agora!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`font-sans antialiased`}>
        <Provider>
          {/* Adicione o AuthProvider AQUI, dentro do Provider do Jotai */}
          <AuthProvider>{children}</AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
