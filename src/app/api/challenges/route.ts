import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Weekly challenges based on user progression
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    const [sessions, simulations] = await Promise.all([
      prisma.clinicalSession.findMany({
        where: {
          userId,
          date: { gte: new Date(Date.now() - 7 * 86400000) },
        },
      }),
      prisma.simulationResult.findMany({
        where: {
          userId,
          completedAt: { gte: new Date(Date.now() - 7 * 86400000) },
        },
      }),
    ]);

    const weekSessions = sessions.length;
    const weekSimulations = simulations.length;
    const weekRevenue = sessions.reduce((sum, s) => sum + s.chargedAmount, 0);
    const techniques = new Set(sessions.map((s) => s.technique));

    const challenges = [
      {
        id: "weekly-sessions",
        title: "Maos na Massa",
        description: "Aplique PEDALA em 3 pessoas esta semana",
        progress: Math.min(weekSessions, 3),
        target: 3,
        reward: "75 XP",
        icon: "🤲",
        completed: weekSessions >= 3,
      },
      {
        id: "weekly-simulations",
        title: "Treino Mental",
        description: "Complete 2 simulacoes com nota acima de 70",
        progress: Math.min(simulations.filter((s) => s.score >= 70).length, 2),
        target: 2,
        reward: "50 XP",
        icon: "🧠",
        completed: simulations.filter((s) => s.score >= 70).length >= 2,
      },
      {
        id: "weekly-revenue",
        title: "Meta Financeira",
        description: "Fature R$500 esta semana",
        progress: Math.min(weekRevenue, 500),
        target: 500,
        reward: "100 XP + Badge",
        icon: "💰",
        completed: weekRevenue >= 500,
      },
      {
        id: "weekly-diversity",
        title: "Versatilidade",
        description: "Use 2 tecnicas diferentes esta semana",
        progress: Math.min(techniques.size, 2),
        target: 2,
        reward: "60 XP",
        icon: "🎯",
        completed: techniques.size >= 2,
      },
    ];

    // Award XP for completed challenges
    for (const challenge of challenges) {
      if (challenge.completed) {
        const xp = parseInt(challenge.reward) || 50;
        const key = `challenge:${challenge.id}:${new Date().toISOString().split("T")[0].slice(0, 7)}`;
        const existing = await prisma.userAchievement.findFirst({
          where: { userId, achievementId: key },
        });
        if (!existing) {
          await prisma.userAchievement.create({
            data: { userId, achievementId: key },
          });
          await prisma.user.update({
            where: { id: userId },
            data: { xp: { increment: xp } },
          });
        }
      }
    }

    return NextResponse.json({
      challenges,
      weekStats: { sessions: weekSessions, simulations: weekSimulations, revenue: weekRevenue },
    });
  } catch (error) {
    console.error("Challenges error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
