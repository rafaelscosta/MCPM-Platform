import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (userId) {
      const { allowed } = rateLimit(`ranking:${userId}`, { maxRequests: 30, windowMs: 60000 });
      if (!allowed) {
        return NextResponse.json({ error: "Rate limit excedido" }, { status: 429 });
      }
    }

    // Get all users with their sessions
    const users = await prisma.user.findMany({
      include: {
        clinicalSessions: true,
        simulationResults: true,
      },
    });

    const ranking = users.map((user) => {
      const sessions = user.clinicalSessions;
      const totalSessions = sessions.length;
      const totalRevenue = sessions.reduce((sum, s) => sum + s.chargedAmount, 0);
      const avgEffectiveness = totalSessions > 0
        ? Math.round(
            sessions.reduce(
              (sum, s) => sum + ((s.painBefore - s.painAfter) / Math.max(s.painBefore, 1)) * 100,
              0
            ) / totalSessions
          )
        : 0;

      return {
        id: user.id,
        name: user.name || "Aluna MCPM",
        level: user.currentLevel,
        sessions: totalSessions,
        effectiveness: avgEffectiveness,
        revenue: totalRevenue,
        streak: user.streakDays,
        isCurrentUser: user.id === userId,
      };
    });

    // Sort by sessions by default (client can re-sort)
    ranking.sort((a, b) => b.sessions - a.sessions);

    // Add rank badges
    const rankedData = ranking.map((r, i) => ({
      ...r,
      rank: i + 1,
      badge: i === 0 ? "👑" : i === 1 ? "🥈" : i === 2 ? "🥉" : r.isCurrentUser ? "⭐" : "",
    }));

    return NextResponse.json(rankedData);
  } catch (error) {
    console.error("Ranking error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
