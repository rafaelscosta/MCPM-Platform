import { describe, it, expect } from "vitest";
import { achievements } from "@/data/achievements";

describe("Achievements Data", () => {
  it("should have at least 10 achievements", () => {
    expect(achievements.length).toBeGreaterThanOrEqual(10);
  });

  it("every achievement should have required fields", () => {
    for (const a of achievements) {
      expect(a.id).toBeTruthy();
      expect(a.name).toBeTruthy();
      expect(a.description).toBeTruthy();
      expect(a.icon).toBeTruthy();
      expect(a.category).toBeTruthy();
    }
  });

  it("achievement IDs should be unique", () => {
    const ids = achievements.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
