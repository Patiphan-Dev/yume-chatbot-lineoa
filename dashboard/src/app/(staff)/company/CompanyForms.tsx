"use client";

import { FormEvent, useState } from "react";
import { CompanyProfile, InsuranceInfo, PROFILE_FIELDS } from "@/lib/companyInfo";
import { saveCompanyProfileAction, saveInsuranceInfoAction, SaveResult } from "./actions";

// Forms use onSubmit + preventDefault — client-function form actions require
// React 19 and silently no-op on this app's React 18.

function useSaveState() {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function run(action: () => Promise<SaveResult>) {
    setError(null);
    setSaved(false);
    const result = await action();
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSaved(true);
  }

  return { error, saved, run };
}

function SaveFeedback({ error, saved }: { error: string | null; saved: boolean }) {
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (saved) return <p className="text-sm text-emerald-700">บันทึกแล้ว — บอทจะใช้ข้อมูลใหม่ภายใน 1 นาที</p>;
  return null;
}

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none";

export function CompanyProfileForm({ profile }: { profile: CompanyProfile }) {
  const { error, saved, run } = useSaveState();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    void run(() => saveCompanyProfileAction(formData));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {PROFILE_FIELDS.map((field) => (
          <label key={field.key} className="block">
            <span className="mb-1 block text-sm font-medium text-neutral-700">{field.label}</span>
            <input name={field.key} defaultValue={profile[field.key]} required className={inputClass} />
          </label>
        ))}
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700">จุดเด่นของบริษัท (บรรทัดละ 1 ข้อ)</span>
        <textarea name="highlights" rows={4} defaultValue={profile.highlights.join("\n")} className={inputClass} />
      </label>

      <SaveFeedback error={error} saved={saved} />
      <button type="submit" className="rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800">
        บันทึกข้อมูลบริษัท
      </button>
    </form>
  );
}

export function InsuranceInfoForm({
  insuranceType,
  label,
  info,
}: {
  insuranceType: string;
  label: string;
  info: InsuranceInfo;
}) {
  const { error, saved, run } = useSaveState();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    void run(() => saveInsuranceInfoAction(insuranceType, formData));
  }

  return (
    <details className="rounded-lg border border-neutral-200 bg-white">
      <summary className="cursor-pointer px-5 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50">
        {label}
      </summary>
      <form onSubmit={handleSubmit} className="space-y-3 border-t border-neutral-100 p-5">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-neutral-700">สรุปสั้นๆ</span>
          <input name="summary" defaultValue={info.summary} required className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-neutral-700">ความคุ้มครอง (บรรทัดละ 1 ข้อ)</span>
          <textarea name="coverage" rows={4} defaultValue={info.coverage.join("\n")} required className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-neutral-700">เหมาะกับใคร</span>
          <input name="suitableFor" defaultValue={info.suitableFor} required className={inputClass} />
        </label>

        <SaveFeedback error={error} saved={saved} />
        <button type="submit" className="rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800">
          บันทึก
        </button>
      </form>
    </details>
  );
}
