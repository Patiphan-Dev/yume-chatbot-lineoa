// Thai users routinely enter vehicle years in Buddhist Era (พ.ศ. = ค.ศ. + 543).
// Any year above this threshold can only be a BE year — no car predates 2400 CE.
const BUDDHIST_ERA_THRESHOLD = 2400;
const BE_CE_OFFSET = 543;

/** Normalizes a year that may be Buddhist Era (2568) or Common Era (2025) to Common Era. */
export function toCommonEraYear(year: number): number {
  return year > BUDDHIST_ERA_THRESHOLD ? year - BE_CE_OFFSET : year;
}
