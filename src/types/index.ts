// ===== STUDENT PROFILE =====
export type ExperienceLevel = "iniciante" | "intermediario" | "avancado";
export type MainGoal = "renda_extra" | "profissao_principal" | "complementar_formacao";
export type FocusArea = "clinicas" | "domicilio" | "eventos";
export type Availability = "pouco" | "moderado" | "intenso";

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  experience: ExperienceLevel;
  goal: MainGoal;
  focus: FocusArea;
  availability: Availability;
  enrolledAt: string;
  currentLevel: CertificationLevel;
  totalSessions: number;
  totalRevenue: number;
  streakDays: number;
  xp: number;
}

// ===== PEDALA PROTOCOL =====
export type PedalaStep = "P" | "E" | "D" | "A" | "L" | "A2";

export interface PedalaProtocol {
  step: PedalaStep;
  name: string;
  fullName: string;
  description: string;
  duration: string;
  tips: string[];
}

// ===== MUSCLES & PAIN MAP =====
export type BodyRegion =
  | "cabeca"
  | "pescoco"
  | "ombro"
  | "braco"
  | "antebraco"
  | "mao"
  | "torax"
  | "abdomen"
  | "lombar"
  | "quadril"
  | "coxa"
  | "joelho"
  | "perna"
  | "pe"
  | "costas_superior"
  | "costas_media"
  | "costas_inferior";

export type Technique = "LIFE" | "SOFT" | "FIT" | "DETOX";

export interface TriggerPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  referredPainZone: string;
}

export interface Muscle {
  id: string;
  name: string;
  region: BodyRegion;
  technique: Technique;
  triggerPoints: TriggerPoint[];
  protocols: Protocol[];
  contraindications: string[];
  svgPath: string;
  description: string;
}

export interface Protocol {
  id: string;
  muscleId: string;
  technique: Technique;
  name: string;
  description: string;
  pedalaSteps: PedalaProtocolStep[];
  videoUrl?: string;
  difficulty: "basico" | "intermediario" | "avancado";
  duration: string;
}

export interface PedalaProtocolStep {
  step: PedalaStep;
  instruction: string;
  duration: string;
  tips: string[];
}

// ===== CLINICAL DIARY =====
export interface ClinicalSession {
  id: string;
  studentId: string;
  date: string;
  patientName: string;
  region: BodyRegion;
  painBefore: number;
  painAfter: number;
  protocolApplied: string;
  technique: Technique;
  duration: number;
  chargedAmount: number;
  notes: string;
  photoUrl?: string;
}

// ===== CERTIFICATIONS =====
export type CertificationLevel =
  | "none"
  | "praticante_pedala"
  | "terapeuta_life"
  | "terapeuta_soft"
  | "terapeuta_fit"
  | "terapeuta_detox"
  | "especialista_completo";

export interface Certification {
  id: CertificationLevel;
  name: string;
  description: string;
  requirements: CertificationRequirement[];
  marketValue: string;
  icon: string;
}

export interface CertificationRequirement {
  type: "sessions" | "effectiveness" | "module" | "simulation" | "case";
  description: string;
  target: number;
  current: number;
}

// ===== GAMIFICATION =====
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: "pratica" | "receita" | "tecnica" | "social";
}

export interface WeeklyMission {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: string;
  expiresAt: string;
}

// ===== SIMULATOR =====
export type SimulatorDifficulty = "facil" | "medio" | "dificil" | "complexo";

export interface VirtualPatient {
  id: string;
  name: string;
  age: number;
  complaint: string;
  painRegion: BodyRegion;
  painIntensity: number;
  duration: string;
  difficulty: SimulatorDifficulty;
  correctMuscle: string;
  correctProtocol: string;
  history: string;
}

export interface SimulationResult {
  id: string;
  patientId: string;
  studentId: string;
  correctAssessment: boolean;
  correctMuscle: boolean;
  correctProtocol: boolean;
  score: number;
  feedback: string;
  completedAt: string;
}

// ===== BUSINESS MODULE =====
export interface BusinessModule {
  id: string;
  title: string;
  description: string;
  unlockCondition: string;
  content: string[];
  isUnlocked: boolean;
}

// ===== NAVIGATION =====
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
