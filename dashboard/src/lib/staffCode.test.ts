import { describe, expect, it } from "vitest";
import { formatStaffCode } from "./staffCode";

describe("formatStaffCode", () => {
  it("zero-pads to three digits", () => {
    expect(formatStaffCode(1)).toBe("YM-001");
    expect(formatStaffCode(42)).toBe("YM-042");
  });

  it("does not truncate beyond three digits", () => {
    expect(formatStaffCode(1234)).toBe("YM-1234");
  });
});
