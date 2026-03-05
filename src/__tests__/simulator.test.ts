import { describe, it, expect } from "vitest";
import { virtualPatients, assessmentQuestions } from "@/data/simulator";
import { muscles } from "@/data/muscles";

describe("Simulator Data", () => {
  it("should have at least 5 virtual patients", () => {
    expect(virtualPatients.length).toBeGreaterThanOrEqual(5);
  });

  it("every virtual patient should reference a valid muscle", () => {
    const muscleIds = muscles.map((m) => m.id);
    for (const patient of virtualPatients) {
      expect(muscleIds).toContain(patient.correctMuscle);
    }
  });

  it("every virtual patient should have a complaint and region", () => {
    for (const patient of virtualPatients) {
      expect(patient.complaint).toBeTruthy();
      expect(patient.painRegion).toBeTruthy();
      expect(patient.painIntensity).toBeGreaterThan(0);
      expect(patient.painIntensity).toBeLessThanOrEqual(10);
    }
  });

  it("should have exactly 5 assessment questions", () => {
    expect(assessmentQuestions.length).toBe(5);
  });

  it("assessment questions should have question and purpose", () => {
    for (const q of assessmentQuestions) {
      expect(q.question).toBeTruthy();
      expect(q.purpose).toBeTruthy();
    }
  });

  it("should cover multiple difficulty levels", () => {
    const difficulties = new Set(virtualPatients.map((p) => p.difficulty));
    expect(difficulties.size).toBeGreaterThanOrEqual(2);
  });
});
