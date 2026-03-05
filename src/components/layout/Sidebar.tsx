"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/plataforma", icon: "📊" },
  { label: "Mapa da Dor", href: "/plataforma/mapa-da-dor", icon: "🗺️" },
  { label: "Protocolos", href: "/plataforma/protocolos", icon: "📋" },
  { label: "Simulador", href: "/plataforma/simulador", icon: "🤖" },
  { label: "Simulador IA", href: "/plataforma/simulador-ia", icon: "🧠" },
  { label: "Diário Clínico", href: "/plataforma/diario", icon: "📝" },
  { label: "Hall da Cura", href: "/plataforma/hall-da-cura", icon: "🏅" },
  { label: "Certificações", href: "/plataforma/certificacoes", icon: "🏆" },
  { label: "Negócios", href: "/plataforma/negocios", icon: "💼" },
  { label: "Modo Atendimento", href: "/plataforma/atendimento", icon: "🩺" },
];

const mobileNavItems = navItems.filter((_, i) => [0, 1, 3, 5, 9].includes(i));

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">MCPM</span>
              <span className="text-xs text-gray-400 ml-1">Academy</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
                {item.label === "Simulador IA" && (
                  <span className="ml-auto text-[10px] bg-accent text-white px-1.5 py-0.5 rounded-full font-bold">NOVO</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Portfolio link */}
        <div className="p-3 border-t border-gray-100 space-y-2">
          <Link
            href="/portfolio/demo"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <span className="text-base">🔗</span>
            Meu Portfólio Público
          </Link>
          <div className="bg-gradient-to-r from-primary-light to-accent-light rounded-xl p-4">
            <div className="text-sm font-medium text-gray-800 mb-1">Natália Tanaka</div>
            <div className="text-xs text-gray-500">Criadora do Método MCPM</div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3 flex items-center justify-between">
        <Link href="/plataforma" className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">M</span>
          </div>
          <span className="font-bold text-gray-900">MCPM</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-8 h-8 flex items-center justify-center text-gray-600"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* Mobile Full Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-40 pt-16 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive ? "bg-primary-light text-primary" : "text-gray-600"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-2 ${
                  isActive ? "text-primary" : "text-gray-400"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
