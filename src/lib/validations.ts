import { z } from "zod";

// Registration
export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(128),
  experience: z.enum(["iniciante", "intermediario", "avancado"]).optional(),
});

// Clinical Session
export const sessionSchema = z.object({
  patientName: z.string().min(1, "Nome do paciente é obrigatório").max(100),
  region: z.string().min(1),
  technique: z.enum(["LIFE", "SOFT", "FIT", "DETOX"]),
  muscleId: z.string().min(1),
  protocolId: z.string().min(1),
  painBefore: z.number().int().min(0).max(10),
  painAfter: z.number().int().min(0).max(10),
  duration: z.number().int().min(1).max(300),
  chargedAmount: z.number().min(0).max(10000),
  notes: z.string().max(2000).optional().default(""),
});

// Simulation Result
export const simulationSchema = z.object({
  virtualPatientId: z.string().min(1),
  difficulty: z.enum(["facil", "medio", "dificil", "complexo"]),
  selectedMuscle: z.string().min(1),
  correctMuscle: z.string().min(1),
  selectedProtocol: z.string().min(1),
  correctProtocol: z.string().min(1),
  score: z.number().int().min(0).max(100),
  feedback: z.string().max(1000).optional().default(""),
});

// AI Simulator chat
export const aiChatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(2000),
    })
  ).min(1).max(50),
  patientContext: z.string().max(1000).optional(),
});
