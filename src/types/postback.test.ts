import { describe, expect, it } from "vitest";
import { buildPostbackData, parsePostbackData } from "./postback";

describe("postback data round-trip", () => {
  it("builds and parses select_service", () => {
    const data = buildPostbackData("select_service", "CHECK_PREMIUM");
    expect(parsePostbackData(data)).toEqual({ action: "select_service", value: "CHECK_PREMIUM" });
  });

  it("builds and parses select_insurance_type", () => {
    const data = buildPostbackData("select_insurance_type", "CAR_CLASS_2_3");
    expect(parsePostbackData(data)).toEqual({ action: "select_insurance_type", value: "CAR_CLASS_2_3" });
  });
});

describe("parsePostbackData rejects malformed input", () => {
  it("rejects unknown actions", () => {
    expect(parsePostbackData("action=hack&value=X")).toBeNull();
  });

  it("rejects missing value", () => {
    expect(parsePostbackData("action=select_service")).toBeNull();
  });

  it("rejects empty strings", () => {
    expect(parsePostbackData("")).toBeNull();
  });
});
