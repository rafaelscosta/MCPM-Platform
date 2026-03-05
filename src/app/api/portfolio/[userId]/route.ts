import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/portfolio/[userId] - Public portfolio
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        currentLevel: true,
        xp: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Profissional não encontrado" }, { status: 404 });
    }

    // Only public sessions
    const publicSessions = await prisma.clinicalSession.findMany({
      where: { userId, isPublic: true },
      orderBy: { date: "desc" },
      select: {
        id: true,
        date: true,
        region: true,
        technique: true,
        painBefore: true,
        painAfter: true,
        duration: true,
      },
    });

    const totalPublicSessions = publicSessions.length;
    const avgReduction = totalPublicSessions > 0
      ? Math.round(
          publicSessions.reduce(
            (sum, s) => sum + ((s.painBefore - s.painAfter) / Math.max(s.painBefore, 1)) * 100,
            0
          ) / totalPublicSessions
        )
      : 0;

    // Achievements
    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true, unlockedAt: true },
    });

    return NextResponse.json({
      professional: {
        name: user.name,
        level: user.currentLevel,
        memberSince: user.createdAt,
      },
      portfolio: {
        totalSessions: totalPublicSessions,
        avgPainReduction: avgReduction,
        sessions: publicSessions,
        achievements: achievements.map((a) => a.achievementId),
      },
    });
  } catch (error) {
    console.error("Portfolio error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
