import Link from "next/link";
import { RequestStatus } from "@prisma/client";
import { StatusSelect } from "@/components/StatusSelect";
import { prisma } from "@/lib/db";
import { INSURANCE_TYPE_LABEL_TH } from "@/lib/insuranceType";

const STATUS_TABS: { value: RequestStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "ทั้งหมด" },
  { value: "PENDING", label: "รอดำเนินการ" },
  { value: "IN_REVIEW", label: "กำลังตรวจสอบ" },
  { value: "QUOTED", label: "เสนอราคาแล้ว" },
  { value: "CLOSED", label: "ปิดงาน" },
  { value: "CANCELLED", label: "ยกเลิก" },
];

const PAGE_SIZE = 20;

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
  const page = Math.max(1, Number.parseInt(firstValue(resolvedSearchParams.page) ?? "1", 10) || 1);

  const where = {
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
  };

  const [requests, totalCount] = await Promise.all([
    prisma.insuranceRequest.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.insuranceRequest.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const pageHref = (target: number) => ({
    pathname: "/",
    query: { status: statusFilter, q: query || undefined, page: target },
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
              <th className="px-4 py-3"></th>
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
                  <StatusSelect requestId={request.id} status={request.status} />
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {request.createdAt.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/requests/${request.id}`}
                    className="inline-block rounded-md bg-amber-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-800"
                  >
                    เปิดดู / เสนอราคา
                  </Link>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  ไม่พบคำขอที่ตรงกับเงื่อนไข
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span>
            หน้า {page} จาก {totalPages} · ทั้งหมด {totalCount.toLocaleString("th-TH")} รายการ
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={pageHref(page - 1)} className="rounded-md border border-neutral-300 px-3 py-1.5 hover:bg-neutral-100">
                ← ก่อนหน้า
              </Link>
            )}
            {page < totalPages && (
              <Link href={pageHref(page + 1)} className="rounded-md border border-neutral-300 px-3 py-1.5 hover:bg-neutral-100">
                ถัดไป →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
