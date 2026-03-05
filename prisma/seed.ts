import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const hashedPassword = await bcrypt.hash("demo123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@mcpm.com" },
    update: {},
    create: {
      name: "Aluna Demo",
      email: "demo@mcpm.com",
      hashedPassword,
      experience: "iniciante",
      goal: "profissao_principal",
      focus: "domicilio",
      availability: "moderado",
      xp: 450,
      streakDays: 5,
      currentLevel: "praticante_pedala",
    },
  });

  console.log(`Created user: ${user.name} (${user.email})`);

  // Create demo clinical sessions
  const sessions = [
    { patientName: "Maria Silva", region: "pescoco", technique: "LIFE", muscleId: "trapezio_superior", protocolId: "prot-trap-sup-life", painBefore: 8, painAfter: 2, duration: 45, chargedAmount: 150, notes: "Paciente com dor cervical há 3 meses. Aplicado PEDALA completo. Alívio imediato.", isPublic: true, daysAgo: 1 },
    { patientName: "João Pereira", region: "lombar", technique: "LIFE", muscleId: "quadrado_lombar", protocolId: "prot-ql-life", painBefore: 7, painAfter: 1, duration: 50, chargedAmount: 180, notes: "Lombalgia crônica. Quadrado Lombar bilateral. Resultado excelente.", isPublic: true, daysAgo: 2 },
    { patientName: "Ana Carvalho", region: "ombro", technique: "LIFE", muscleId: "supraespinhoso", protocolId: "prot-supra-life", painBefore: 6, painAfter: 2, duration: 40, chargedAmount: 150, notes: "Dor no ombro direito. Impacto do supraespinhoso.", isPublic: true, daysAgo: 4 },
    { patientName: "Carlos Santos", region: "quadril", technique: "LIFE", muscleId: "piriforme", protocolId: "prot-piri-life", painBefore: 9, painAfter: 3, duration: 55, chargedAmount: 200, notes: "Falsa ciática. Piriforme muito ativo.", isPublic: true, daysAgo: 5 },
    { patientName: "Lucia Oliveira", region: "costas_superior", technique: "LIFE", muscleId: "romboides", protocolId: "prot-romb-life", painBefore: 5, painAfter: 1, duration: 35, chargedAmount: 120, notes: "Dor interescapular. Postura cifótica.", isPublic: true, daysAgo: 7 },
    { patientName: "Roberto Lima", region: "pescoco", technique: "LIFE", muscleId: "esternocleidomastoideo", protocolId: "prot-ecm-life", painBefore: 7, painAfter: 2, duration: 40, chargedAmount: 150, notes: "Cefaleia tensional crônica. ECM bilateral.", isPublic: false, daysAgo: 9 },
    { patientName: "Sandra Costa", region: "lombar", technique: "LIFE", muscleId: "paravertebrais_lombares", protocolId: "prot-pv-lomb-life", painBefore: 6, painAfter: 1, duration: 35, chargedAmount: 130, notes: "Dor lombar bilateral, eretores.", isPublic: false, daysAgo: 11 },
    { patientName: "Fernanda Souza", region: "pescoco", technique: "LIFE", muscleId: "trapezio_superior", protocolId: "prot-trap-sup-life", painBefore: 8, painAfter: 1, duration: 45, chargedAmount: 150, notes: "Segundo atendimento. Resultado excelente.", isPublic: true, daysAgo: 14 },
    { patientName: "Paulo Mendes", region: "quadril", technique: "LIFE", muscleId: "gluteo_medio", protocolId: "prot-glut-med-life", painBefore: 7, painAfter: 2, duration: 45, chargedAmount: 160, notes: "Dor no quadril lateral. Glúteo médio.", isPublic: false, daysAgo: 16 },
    { patientName: "Teresa Almeida", region: "coxa", technique: "FIT", muscleId: "isquiotibiais", protocolId: "prot-isq-fit", painBefore: 5, painAfter: 1, duration: 30, chargedAmount: 120, notes: "Corredora com dor posterior da coxa.", isPublic: false, daysAgo: 20 },
    { patientName: "Marcos Pereira", region: "torax", technique: "SOFT", muscleId: "peitoral_maior", protocolId: "prot-peit-soft", painBefore: 6, painAfter: 2, duration: 40, chargedAmount: 150, notes: "Dor torácica. Descartada causa cardíaca.", isPublic: false, daysAgo: 22 },
    { patientName: "Amanda Reis", region: "perna", technique: "FIT", muscleId: "gastrocnemio", protocolId: "prot-gastro-fit", painBefore: 7, painAfter: 2, duration: 35, chargedAmount: 120, notes: "Câimbras frequentes. Orientada hidratação.", isPublic: false, daysAgo: 25 },
  ];

  for (const session of sessions) {
    const date = new Date();
    date.setDate(date.getDate() - session.daysAgo);

    await prisma.clinicalSession.create({
      data: {
        userId: user.id,
        patientName: session.patientName,
        region: session.region,
        technique: session.technique,
        muscleId: session.muscleId,
        protocolId: session.protocolId,
        painBefore: session.painBefore,
        painAfter: session.painAfter,
        duration: session.duration,
        chargedAmount: session.chargedAmount,
        notes: session.notes,
        isPublic: session.isPublic,
        date,
      },
    });
  }

  console.log(`Created ${sessions.length} clinical sessions`);

  // Create achievements
  const achievementIds = ["first-session", "first-payment", "streak-7", "sessions-10", "charge-150"];
  for (const achievementId of achievementIds) {
    await prisma.userAchievement.create({
      data: {
        userId: user.id,
        achievementId,
      },
    });
  }

  console.log(`Created ${achievementIds.length} achievements`);

  // Create simulation results
  const simResults = [
    { virtualPatientId: "vp-1", difficulty: "facil", selectedMuscle: "trapezio_superior", correctMuscle: "trapezio_superior", selectedProtocol: "prot-trap-sup-life", correctProtocol: "prot-trap-sup-life", score: 100 },
    { virtualPatientId: "vp-2", difficulty: "facil", selectedMuscle: "quadrado_lombar", correctMuscle: "quadrado_lombar", selectedProtocol: "prot-ql-life", correctProtocol: "prot-ql-life", score: 95 },
    { virtualPatientId: "vp-4", difficulty: "medio", selectedMuscle: "trapezio_superior", correctMuscle: "esternocleidomastoideo", selectedProtocol: "prot-trap-sup-life", correctProtocol: "prot-ecm-life", score: 35 },
  ];

  for (const sim of simResults) {
    await prisma.simulationResult.create({
      data: {
        userId: user.id,
        ...sim,
      },
    });
  }

  console.log(`Created ${simResults.length} simulation results`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
