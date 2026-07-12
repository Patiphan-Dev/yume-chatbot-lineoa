import { requireAdminSession } from "@/lib/auth";
import { CompanyProfile, InsuranceInfo, SETTING_KEYS } from "@/lib/companyInfo";
import { prisma } from "@/lib/db";
import { INSURANCE_TYPE_LABEL_TH } from "@/lib/insuranceType";
import { CompanyProfileForm, InsuranceInfoForm } from "./CompanyForms";

const EMPTY_PROFILE: CompanyProfile = {
  name: "",
  description: "",
  license: "",
  address: "",
  serviceArea: "",
  phone: "",
  mobile: "",
  lineOa: "",
  facebook: "",
  businessHours: "",
  highlights: [],
};

const EMPTY_INFO: InsuranceInfo = { summary: "", coverage: [], suitableFor: "" };

export default async function CompanyInfoPage() {
  await requireAdminSession();

  const rows = await prisma.companySetting.findMany();
  const profile =
    (rows.find((row) => row.key === SETTING_KEYS.PROFILE)?.value as CompanyProfile | undefined) ?? EMPTY_PROFILE;
  const insuranceInfo =
    (rows.find((row) => row.key === SETTING_KEYS.INSURANCE_INFO)?.value as
      | Record<string, InsuranceInfo>
      | undefined) ?? {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">ข้อมูลบริษัท</h1>
        <p className="mt-1 text-sm text-neutral-500">
          ข้อมูลในหน้านี้คือสิ่งที่บอทใช้ตอบลูกค้าในเมนู “สอบถามข้อมูล” และคำถามผ่านแชท
        </p>
      </div>

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          โปรไฟล์บริษัทและช่องทางติดต่อ
        </h2>
        <CompanyProfileForm profile={profile} />
      </section>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          ข้อมูลประกันแต่ละประเภท
        </h2>
        <div className="space-y-2">
          {Object.entries(INSURANCE_TYPE_LABEL_TH).map(([type, label]) => (
            <InsuranceInfoForm
              key={type}
              insuranceType={type}
              label={label}
              info={insuranceInfo[type] ?? EMPTY_INFO}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
