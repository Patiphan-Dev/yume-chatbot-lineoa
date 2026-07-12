import { describe, expect, it } from "vitest";
import { toCommonEraYear } from "./thaiYear";

describe("toCommonEraYear", () => {
  it("converts Buddhist Era years to Common Era", () => {
    expect(toCommonEraYear(2568)).toBe(2025);
    expect(toCommonEraYear(2543)).toBe(2000);
  });

  it("passes Common Era years through unchanged", () => {
    expect(toCommonEraYear(2025)).toBe(2025);
    expect(toCommonEraYear(1990)).toBe(1990);
  });

  it("treats the 2400 boundary as Common Era", () => {
    expect(toCommonEraYear(2400)).toBe(2400);
    expect(toCommonEraYear(2401)).toBe(1858);
  });
});
