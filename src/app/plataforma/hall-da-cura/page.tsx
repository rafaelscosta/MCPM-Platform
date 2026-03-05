"use client";

import { useState } from "react";

type RankingTab = "atendimentos" | "efetividade" | "receita" | "streak";

const demoRanking = [
  { rank: 1, name: "Fernanda M.", level: "Terapeuta Life", sessions: 87, effectiveness: 94, revenue: 14200, streak: 32, badge: "👑" },
  { rank: 2, name: "Carla S.", level: "Terapeuta Life", sessions: 72, effectiveness: 91, revenue: 11500, streak: 28, badge: "🥈" },
  { rank: 3, name: "Patricia L.", level: "Praticante PEDALA", sessions: 65, effectiveness: 88, revenue: 9800, streak: 25, badge: "🥉" },
  { rank: 4, name: "Amanda R.", level: "Terapeuta Soft", sessions: 58, effectiveness: 86, revenue: 8400, streak: 21, badge: "" },
  { rank: 5, name: "Juliana P.", level: "Praticante PEDALA", sessions: 52, effectiveness: 85, revenue: 7600, streak: 18, badge: "" },
  { rank: 6, name: "Beatriz C.", level: "Praticante PEDALA", sessions: 45, effectiveness: 82, revenue: 6200, streak: 15, badge: "" },
  { rank: 7, name: "Luciana A.", level: "Praticante PEDALA", sessions: 38, effectiveness: 80, revenue: 5100, streak: 12, badge: "" },
  { rank: 8, name: "Mariana F.", level: "Praticante PEDALA", sessions: 32, effectiveness: 78, revenue: 4300, streak: 10, badge: "" },
  { rank: 9, name: "Camila D.", level: "Praticante PEDALA", sessions: 25, effectiveness: 75, revenue: 3200, streak: 8, badge: "" },
  { rank: 10, name: "Aluna Demo (Você)", level: "Praticante PEDALA", sessions: 12, effectiveness: 72, revenue: 1680, streak: 5, badge: "⭐" },
];

const tabs: { id: RankingTab; label: string; key: keyof typeof demoRanking[0] }[] = [
  { id: "atendimentos", label: "Atendimentos", key: "sessions" },
  { id: "efetividade", label: "Efetividade", key: "effectiveness" },
  { id: "receita", label: "Receita", key: "revenue" },
  { id: "streak", label: "Streak", key: "streak" },
];

export default function HallDaCuraPage() {
  const [activeTab, setActiveTab] = useState<RankingTab>("atendimentos");

  const currentTab = tabs.find((t) => t.id === activeTab)!;
  const sorted = [...demoRanking].sort(
    (a, b) => (b[currentTab.key] as number) - (a[currentTab.key] as number)
  );

  const formatValue = (value: number, tab: RankingTab) => {
    if (tab === "receita") return `R$${value.toLocaleString("pt-BR")}`;
    if (tab === "efetividade") return `${value}%`;
    if (tab === "streak") return `${value} dias`;
    return value.toString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hall da Cura</h1>
        <p className="text-gray-500 text-sm mt-1">
          Ranking dos alunos com mais atendimentos e melhores resultados. Prova social real.
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-end justify-center gap-4 mb-4">
          {/* 2nd place */}
          <div className="text-center">
            <div className="text-3xl mb-1">🥈</div>
            <div className="bg-gray-100 rounded-xl px-4 pt-8 pb-4 w-24">
              <div className="font-bold text-sm">{sorted[1]?.name.split(" ")[0]}</div>
              <div className="text-xs text-gray-400">{formatValue(sorted[1]?.[currentTab.key] as number, activeTab)}</div>
            </div>
          </div>
          {/* 1st place */}
          <div className="text-center -mt-4">
            <div className="text-4xl mb-1">👑</div>
            <div className="bg-gold-light border-2 border-gold rounded-xl px-4 pt-10 pb-4 w-28">
              <div className="font-bold">{sorted[0]?.name.split(" ")[0]}</div>
              <div className="text-xs text-yellow-700 font-medium">{formatValue(sorted[0]?.[currentTab.key] as number, activeTab)}</div>
            </div>
          </div>
          {/* 3rd place */}
          <div className="text-center">
            <div className="text-3xl mb-1">🥉</div>
            <div className="bg-orange-50 rounded-xl px-4 pt-6 pb-4 w-24">
              <div className="font-bold text-sm">{sorted[2]?.name.split(" ")[0]}</div>
              <div className="text-xs text-gray-400">{formatValue(sorted[2]?.[currentTab.key] as number, activeTab)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Full Ranking */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {sorted.map((student, index) => {
          const isYou = student.name.includes("Você");
          return (
            <div
              key={student.name}
              className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 ${
                isYou ? "bg-primary-light" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? "bg-gold text-yellow-800" :
                  index === 1 ? "bg-gray-200" :
                  index === 2 ? "bg-orange-100 text-orange-700" :
                  "bg-gray-50 text-gray-400"
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-sm">
                    {student.name} {student.badge && student.badge}
                  </div>
                  <div className="text-xs text-gray-400">{student.level}</div>
                </div>
              </div>
              <div className="font-bold text-sm">
                {formatValue(student[currentTab.key] as number, activeTab)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
