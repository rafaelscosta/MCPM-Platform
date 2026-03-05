"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface StudentStats {
  totalSessions: number;
  totalRevenue: number;
  avgReduction: number;
  avgSimScore: number;
  sessionsByTechnique: Record<string, number>;
  completedProtocols: number;
}

interface StudentData {
  name: string;
  email: string;
  experience: string;
  xp: number;
  streakDays: number;
  currentLevel: string;
}

interface DashboardData {
  user: StudentData;
  stats: StudentStats;
  achievements: string[];
  recentSessions: Array<{
    id: string;
    date: string;
    patientName: string;
    region: string;
    technique: string;
    painBefore: number;
    painAfter: number;
    chargedAmount: number;
  }>;
  simulations: number;
}

interface StudentContextType {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType>({
  data: null,
  loading: true,
  error: null,
  refresh: async () => {},
});

export function StudentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const dashData = await res.json();
        setData(dashData);
        setError(null);
      } else if (res.status === 401) {
        // Not authenticated - use demo data
        setData(getDemoData());
        setError(null);
      } else {
        setError("Erro ao carregar dados");
      }
    } catch {
      // Fallback to demo data
      setData(getDemoData());
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <StudentContext.Provider value={{ data, loading, error, refresh }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  return useContext(StudentContext);
}

function getDemoData(): DashboardData {
  return {
    user: {
      name: "Aluna Demo",
      email: "demo@mcpm.com",
      experience: "iniciante",
      xp: 450,
      streakDays: 5,
      currentLevel: "praticante_pedala",
    },
    stats: {
      totalSessions: 12,
      totalRevenue: 1680,
      avgReduction: 72,
      avgSimScore: 75,
      sessionsByTechnique: { LIFE: 10, SOFT: 1, FIT: 1 },
      completedProtocols: 8,
    },
    achievements: ["first-session", "first-payment", "streak-7", "sessions-10"],
    recentSessions: [
      { id: "1", date: "2026-03-04T00:00:00Z", patientName: "Maria S.", region: "pescoco", technique: "LIFE", painBefore: 8, painAfter: 2, chargedAmount: 150 },
      { id: "2", date: "2026-03-03T00:00:00Z", patientName: "João P.", region: "lombar", technique: "LIFE", painBefore: 7, painAfter: 1, chargedAmount: 180 },
      { id: "3", date: "2026-03-01T00:00:00Z", patientName: "Ana C.", region: "ombro", technique: "LIFE", painBefore: 6, painAfter: 2, chargedAmount: 150 },
    ],
    simulations: 3,
  };
}
