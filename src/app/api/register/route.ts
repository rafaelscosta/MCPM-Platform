import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 registrations per IP per 15 min
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { allowed } = rateLimit(`register:${ip}`, { maxRequests: 5, windowMs: 900000 });
    if (!allowed) {
      return NextResponse.json({ error: "Muitas tentativas. Tente novamente em 15 minutos." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { name, email, password, experience } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        experience: experience || "iniciante",
        goal: body.goal || "profissao_principal",
        focus: body.focus || "domicilio",
        availability: body.availability || "moderado",
      },
    });

    return NextResponse.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
