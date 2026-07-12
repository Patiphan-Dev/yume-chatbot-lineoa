/** Renders a staff member's sequential codeNumber as the display code, e.g. 1 → "YM-001". */
export function formatStaffCode(codeNumber: number): string {
  return `YM-${String(codeNumber).padStart(3, "0")}`;
}
