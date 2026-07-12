"use client";

import { useRef, useState } from "react";
import { submitQuoteAction } from "./actions";

interface QuoteFormProps {
  requestId: string;
  existingPremium: number | null;
  existingNote: string | null;
}

export function QuoteForm({ requestId, existingPremium, existingNote }: QuoteFormProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setSuccess(false);

    const result = await submitQuoteAction(requestId, formData);

    setPending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSuccess(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="premium">
          เบี้ยประกัน (บาท)
        </label>
        <input
          id="premium"
          name="premium"
          type="number"
          min={0}
          step={1}
          required
          defaultValue={existingPremium ?? undefined}
          className="w-48 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="note">
          หมายเหตุถึงลูกค้า (ถ้ามี)
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          defaultValue={existingNote ?? ""}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="attachments">
          เอกสารแนบ (ถ้ามี) — รูป JPG/PNG หรือ PDF สูงสุด 4 ไฟล์ ไฟล์ละไม่เกิน 5MB
        </label>
        <input
          ref={fileInputRef}
          id="attachments"
          name="attachments"
          type="file"
          multiple
          accept="image/jpeg,image/png,application/pdf"
          className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-amber-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-amber-800 hover:file:bg-amber-100"
        />
        <p className="mt-1 text-xs text-neutral-400">
          รูปจะแสดงในแชทลูกค้าโดยตรง ส่วน PDF จะส่งเป็นลิงก์ให้กดเปิด
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-emerald-700">ส่งราคาให้ลูกค้าทาง LINE เรียบร้อยแล้ว</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
      >
        {pending ? "กำลังส่ง..." : "ส่งราคาให้ลูกค้าทาง LINE"}
      </button>
    </form>
  );
}
