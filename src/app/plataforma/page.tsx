"use client";

import Link from "next/link";
import { useStudent } from "@/hooks/useStudent";
import { regionNames } from "@/data/muscles";
import { certifications } from "@/data/certifications";
import { achievements as allAchievements } from "@/data/achievements";

const techniqueColors: Record<string, string> = {
  LIFE: "text-life",
  SOFT: "text-soft",
  FIT: "text-fit",
  DETOX: "text-detox",
};

const levelLabels: Record<string, string> = {
  none: "Iniciante",
  praticante_pedala: "Praticante PEDALA",
  terapeuta_life: "Terapeuta MCPM Life",
  terapeuta_soft: "Terapeuta MCPM Soft",
  terapeuta_fit: "Terapeuta MCPM Fit",
  terapeuta_detox: "Terapeuta MCPM Detox",
  especialista_completo: "Especialista Completo",
};

const nextSteps = [
  { title: "Estudar Piriforme", desc: "Protocolo de falsa ciática — avançado", href: "/plataforma/mapa-da-dor", icon: "🗺️" },
  { title: "Simulação", desc: "Pratique com pacientes virtuais", href: "/plataforma/simulador", icon: "🤖" },
  { title: "Módulo Negócios", desc: "Planos de Tratamento", href: "/plataforma/negocios", icon: "💼" },
];

export default function DashboardPage() {
  const { data, loading } = useStudent();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-3 streak-flame">🔥</div>
          <p className="text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-gray-400 py-12">Erro ao carregar dados.</div>;
  }

  const { user, stats, achievements, recentSessions } = data;
  const xpNext = 1000;
  const xpPercent = Math.min((user.xp / xpNext) * 100, 100);
  const levelLabel = levelLabels[user.currentLevel] || "Praticante PEDALA";
  const cert = certifications[user.currentLevel as keyof typeof certifications] || certifications["praticante_pedala"];

  // Missions based on real data
  const missions = [
    { id: 1, title: "Mãos na Massa", desc: "Aplique PEDALA em 2 pessoas esta semana", progress: Math.min(stats.totalSessions, 2), target: 2, reward: "50 XP" },
    { id: 2, title: "Mapa Explorer", desc: "Estude 3 músculos novos no Mapa da Dor", progress: Math.min(stats.completedProtocols, 3), target: 3, reward: "30 XP" },
    { id: 3, title: "Documentar é Evoluir", desc: "Registre 1 atendimento no Diário Clínico", progress: stats.totalSessions > 0 ? 1 : 0, target: 1, reward: "40 XP" },
  ];

  // Resolve achievement icons
  const recentBadges = allAchievements.slice(0, 6).map((a) => ({
    icon: a.icon,
    name: a.name,
    unlocked: achievements.includes(a.id),
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Olá, {user.name}! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Continue sua jornada de transformação.</p>
        </div>
        <Link
          href="/plataforma/atendimento"
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-dark transition flex items-center gap-2 self-start"
        >
          <span>🩺</span> Modo Atendimento
        </Link>
      </div>

      {/* XP Bar + Streak */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200 animate-card-enter">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{cert?.icon || "🤲"}</span>
            <div>
              <div className="font-semibold">{levelLabel}</div>
              <div className="text-xs text-gray-400">{user.xp} / {xpNext} XP</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full">
            <span className="streak-flame">🔥</span>
            <span className="font-bold text-orange-600">{user.streakDays}</span>
            <span className="text-xs text-orange-500">dias</span>
          </div>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full progress-animated transition-all" style={{ width: `${xpPercent}%` }} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Atendimentos", value: stats.totalSessions, icon: "🤲", color: "bg-primary-light text-primary" },
          { label: "Faturamento", value: `R$${stats.totalRevenue.toLocaleString("pt-BR")}`, icon: "💰", color: "bg-green-50 text-green-600" },
          { label: "Redução de Dor", value: `${stats.avgReduction}%`, icon: "📉", color: "bg-blue-50 text-blue-600" },
          { label: "Protocolos", value: `${stats.completedProtocols}/62`, icon: "📋", color: "bg-purple-50 text-purple-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-200 animate-card-enter">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center text-sm`}>{stat.icon}</span>
              <span className="text-xs text-gray-400">{stat.label}</span>
            </div>
            <div className="text-xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Missions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-lg">Missões da Semana</h2>
          <div className="space-y-3">
            {missions.map((mission) => (
              <div key={mission.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-sm">{mission.title}</div>
                    <div className="text-xs text-gray-400">{mission.desc}</div>
                  </div>
                  <div className="text-xs bg-gold-light text-yellow-700 px-2 py-1 rounded-full font-medium">{mission.reward}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{ width: `${(mission.progress / mission.target) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{mission.progress}/{mission.target}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Sessions */}
          <h2 className="font-bold text-lg pt-2">Últimos Atendimentos</h2>
          {recentSessions.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Data</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Paciente</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Região</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Dor</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((session) => (
                    <tr key={session.id} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-gray-500">{new Date(session.date).toLocaleDateString("pt-BR")}</td>
                      <td className="px-4 py-3 font-medium">{session.patientName}</td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                        <span className={`${techniqueColors[session.technique] || ""} font-medium`}>{regionNames[session.region as keyof typeof regionNames] || session.region}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-red-400">{session.painBefore}</span>
                        <span className="text-gray-300 mx-1">→</span>
                        <span className="text-green-500 font-semibold">{session.painAfter}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">R${session.chargedAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-gray-100 text-center">
                <Link href="/plataforma/diario" className="text-sm text-primary font-medium hover:underline">
                  Ver todos os atendimentos →
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-400 text-sm">Nenhum atendimento registrado ainda.</p>
              <Link href="/plataforma/diario" className="text-primary text-sm font-medium mt-2 inline-block hover:underline">
                Registrar primeiro atendimento →
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg">Próximos Passos</h2>
          <div className="space-y-3">
            {nextSteps.map((step) => (
              <Link
                key={step.title}
                href={step.href}
                className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-primary/30 hover:shadow-sm transition"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{step.icon}</span>
                  <div>
                    <div className="font-semibold text-sm">{step.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{step.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Achievements */}
          <h2 className="font-bold text-lg pt-2">Conquistas Recentes</h2>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="grid grid-cols-3 gap-3">
              {recentBadges.map((badge) => (
                <div
                  key={badge.name}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                    badge.unlocked ? "bg-gold-light" : "bg-gray-50 opacity-40"
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-[10px] text-center font-medium">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certification Progress */}
          <h2 className="font-bold text-lg pt-2">Próxima Certificação</h2>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{cert?.icon || "💪"}</span>
              <div>
                <div className="font-semibold text-sm">{cert?.name || "Terapeuta MCPM Life"}</div>
                <div className="text-xs text-gray-400">Baseado em competência demonstrada</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Atendimentos</span>
                <span className="font-medium">{stats.totalSessions}/20</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min((stats.totalSessions / 20) * 100, 100)}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Efetividade</span>
                <span className="font-medium text-green-600">{stats.avgReduction}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(stats.avgReduction, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
