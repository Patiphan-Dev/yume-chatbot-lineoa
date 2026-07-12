import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./passwords";

describe("password hashing", () => {
  it("verifies the original password", () => {
    const stored = hashPassword("s3cret-password");
    expect(verifyPassword("s3cret-password", stored)).toBe(true);
  });

  it("rejects a wrong password", () => {
    const stored = hashPassword("s3cret-password");
    expect(verifyPassword("wrong-password", stored)).toBe(false);
  });

  it("produces unique salts per hash", () => {
    expect(hashPassword("same")).not.toBe(hashPassword("same"));
  });

  it("rejects malformed stored values without throwing", () => {
    expect(verifyPassword("anything", "not-a-valid-hash")).toBe(false);
    expect(verifyPassword("anything", "")).toBe(false);
  });
});
