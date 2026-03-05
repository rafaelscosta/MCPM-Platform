import { Certification, CertificationLevel } from "@/types";

export const certifications: Record<CertificationLevel, Certification> = {
  none: {
    id: "none",
    name: "Iniciante",
    description: "Ainda não possui certificação. Comece praticando!",
    requirements: [],
    marketValue: "Em formação",
    icon: "🌱",
  },
  praticante_pedala: {
    id: "praticante_pedala",
    name: "Praticante PEDALA",
    description: "Domina o framework PEDALA e já atende casualmente.",
    requirements: [
      { type: "module", description: "Completar módulo LIFE básico", target: 1, current: 0 },
      { type: "sessions", description: "5 atendimentos registrados", target: 5, current: 0 },
      { type: "simulation", description: "1 simulação aprovada", target: 1, current: 0 },
    ],
    marketValue: "Atende casualmente",
    icon: "🤲",
  },
  terapeuta_life: {
    id: "terapeuta_life",
    name: "Terapeuta MCPM Life",
    description: "Especialista em dor física. Cobra entre R$120-180 por sessão.",
    requirements: [
      { type: "sessions", description: "20 atendimentos LIFE registrados", target: 20, current: 0 },
      { type: "effectiveness", description: "Taxa de efetividade ≥ 70%", target: 70, current: 0 },
      { type: "module", description: "Avaliação teórica LIFE aprovada", target: 1, current: 0 },
    ],
    marketValue: "R$120-180/sessão",
    icon: "💪",
  },
  terapeuta_soft: {
    id: "terapeuta_soft",
    name: "Terapeuta MCPM Soft",
    description: "Especialista em liberação miofascial suave e serviços diferenciados.",
    requirements: [
      { type: "module", description: "Completar módulo SOFT", target: 1, current: 0 },
      { type: "sessions", description: "15 atendimentos SOFT registrados", target: 15, current: 0 },
      { type: "simulation", description: "Simulação SOFT aprovada", target: 1, current: 0 },
    ],
    marketValue: "Serviços diferenciados",
    icon: "🧘",
  },
  terapeuta_fit: {
    id: "terapeuta_fit",
    name: "Terapeuta MCPM Fit",
    description: "Especialista em massagem esportiva para atletas.",
    requirements: [
      { type: "module", description: "Completar módulo FIT", target: 1, current: 0 },
      { type: "sessions", description: "15 atendimentos FIT registrados", target: 15, current: 0 },
      { type: "case", description: "1 caso esportivo documentado", target: 1, current: 0 },
    ],
    marketValue: "Nicho esportivo",
    icon: "⚡",
  },
  terapeuta_detox: {
    id: "terapeuta_detox",
    name: "Terapeuta MCPM Detox",
    description: "Especialista em drenagem linfática terapêutica.",
    requirements: [
      { type: "module", description: "Completar módulo DETOX", target: 1, current: 0 },
      { type: "sessions", description: "15 atendimentos DETOX registrados", target: 15, current: 0 },
      { type: "module", description: "Protocolo completo aprovado", target: 1, current: 0 },
    ],
    marketValue: "Clínicas e spas",
    icon: "💧",
  },
  especialista_completo: {
    id: "especialista_completo",
    name: "Especialista MCPM Completo",
    description: "Domina todas as 4 técnicas. O mais alto nível de certificação.",
    requirements: [
      { type: "module", description: "Todos os 4 módulos completos", target: 4, current: 0 },
      { type: "sessions", description: "60 atendimentos totais registrados", target: 60, current: 0 },
      { type: "case", description: "1 caso complexo documentado", target: 1, current: 0 },
    ],
    marketValue: "R$200-300+/sessão",
    icon: "👑",
  },
};

export const certificationOrder: CertificationLevel[] = [
  "none",
  "praticante_pedala",
  "terapeuta_life",
  "terapeuta_soft",
  "terapeuta_fit",
  "terapeuta_detox",
  "especialista_completo",
];
