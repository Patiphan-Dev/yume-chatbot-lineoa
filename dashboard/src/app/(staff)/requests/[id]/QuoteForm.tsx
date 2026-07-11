"use client";

import { useState } from "react";
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
