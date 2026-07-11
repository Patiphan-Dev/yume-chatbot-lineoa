import { RequestStatus } from "@prisma/client";

const STATUS_STYLES: Record<RequestStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  IN_REVIEW: "bg-blue-100 text-blue-800",
  QUOTED: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-neutral-200 text-neutral-600",
};

const STATUS_LABEL_TH: Record<RequestStatus, string> = {
  PENDING: "รอดำเนินการ",
  IN_REVIEW: "กำลังตรวจสอบ",
  QUOTED: "เสนอราคาแล้ว",
  CLOSED: "ปิดงาน",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}>
      {STATUS_LABEL_TH[status]}
    </span>
  );
}
