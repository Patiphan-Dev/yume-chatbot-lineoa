"use client";

import { RequestStatus } from "@prisma/client";
import { ChangeEvent, useState, useTransition } from "react";
import { updateRequestStatusAction } from "@/app/(staff)/requests/statusActions";
import { STATUS_LABEL_TH } from "./StatusBadge";

const STATUS_SELECT_STYLES: Record<RequestStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-800",
  IN_REVIEW: "border-blue-200 bg-blue-50 text-blue-800",
  QUOTED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  CLOSED: "border-neutral-300 bg-neutral-100 text-neutral-600",
  CANCELLED: "border-red-200 bg-red-50 text-red-700",
};

export function StatusSelect({ requestId, status }: { requestId: string; status: RequestStatus }) {
  const [current, setCurrent] = useState<RequestStatus>(status);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as RequestStatus;
    const previous = current;
    setCurrent(next);
    setError(null);

    startTransition(async () => {
      const result = await updateRequestStatusAction(requestId, next);
      if (!result.ok) {
        setCurrent(previous);
        setError(result.message);
      }
    });
  }

  return (
    <div>
      <select
        value={current}
        onChange={handleChange}
        disabled={isPending}
        className={`cursor-pointer rounded-full border px-2.5 py-0.5 text-xs font-medium focus:outline-none disabled:opacity-60 ${STATUS_SELECT_STYLES[current]}`}
      >
        {(Object.keys(STATUS_LABEL_TH) as RequestStatus[]).map((value) => (
          <option key={value} value={value}>
            {STATUS_LABEL_TH[value]}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
