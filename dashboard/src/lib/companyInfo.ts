// Mirror of the backend's company knowledge types (dashboard and backend are
// deployed separately and cannot share source files).

export interface CompanyProfile {
  name: string;
  description: string;
  license: string;
  address: string;
  serviceArea: string;
  phone: string;
  mobile: string;
  lineOa: string;
  facebook: string;
  businessHours: string;
  highlights: string[];
}

export interface InsuranceInfo {
  summary: string;
  coverage: string[];
  suitableFor: string;
}

export const SETTING_KEYS = {
  PROFILE: "profile",
  INSURANCE_INFO: "insurance_info",
} as const;

export const PROFILE_FIELDS: { key: keyof Omit<CompanyProfile, "highlights">; label: string }[] = [
  { key: "name", label: "ชื่อบริษัท" },
  { key: "description", label: "คำอธิบายธุรกิจ" },
  { key: "license", label: "ใบอนุญาต" },
  { key: "address", label: "ที่อยู่" },
  { key: "serviceArea", label: "พื้นที่ให้บริการ" },
  { key: "phone", label: "เบอร์โทรศัพท์" },
  { key: "mobile", label: "เบอร์มือถือ" },
  { key: "lineOa", label: "LINE OA" },
  { key: "facebook", label: "Facebook" },
  { key: "businessHours", label: "เวลาทำการ" },
];
