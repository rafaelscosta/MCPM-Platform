import { describe, it, expect } from "vitest";
import { muscles, musclesByRegion, regionNames } from "@/data/muscles";

describe("Muscles Data", () => {
  it("should have at least 15 muscles defined", () => {
    expect(muscles.length).toBeGreaterThanOrEqual(15);
  });

  it("every muscle should have required fields", () => {
    for (const muscle of muscles) {
      expect(muscle.id).toBeTruthy();
      expect(muscle.name).toBeTruthy();
      expect(muscle.region).toBeTruthy();
      expect(muscle.technique).toBeTruthy();
      expect(muscle.description).toBeTruthy();
      expect(muscle.svgPath).toBeTruthy();
      expect(muscle.triggerPoints.length).toBeGreaterThan(0);
      expect(muscle.protocols.length).toBeGreaterThan(0);
    }
  });

  it("every muscle should have valid PEDALA protocols with 6 steps", () => {
    for (const muscle of muscles) {
      for (const protocol of muscle.protocols) {
        expect(protocol.pedalaSteps.length).toBe(6);
        const steps = protocol.pedalaSteps.map((s) => s.step);
        expect(steps).toEqual(["P", "E", "D", "A", "L", "A2"]);
      }
    }
  });

  it("musclesByRegion should group muscles correctly", () => {
    const totalFromRegions = Object.values(musclesByRegion).reduce(
      (sum, group) => sum + group.length,
      0
    );
    expect(totalFromRegions).toBe(muscles.length);
  });

  it("regionNames should cover all regions used by muscles", () => {
    const usedRegions = new Set(muscles.map((m) => m.region));
    for (const region of usedRegions) {
      expect(regionNames[region]).toBeTruthy();
    }
  });

  it("muscle IDs should be unique", () => {
    const ids = muscles.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("trigger points should have valid coordinates", () => {
    for (const muscle of muscles) {
      for (const tp of muscle.triggerPoints) {
        expect(tp.x).toBeGreaterThan(0);
        expect(tp.y).toBeGreaterThan(0);
        expect(tp.name).toBeTruthy();
        expect(tp.referredPainZone).toBeTruthy();
      }
    }
  });
});
