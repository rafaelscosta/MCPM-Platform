import { describe, it, expect } from "vitest";
import { certifications, certificationOrder } from "@/data/certifications";

describe("Certifications Data", () => {
  it("should have all certification levels defined", () => {
    expect(certificationOrder.length).toBeGreaterThanOrEqual(6);
  });

  it("every certification should have required fields", () => {
    for (const id of certificationOrder) {
      const cert = certifications[id];
      expect(cert).toBeDefined();
      expect(cert.name).toBeTruthy();
      expect(cert.description).toBeTruthy();
      expect(cert.icon).toBeTruthy();
      expect(cert.marketValue).toBeTruthy();
    }
  });

  it("certification order should start with none", () => {
    expect(certificationOrder[0]).toBe("none");
  });

  it("each certification except none should have requirements", () => {
    for (const id of certificationOrder) {
      if (id === "none") continue;
      const cert = certifications[id];
      expect(cert.requirements.length).toBeGreaterThan(0);
    }
  });
});
