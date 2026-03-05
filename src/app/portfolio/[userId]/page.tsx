"use client";

import { useState, useEffect, use } from "react";
import { regionNames } from "@/data/muscles";
import { certifications } from "@/data/certifications";
import { achievements as allAchievements } from "@/data/achievements";
import type { BodyRegion, CertificationLevel } from "@/types";
import Link from "next/link";

interface PortfolioData {
  professional: {
    name: string;
    level: string;
    memberSince: string;
  };
  portfolio: {
    totalSessions: number;
    avgPainReduction: number;
    sessions: Array<{
      id: string;
      date: string;
      region: string;
      technique: string;
      painBefore: number;
      painAfter: number;
      duration: number;
    }>;
    achievements: string[];
  };
}

// Demo data for showcase
const demoData: PortfolioData = {
  professional: {
    name: "Aluna MCPM Demo",
    level: "praticante_pedala",
    memberSince: "2026-01-15",
  },
  portfolio: {
    totalSessions: 12,
    avgPainReduction: 72,
    sessions: [
      { id: "1", date: "2026-03-04", region: "pescoco", technique: "LIFE", painBefore: 8, painAfter: 2, duration: 45 },
      { id: "2", date: "2026-03-03", region: "lombar", technique: "LIFE", painBefore: 7, painAfter: 1, duration: 50 },
      { id: "3", date: "2026-03-01", region: "ombro", technique: "LIFE", painBefore: 6, painAfter: 2, duration: 40 },
      { id: "4", date: "2026-02-28", region: "quadril", technique: "LIFE", painBefore: 9, painAfter: 3, duration: 55 },
      { id: "5", date: "2026-02-26", region: "costas_superior", technique: "LIFE", painBefore: 5, painAfter: 1, duration: 35 },
    ],
    achievements: ["first-session", "first-payment", "streak-7", "sessions-10"],
  },
};

export default function PortfolioPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/portfolio/${userId}`);
        if (res.ok) {
          setData(await res.json());
        } else {
          setData(demoData);
        }
      } catch {
        setData(demoData);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Carregando portfólio...</div>
      </div>
    );
  }

  if (!data) return null;

  const cert = certifications[data.professional.level as CertificationLevel] || certifications.none;
  const unlockedAchievements = allAchievements.filter((a) =>
    data.portfolio.achievements.includes(a.id)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-hero text-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-3">{cert.icon}</div>
          <h1 className="text-2xl font-bold">{data.professional.name}</h1>
          <div className="text-primary-light font-medium mt-1">{cert.name}</div>
          <div className="text-sm text-gray-400 mt-1">
            Terapeuta MCPM desde {new Date(data.professional.memberSince).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6">
        {/* Stats */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{data.portfolio.totalSessions}</div>
              <div className="text-xs text-gray-400">Atendimentos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{data.portfolio.avgPainReduction}%</div>
              <div className="text-xs text-gray-400">Redução de Dor</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{unlockedAchievements.length}</div>
              <div className="text-xs text-gray-400">Conquistas</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="mt-6">
            <h2 className="font-bold text-lg mb-3">Conquistas</h2>
            <div className="flex flex-wrap gap-2">
              {unlockedAchievements.map((a) => (
                <div key={a.id} className="bg-gold-light px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <span>{a.icon}</span>
                  <span className="text-sm font-medium">{a.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session Results */}
        <div className="mt-6">
          <h2 className="font-bold text-lg mb-3">Resultados Comprovados</h2>
          <div className="space-y-3">
            {data.portfolio.sessions.map((session) => {
              const reduction = Math.round(((session.painBefore - session.painAfter) / session.painBefore) * 100);
              return (
                <div key={session.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">{reduction}%</span>
                      </div>
                      <div>
                        <div className="font-medium">{regionNames[session.region as BodyRegion] || session.region}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(session.date).toLocaleDateString("pt-BR")} &middot; {session.duration} min &middot; {session.technique}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div>
                        <span className="text-red-400">{session.painBefore}</span>
                        <span className="text-gray-300 mx-1">→</span>
                        <span className="text-green-500 font-bold">{session.painAfter}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 mb-12 text-center">
          <div className="bg-primary-light rounded-2xl p-6">
            <div className="text-sm text-primary font-medium mb-2">Certificado pelo</div>
            <div className="text-xl font-bold text-primary mb-1">MCPM Academy</div>
            <div className="text-xs text-gray-500 mb-4">Método Cura Pelas Mãos — Certificação por Competência</div>
            <Link
              href="/"
              className="inline-block bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition"
            >
              Conheça o Método
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
