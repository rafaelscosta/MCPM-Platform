"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/plataforma", icon: "📊" },
  { label: "Mapa da Dor", href: "/plataforma/mapa-da-dor", icon: "🗺️" },
  { label: "Protocolos", href: "/plataforma/protocolos", icon: "📋" },
  { label: "Simulador", href: "/plataforma/simulador", icon: "🤖" },
  { label: "Diário Clínico", href: "/plataforma/diario", icon: "📝" },
  { label: "Certificações", href: "/plataforma/certificacoes", icon: "🏆" },
  { label: "Negócios", href: "/plataforma/negocios", icon: "💼" },
  { label: "Modo Atendimento", href: "/plataforma/atendimento", icon: "🩺" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 z-40">
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">MCPM</span>
            <span className="text-sm text-gray-400">Academy</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-primary-light text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="bg-primary-light rounded-xl p-4">
            <div className="text-sm font-medium text-primary mb-1">Precisa de ajuda?</div>
            <div className="text-xs text-gray-500">Acesse o suporte ou comunidade de alunos.</div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1 px-2 ${
                  isActive ? "text-primary" : "text-gray-400"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
