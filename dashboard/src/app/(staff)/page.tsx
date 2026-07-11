import Link from "next/link";
import { RequestStatus } from "@prisma/client";
import { StatusBadge } from "@/components/StatusBadge";
import { prisma } from "@/lib/db";
import { INSURANCE_TYPE_LABEL_TH } from "@/lib/insuranceType";

const STATUS_TABS: { value: RequestStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "ทั้งหมด" },
  { value: "PENDING", label: "รอดำเนินการ" },
  { value: "IN_REVIEW", label: "กำลังตรวจสอบ" },
  { value: "QUOTED", label: "เสนอราคาแล้ว" },
  { value: "CLOSED", label: "ปิดงาน" },
];

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseStatusFilter(value: string | string[] | undefined): RequestStatus | "ALL" {
  const candidate = firstValue(value);
  if (candidate && (Object.values(RequestStatus) as string[]).includes(candidate)) {
    return candidate as RequestStatus;
  }
  return "ALL";
}

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const statusFilter = parseStatusFilter(resolvedSearchParams.status);
  const query = firstValue(resolvedSearchParams.q)?.trim() ?? "";

  const requests = await prisma.insuranceRequest.findMany({
    where: {
      ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
      ...(query
        ? {
            OR: [
              { carRegistration: { contains: query, mode: "insensitive" as const } },
              { brand: { contains: query, mode: "insensitive" as const } },
              { model: { contains: query, mode: "insensitive" as const } },
              { user: { displayName: { contains: query, mode: "insensitive" as const } } },
            ],
          }
        : {}),
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-neutral-900">คำขอเช็คเบี้ยประกัน</h1>
        <form className="flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="ค้นหาทะเบียน ยี่ห้อ รุ่น หรือชื่อลูกค้า"
            className="w-72 rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-amber-700 focus:outline-none"
          />
          <input type="hidden" name="status" value={statusFilter} />
          <button
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100"
            type="submit"
          >
            ค้นหา
          </button>
        </form>
      </div>

      <nav className="flex gap-1 border-b border-neutral-200">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={{ pathname: "/", query: { status: tab.value, q: query || undefined } }}
            className={`px-3 py-2 text-sm font-medium ${
              statusFilter === tab.value
                ? "border-b-2 border-amber-700 text-amber-800"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-4 py-3">ลูกค้า</th>
              <th className="px-4 py-3">ประเภทประกัน</th>
              <th className="px-4 py-3">ทะเบียนรถ</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3">วันที่แจ้ง</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <Link href={`/requests/${request.id}`} className="font-medium text-neutral-900 hover:underline">
                    {request.user.displayName ?? request.lineUserId}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-600">{INSURANCE_TYPE_LABEL_TH[request.insuranceType]}</td>
                <td className="px-4 py-3 text-neutral-600">{request.carRegistration ?? "-"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={request.status} />
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {request.createdAt.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                  ไม่พบคำขอที่ตรงกับเงื่อนไข
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
