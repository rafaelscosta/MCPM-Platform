import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/sessions - List clinical sessions
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const technique = searchParams.get("technique");
    const limit = parseInt(searchParams.get("limit") || "50");

    const sessions = await prisma.clinicalSession.findMany({
      where: {
        userId: session.user.id,
        ...(technique ? { technique } : {}),
      },
      orderBy: { date: "desc" },
      take: limit,
    });

    // Calculate stats
    const allSessions = await prisma.clinicalSession.findMany({
      where: { userId: session.user.id },
    });

    const totalSessions = allSessions.length;
    const totalRevenue = allSessions.reduce((sum, s) => sum + s.chargedAmount, 0);
    const avgReduction = totalSessions > 0
      ? Math.round(
          allSessions.reduce(
            (sum, s) => sum + ((s.painBefore - s.painAfter) / Math.max(s.painBefore, 1)) * 100,
            0
          ) / totalSessions
        )
      : 0;

    return NextResponse.json({
      sessions,
      stats: { totalSessions, totalRevenue, avgReduction },
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// POST /api/sessions - Create a new clinical session
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      patientName,
      region,
      technique,
      muscleId,
      protocolId,
      painBefore,
      painAfter,
      duration,
      chargedAmount,
      notes,
      isPublic,
    } = body;

    if (!patientName || !region || !technique || !muscleId || !protocolId) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const clinicalSession = await prisma.clinicalSession.create({
      data: {
        userId: session.user.id,
        patientName,
        region,
        technique,
        muscleId,
        protocolId,
        painBefore: painBefore || 0,
        painAfter: painAfter || 0,
        duration: duration || 0,
        chargedAmount: chargedAmount || 0,
        notes: notes || "",
        isPublic: isPublic || false,
      },
    });

    // Update user stats
    const userSessions = await prisma.clinicalSession.count({
      where: { userId: session.user.id },
    });

    // Award XP
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        xp: { increment: 25 },
        lastActiveDate: new Date().toISOString().split("T")[0],
      },
    });

    // Check achievements
    await checkAchievements(session.user.id, userSessions, chargedAmount);

    return NextResponse.json(clinicalSession);
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

async function checkAchievements(userId: string, totalSessions: number, chargedAmount: number) {
  const achievementsToCheck = [
    { id: "first-session", condition: totalSessions >= 1 },
    { id: "sessions-10", condition: totalSessions >= 10 },
    { id: "sessions-50", condition: totalSessions >= 50 },
    { id: "sessions-100", condition: totalSessions >= 100 },
    { id: "first-payment", condition: chargedAmount > 0 },
    { id: "charge-150", condition: chargedAmount >= 150 },
  ];

  for (const achievement of achievementsToCheck) {
    if (achievement.condition) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
        update: {},
        create: {
          userId,
          achievementId: achievement.id,
        },
      });
    }
  }

  // Check revenue achievements
  const allSessions = await prisma.clinicalSession.findMany({
    where: { userId },
    select: { chargedAmount: true },
  });
  const totalRevenue = allSessions.reduce((sum, s) => sum + s.chargedAmount, 0);

  const revenueAchievements = [
    { id: "revenue-1k", condition: totalRevenue >= 1000 },
    { id: "revenue-5k", condition: totalRevenue >= 5000 },
    { id: "revenue-10k", condition: totalRevenue >= 10000 },
  ];

  for (const achievement of revenueAchievements) {
    if (achievement.condition) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
        update: {},
        create: {
          userId,
          achievementId: achievement.id,
        },
      });
    }
  }
}
