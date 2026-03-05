import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: true,
        moduleProgress: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Get clinical sessions
    const clinicalSessions = await prisma.clinicalSession.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    const totalSessions = clinicalSessions.length;
    const totalRevenue = clinicalSessions.reduce((sum, s) => sum + s.chargedAmount, 0);
    const avgReduction = totalSessions > 0
      ? Math.round(
          clinicalSessions.reduce(
            (sum, s) => sum + ((s.painBefore - s.painAfter) / Math.max(s.painBefore, 1)) * 100,
            0
          ) / totalSessions
        )
      : 0;

    // Get simulation stats
    const simulations = await prisma.simulationResult.findMany({
      where: { userId },
    });
    const avgSimScore = simulations.length > 0
      ? Math.round(simulations.reduce((sum, s) => sum + s.score, 0) / simulations.length)
      : 0;

    // Sessions by technique
    const sessionsByTechnique = clinicalSessions.reduce(
      (acc, s) => {
        acc[s.technique] = (acc[s.technique] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Update streak
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    let newStreak = user.streakDays;

    if (user.lastActiveDate === today) {
      // Already active today
    } else if (user.lastActiveDate === yesterday) {
      newStreak += 1;
      await prisma.user.update({
        where: { id: userId },
        data: { streakDays: newStreak, lastActiveDate: today },
      });
    } else if (user.lastActiveDate !== today) {
      newStreak = clinicalSessions.some(
        (s) => s.date.toISOString().split("T")[0] === today
      )
        ? 1
        : 0;
      await prisma.user.update({
        where: { id: userId },
        data: { streakDays: newStreak, lastActiveDate: today },
      });
    }

    // Determine certification level
    const lifeSessions = clinicalSessions.filter((s) => s.technique === "LIFE").length;
    const softSessions = clinicalSessions.filter((s) => s.technique === "SOFT").length;
    const fitSessions = clinicalSessions.filter((s) => s.technique === "FIT").length;
    const detoxSessions = clinicalSessions.filter((s) => s.technique === "DETOX").length;

    let currentLevel = "none";
    if (lifeSessions >= 5 && simulations.length >= 1) currentLevel = "praticante_pedala";
    if (lifeSessions >= 20 && avgReduction >= 70) currentLevel = "terapeuta_life";
    if (softSessions >= 15) currentLevel = "terapeuta_soft";
    if (fitSessions >= 15) currentLevel = "terapeuta_fit";
    if (detoxSessions >= 15) currentLevel = "terapeuta_detox";
    if (totalSessions >= 60 && lifeSessions >= 20 && softSessions >= 15 && fitSessions >= 15 && detoxSessions >= 15) {
      currentLevel = "especialista_completo";
    }

    if (currentLevel !== user.currentLevel) {
      await prisma.user.update({
        where: { id: userId },
        data: { currentLevel },
      });
    }

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        experience: user.experience,
        xp: user.xp,
        streakDays: newStreak,
        currentLevel,
      },
      stats: {
        totalSessions,
        totalRevenue,
        avgReduction,
        avgSimScore,
        sessionsByTechnique,
        completedProtocols: new Set(clinicalSessions.map((s) => s.protocolId)).size,
      },
      achievements: user.achievements.map((a) => a.achievementId),
      recentSessions: clinicalSessions.slice(0, 5),
      simulations: simulations.length,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
