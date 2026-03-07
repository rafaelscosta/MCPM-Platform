import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { simulationSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rateLimit";

// POST /api/simulator - Save simulation result
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { allowed } = rateLimit(`sim:${session.user.id}`, { maxRequests: 30, windowMs: 60000 });
    if (!allowed) {
      return NextResponse.json({ error: "Rate limit excedido" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = simulationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const data = parsed.data;

    const result = await prisma.simulationResult.create({
      data: {
        userId: session.user.id,
        virtualPatientId: data.virtualPatientId,
        difficulty: data.difficulty,
        selectedMuscle: data.selectedMuscle,
        correctMuscle: data.correctMuscle,
        selectedProtocol: data.selectedProtocol,
        correctProtocol: data.correctProtocol,
        score: data.score,
        feedback: data.feedback || "",
      },
    });

    const xpReward = Math.round(data.score * 0.5);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { xp: { increment: xpReward } },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error saving simulation:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// GET /api/simulator - Get simulation history
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const results = await prisma.simulationResult.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: "desc" },
      take: 20,
    });

    const totalSimulations = results.length;
    const avgScore = totalSimulations > 0
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalSimulations)
      : 0;
    const passRate = totalSimulations > 0
      ? Math.round((results.filter((r) => r.score >= 60).length / totalSimulations) * 100)
      : 0;

    return NextResponse.json({
      results,
      stats: { totalSimulations, avgScore, passRate },
    });
  } catch (error) {
    console.error("Error fetching simulations:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
