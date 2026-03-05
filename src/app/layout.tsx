import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PWARegister } from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "MCPM Academy - Método Cura Pelas Mãos",
  description:
    "A primeira plataforma de ensino de massoterapia clínica que transforma alunos em profissionais ainda dentro do curso.",
  keywords: [
    "massoterapia",
    "massagem clínica",
    "MCPM",
    "cura pelas mãos",
    "Natália Tanaka",
    "PEDALA",
    "pontos gatilho",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MCPM Academy",
  },
};

export const viewport: Viewport = {
  themeColor: "#E63946",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased bg-white text-gray-900">
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
