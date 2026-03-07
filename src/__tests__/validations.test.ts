import { describe, it, expect } from "vitest";
import { registerSchema, sessionSchema, simulationSchema } from "@/lib/validations";

describe("Zod Validations", () => {
  describe("registerSchema", () => {
    it("should accept valid registration data", () => {
      const result = registerSchema.safeParse({
        name: "Maria Silva",
        email: "maria@email.com",
        password: "123456",
        experience: "iniciante",
      });
      expect(result.success).toBe(true);
    });

    it("should reject short password", () => {
      const result = registerSchema.safeParse({
        name: "Maria",
        email: "maria@email.com",
        password: "123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid email", () => {
      const result = registerSchema.safeParse({
        name: "Maria",
        email: "not-an-email",
        password: "123456",
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty name", () => {
      const result = registerSchema.safeParse({
        name: "",
        email: "maria@email.com",
        password: "123456",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("sessionSchema", () => {
    it("should accept valid session data", () => {
      const result = sessionSchema.safeParse({
        patientName: "Joao",
        region: "lombar",
        technique: "LIFE",
        muscleId: "quadrado_lombar",
        protocolId: "prot-ql-life",
        painBefore: 8,
        painAfter: 2,
        duration: 25,
        chargedAmount: 150,
      });
      expect(result.success).toBe(true);
    });

    it("should reject pain values above 10", () => {
      const result = sessionSchema.safeParse({
        patientName: "Joao",
        region: "lombar",
        technique: "LIFE",
        muscleId: "quadrado_lombar",
        protocolId: "prot-ql-life",
        painBefore: 15,
        painAfter: 2,
        duration: 25,
        chargedAmount: 150,
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid technique", () => {
      const result = sessionSchema.safeParse({
        patientName: "Joao",
        region: "lombar",
        technique: "INVALID",
        muscleId: "quadrado_lombar",
        protocolId: "prot-ql-life",
        painBefore: 8,
        painAfter: 2,
        duration: 25,
        chargedAmount: 150,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("simulationSchema", () => {
    it("should accept valid simulation data", () => {
      const result = simulationSchema.safeParse({
        virtualPatientId: "patient-1",
        difficulty: "facil",
        selectedMuscle: "trapezio_superior",
        correctMuscle: "trapezio_superior",
        selectedProtocol: "prot-trap-sup-life",
        correctProtocol: "prot-trap-sup-life",
        score: 80,
      });
      expect(result.success).toBe(true);
    });

    it("should reject score above 100", () => {
      const result = simulationSchema.safeParse({
        virtualPatientId: "patient-1",
        difficulty: "facil",
        selectedMuscle: "trapezio_superior",
        correctMuscle: "trapezio_superior",
        selectedProtocol: "prot-trap-sup-life",
        correctProtocol: "prot-trap-sup-life",
        score: 150,
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid difficulty", () => {
      const result = simulationSchema.safeParse({
        virtualPatientId: "patient-1",
        difficulty: "impossivel",
        selectedMuscle: "trapezio_superior",
        correctMuscle: "trapezio_superior",
        selectedProtocol: "prot-trap-sup-life",
        correctProtocol: "prot-trap-sup-life",
        score: 80,
      });
      expect(result.success).toBe(false);
    });
  });
});
