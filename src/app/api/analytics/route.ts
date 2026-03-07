import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

// GET /api/analytics - Get engagement analytics
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const { allowed } = rateLimit(`analytics:${session.user.id}`, { maxRequests: 10, windowMs: 60000 });
    if (!allowed) {
      return NextResponse.json({ error: "Rate limit excedido" }, { status: 429 });
    }

    const userId = session.user.id;

    const [sessions, simulations, user] = await Promise.all([
      prisma.clinicalSession.findMany({ where: { userId }, orderBy: { date: "asc" } }),
      prisma.simulationResult.findMany({ where: { userId }, orderBy: { completedAt: "asc" } }),
      prisma.user.findUnique({ where: { id: userId } }),
    ]);

    // Revenue by month
    const revenueByMonth: Record<string, number> = {};
    const sessionsByMonth: Record<string, number> = {};
    for (const s of sessions) {
      const month = s.date.toISOString().slice(0, 7);
      revenueByMonth[month] = (revenueByMonth[month] || 0) + s.chargedAmount;
      sessionsByMonth[month] = (sessionsByMonth[month] || 0) + 1;
    }

    // Pain reduction trend
    const painTrend = sessions.map((s) => ({
      date: s.date.toISOString().split("T")[0],
      reduction: s.painBefore > 0 ? Math.round(((s.painBefore - s.painAfter) / s.painBefore) * 100) : 0,
    }));

    // Technique distribution
    const techniqueDistribution = sessions.reduce(
      (acc, s) => {
        acc[s.technique] = (acc[s.technique] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Simulation score trend
    const simScoreTrend = simulations.map((s) => ({
      date: s.completedAt.toISOString().split("T")[0],
      score: s.score,
    }));

    // Average ticket evolution
    const months = Object.keys(revenueByMonth).sort();
    const ticketTrend = months.map((m) => ({
      month: m,
      ticket: sessionsByMonth[m] > 0 ? Math.round(revenueByMonth[m] / sessionsByMonth[m]) : 0,
    }));

    return NextResponse.json({
      summary: {
        totalSessions: sessions.length,
        totalRevenue: sessions.reduce((sum, s) => sum + s.chargedAmount, 0),
        avgReduction: sessions.length > 0
          ? Math.round(sessions.reduce((sum, s) => sum + ((s.painBefore - s.painAfter) / Math.max(s.painBefore, 1)) * 100, 0) / sessions.length)
          : 0,
        avgSimScore: simulations.length > 0
          ? Math.round(simulations.reduce((sum, s) => sum + s.score, 0) / simulations.length)
          : 0,
        streakDays: user?.streakDays || 0,
        memberSince: user?.createdAt?.toISOString() || "",
      },
      charts: {
        revenueByMonth,
        sessionsByMonth,
        painTrend,
        techniqueDistribution,
        simScoreTrend,
        ticketTrend,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST /api/analytics - Track events
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ ok: true }); // Silently accept anonymous

    const { allowed } = rateLimit(`analytics-post:${session.user.id}`, { maxRequests: 100, windowMs: 60000 });
    if (!allowed) return NextResponse.json({ ok: true });

    // Event tracking would go to external analytics service in production
    // For now, just acknowledge
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
