"use client";

import { businessModules } from "@/data/achievements";

export default function NegociosPage() {
  // Simulate first 2 modules unlocked
  const unlockedModules = businessModules.map((m, i) => ({
    ...m,
    isUnlocked: i < 2,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Módulo de Negócios</h1>
        <p className="text-gray-500 text-sm mt-1">
          Negócios integrado à sua progressão técnica. A cada técnica dominada, novos conteúdos de negócios são desbloqueados.
        </p>
      </div>

      {/* Revenue Overview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-bold mb-4">Seu Faturamento</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">R$1.680</div>
            <div className="text-xs text-gray-400">Este mês</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-gray-400">Atendimentos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">R$140</div>
            <div className="text-xs text-gray-400">Ticket médio</div>
          </div>
        </div>
      </div>

      {/* Business Modules */}
      <div className="space-y-4">
        {unlockedModules.map((module, index) => (
          <div
            key={module.id}
            className={`bg-white rounded-xl border-2 p-5 transition ${
              module.isUnlocked
                ? "border-gray-200 hover:border-primary/30 hover:shadow-sm cursor-pointer"
                : "border-gray-100 opacity-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                  module.isUnlocked ? "gradient-primary text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {module.isUnlocked ? index + 1 : "🔒"}
                </div>
                <div>
                  <h3 className="font-bold">{module.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{module.description}</p>
                  <div className="text-xs text-gray-400 mt-1">
                    {module.isUnlocked ? "Disponível" : module.unlockCondition}
                  </div>
                </div>
              </div>
            </div>

            {module.isUnlocked && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <ul className="space-y-2">
                  {module.content.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
