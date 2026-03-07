"use client";

import { useState, useEffect } from "react";

type RankingTab = "atendimentos" | "efetividade" | "receita" | "streak";

interface RankingEntry {
  rank: number;
  name: string;
  level: string;
  sessions: number;
  effectiveness: number;
  revenue: number;
  streak: number;
  badge: string;
  isCurrentUser?: boolean;
}

const levelLabels: Record<string, string> = {
  none: "Iniciante",
  praticante_pedala: "Praticante PEDALA",
  terapeuta_life: "Terapeuta Life",
  terapeuta_soft: "Terapeuta Soft",
  terapeuta_fit: "Terapeuta Fit",
  terapeuta_detox: "Terapeuta Detox",
  especialista_completo: "Especialista Completo",
};

const demoRanking: RankingEntry[] = [
  { rank: 1, name: "Fernanda M.", level: "terapeuta_life", sessions: 87, effectiveness: 94, revenue: 14200, streak: 32, badge: "👑" },
  { rank: 2, name: "Carla S.", level: "terapeuta_life", sessions: 72, effectiveness: 91, revenue: 11500, streak: 28, badge: "🥈" },
  { rank: 3, name: "Patricia L.", level: "praticante_pedala", sessions: 65, effectiveness: 88, revenue: 9800, streak: 25, badge: "🥉" },
  { rank: 4, name: "Amanda R.", level: "terapeuta_soft", sessions: 58, effectiveness: 86, revenue: 8400, streak: 21, badge: "" },
  { rank: 5, name: "Juliana P.", level: "praticante_pedala", sessions: 52, effectiveness: 85, revenue: 7600, streak: 18, badge: "" },
  { rank: 6, name: "Beatriz C.", level: "praticante_pedala", sessions: 45, effectiveness: 82, revenue: 6200, streak: 15, badge: "" },
  { rank: 7, name: "Luciana A.", level: "praticante_pedala", sessions: 38, effectiveness: 80, revenue: 5100, streak: 12, badge: "" },
  { rank: 8, name: "Mariana F.", level: "praticante_pedala", sessions: 32, effectiveness: 78, revenue: 4300, streak: 10, badge: "" },
  { rank: 9, name: "Camila D.", level: "praticante_pedala", sessions: 25, effectiveness: 75, revenue: 3200, streak: 8, badge: "" },
  { rank: 10, name: "Voce", level: "praticante_pedala", sessions: 12, effectiveness: 72, revenue: 1680, streak: 5, badge: "⭐", isCurrentUser: true },
];

const tabs: { id: RankingTab; label: string; key: keyof RankingEntry }[] = [
  { id: "atendimentos", label: "Atendimentos", key: "sessions" },
  { id: "efetividade", label: "Efetividade", key: "effectiveness" },
  { id: "receita", label: "Receita", key: "revenue" },
  { id: "streak", label: "Streak", key: "streak" },
];

export default function HallDaCuraPage() {
  const [activeTab, setActiveTab] = useState<RankingTab>("atendimentos");
  const [ranking, setRanking] = useState<RankingEntry[]>(demoRanking);

  useEffect(() => {
    fetch("/api/ranking")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data && data.length > 0) {
          const realUsers = data.map((u: RankingEntry, i: number) => ({
            ...u,
            name: u.isCurrentUser ? `${u.name} (Voce)` : u.name,
            badge: i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : u.isCurrentUser ? "⭐" : "",
            rank: i + 1,
          }));
          if (realUsers.length < 10) {
            const padding = demoRanking.slice(realUsers.length).map((d, i) => ({
              ...d,
              rank: realUsers.length + i + 1,
              isCurrentUser: false,
            }));
            setRanking([...realUsers, ...padding]);
          } else {
            setRanking(realUsers);
          }
        }
      })
      .catch(() => {/* keep demo data */});
  }, []);

  const currentTab = tabs.find((t) => t.id === activeTab)!;
  const sorted = [...ranking].sort(
    (a, b) => (b[currentTab.key] as number) - (a[currentTab.key] as number)
  ).map((entry, i) => ({ ...entry, rank: i + 1 }));

  const formatValue = (value: number, tab: RankingTab) => {
    if (tab === "receita") return `R$${value.toLocaleString("pt-BR")}`;
    if (tab === "efetividade") return `${value}%`;
    if (tab === "streak") return `${value} dias`;
    return value.toString();
  };

  const userPosition = sorted.findIndex((s) => s.isCurrentUser) + 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hall da Cura</h1>
        <p className="text-gray-500 text-sm mt-1">
          Ranking dos alunos com mais atendimentos e melhores resultados. Prova social real.
        </p>
      </div>

      {/* Your Position */}
      {userPosition > 0 && (
        <div className="bg-primary-light rounded-xl p-4 flex items-center justify-between animate-card-enter">
          <div>
            <div className="text-sm text-primary font-medium">Sua posicao</div>
            <div className="text-2xl font-bold">{userPosition}o lugar</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">{currentTab.label}</div>
            <div className="text-lg font-bold">
              {formatValue(sorted[userPosition - 1]?.[currentTab.key] as number, activeTab)}
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-card-enter">
        <div className="flex items-end justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl mb-1">🥈</div>
            <div className="bg-gray-100 rounded-xl px-4 pt-8 pb-4 w-24">
              <div className="font-bold text-sm">{sorted[1]?.name.split(" ")[0]}</div>
              <div className="text-xs text-gray-400">{formatValue(sorted[1]?.[currentTab.key] as number, activeTab)}</div>
            </div>
          </div>
          <div className="text-center -mt-4">
            <div className="text-4xl mb-1">👑</div>
            <div className="bg-gold-light border-2 border-gold rounded-xl px-4 pt-10 pb-4 w-28">
              <div className="font-bold">{sorted[0]?.name.split(" ")[0]}</div>
              <div className="text-xs text-yellow-700 font-medium">{formatValue(sorted[0]?.[currentTab.key] as number, activeTab)}</div>
            </div>
          </div>
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
        {sorted.map((student, index) => (
          <div
            key={`${student.name}-${index}`}
            className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 ${
              student.isCurrentUser ? "bg-primary-light" : ""
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
                  {student.name} {student.badge}
                </div>
                <div className="text-xs text-gray-400">{levelLabels[student.level] || student.level}</div>
              </div>
            </div>
            <div className="font-bold text-sm">
              {formatValue(student[currentTab.key] as number, activeTab)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
