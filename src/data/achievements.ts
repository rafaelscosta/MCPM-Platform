import { Achievement, WeeklyMission, BusinessModule } from "@/types";

export const achievements: Achievement[] = [
  // Prática
  { id: "first-session", name: "Primeira Sessão", description: "Registrou seu primeiro atendimento", icon: "🎯", category: "pratica" },
  { id: "streak-7", name: "Consistência", description: "7 dias consecutivos com atendimento", icon: "🔥", category: "pratica" },
  { id: "streak-30", name: "Dedicação Total", description: "30 dias consecutivos com atendimento", icon: "💎", category: "pratica" },
  { id: "sessions-10", name: "Mãos de Ouro", description: "10 atendimentos registrados", icon: "✨", category: "pratica" },
  { id: "sessions-50", name: "Mestre da Prática", description: "50 atendimentos registrados", icon: "🏆", category: "pratica" },
  { id: "sessions-100", name: "Centurião", description: "100 atendimentos registrados", icon: "💯", category: "pratica" },

  // Receita
  { id: "first-payment", name: "Primeira Sessão Paga", description: "Cobrou pelo primeiro atendimento", icon: "💰", category: "receita" },
  { id: "revenue-1k", name: "R$1K Acumulado", description: "Faturou R$1.000 com atendimentos", icon: "🎉", category: "receita" },
  { id: "revenue-5k", name: "R$5K Acumulado", description: "Faturou R$5.000 com atendimentos", icon: "🚀", category: "receita" },
  { id: "revenue-10k", name: "R$10K Acumulado", description: "Faturou R$10.000 com atendimentos", icon: "⭐", category: "receita" },
  { id: "charge-150", name: "Valor Premium", description: "Cobrou R$150+ em uma sessão", icon: "💎", category: "receita" },

  // Técnica
  { id: "pedala-master", name: "PEDALA Master", description: "Dominou o framework PEDALA completo", icon: "🧠", category: "tecnica" },
  { id: "pain-zero", name: "Dor Zero", description: "Reduziu dor de 8+ para 0 em uma sessão", icon: "🎯", category: "tecnica" },
  { id: "effectiveness-90", name: "Excelência Clínica", description: "Taxa de efetividade acima de 90%", icon: "📊", category: "tecnica" },
  { id: "all-regions", name: "Corpo Completo", description: "Atendeu pacientes com dor em todas as regiões", icon: "🗺️", category: "tecnica" },
  { id: "complex-case", name: "Caso Complexo", description: "Resolveu um caso com dor referida", icon: "🔬", category: "tecnica" },

  // Social
  { id: "first-share", name: "Compartilhou Resultado", description: "Compartilhou seu primeiro resultado de atendimento", icon: "📱", category: "social" },
  { id: "portfolio-5", name: "Portfólio Ativo", description: "5 casos no portfólio público", icon: "📋", category: "social" },
  { id: "referral", name: "Indicação", description: "Indicou um novo aluno para o MCPM", icon: "🤝", category: "social" },
];

export const sampleMissions: WeeklyMission[] = [
  {
    id: "mission-1",
    title: "Mãos na Massa",
    description: "Aplique PEDALA em 2 pessoas esta semana",
    target: 2,
    current: 0,
    reward: "50 XP + Badge especial",
    expiresAt: "2026-03-12",
  },
  {
    id: "mission-2",
    title: "Mapa da Dor Explorer",
    description: "Estude 3 músculos novos no Mapa da Dor",
    target: 3,
    current: 0,
    reward: "30 XP",
    expiresAt: "2026-03-12",
  },
  {
    id: "mission-3",
    title: "Documentar é Evoluir",
    description: "Registre 1 atendimento completo no Diário Clínico",
    target: 1,
    current: 0,
    reward: "40 XP + Selo Documentação",
    expiresAt: "2026-03-12",
  },
];

export const businessModules: BusinessModule[] = [
  {
    id: "biz-captacao",
    title: "Script de Captação",
    description: "Como oferecer atendimento (não 'vender massagem')",
    unlockCondition: "Após completar PEDALA básico",
    content: [
      "Script de abordagem para oferecer massagem clínica",
      "Como diferenciar massagem clínica de massagem relaxante",
      "Frases que convertem: fale sobre DOR, não sobre massagem",
      "Como cobrar pelo seu trabalho desde o primeiro atendimento",
    ],
    isUnlocked: false,
  },
  {
    id: "biz-precificacao",
    title: "Precificação Premium",
    description: "Como cobrar R$150+ desde o início",
    unlockCondition: "Após 1ª técnica completa",
    content: [
      "Por que a massagem clínica vale mais que a relaxante",
      "Tabela de preços por região e complexidade",
      "Como apresentar o valor ao paciente",
      "Scripts de resposta para objeções de preço",
    ],
    isUnlocked: false,
  },
  {
    id: "biz-planos",
    title: "Planos de Tratamento",
    description: "Como propor, precificar e fechar planos",
    unlockCondition: "Após 5 atendimentos registrados",
    content: [
      "Como criar um plano de tratamento de 5-10 sessões",
      "Precificação de planos: valor unitário vs. pacote",
      "Script de apresentação do plano ao paciente",
      "Como aumentar a adesão ao tratamento completo",
    ],
    isUnlocked: false,
  },
  {
    id: "biz-indicacao",
    title: "Boca a Boca Turbinado",
    description: "Como pedir indicação de forma profissional",
    unlockCondition: "Após dominar 2 técnicas",
    content: [
      "Quando e como pedir indicação",
      "Sistema de indicação com recompensa",
      "Como transformar 1 paciente em 5",
      "Template de mensagem pós-atendimento",
    ],
    isUnlocked: false,
  },
  {
    id: "biz-agenda",
    title: "Gestão da Agenda",
    description: "Como lotar sua agenda sem redes sociais",
    unlockCondition: "Após 20 atendimentos registrados",
    content: [
      "Horários que mais vendem",
      "Como gerenciar cancelamentos",
      "Agenda de recorrência: mantenha o paciente voltando",
      "Ferramentas gratuitas de agendamento",
    ],
    isUnlocked: false,
  },
  {
    id: "biz-posicionamento",
    title: "Posicionamento Digital",
    description: "Criação do seu posicionamento como terapeuta MCPM",
    unlockCondition: "Ao completar o curso",
    content: [
      "Bio profissional para redes sociais",
      "Portfólio digital: como usar seus resultados",
      "Google Meu Negócio para terapeutas",
      "Conteúdo que atrai pacientes qualificados",
    ],
    isUnlocked: false,
  },
];
