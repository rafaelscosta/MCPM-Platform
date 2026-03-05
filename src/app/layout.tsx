import type { Metadata } from "next";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}
