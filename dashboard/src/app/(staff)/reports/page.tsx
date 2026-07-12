import { RequestStatus } from "@prisma/client";
import { STATUS_LABEL_TH, StatusBadge } from "@/components/StatusBadge";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const MONTHS_BACK = 6;

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return new Date(year!, month! - 1, 1).toLocaleDateString("th-TH", { month: "short", year: "numeric" });
}

export default async function ReportsPage() {
  await requireAdminSession();

  const since = new Date();
  since.setMonth(since.getMonth() - (MONTHS_BACK - 1));
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const [statusCounts, recentRequests, quotedByCounts] = await Promise.all([
    prisma.insuranceRequest.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.insuranceRequest.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
    }),
    prisma.insuranceRequest.groupBy({
      by: ["quotedBy"],
      where: { quotedBy: { not: null } },
      _count: { _all: true },
    }),
  ]);

  const byMonth = new Map<string, number>();
  for (const request of recentRequests) {
    const key = monthKey(request.createdAt);
    byMonth.set(key, (byMonth.get(key) ?? 0) + 1);
  }
  const monthKeys = [...byMonth.keys()].sort();

  const totalRequests = statusCounts.reduce((sum, row) => sum + row._count._all, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">รายงาน</h1>
        <a
          href="/reports/export"
          className="rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
        >
          ⬇ ดาวน์โหลด CSV ทั้งหมด
        </a>
      </div>

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          สรุปตามสถานะ (ทั้งหมด {totalRequests.toLocaleString("th-TH")} คำขอ)
        </h2>
        <div className="flex flex-wrap gap-6">
          {(Object.keys(STATUS_LABEL_TH) as RequestStatus[]).map((status) => {
            const count = statusCounts.find((row) => row.status === status)?._count._all ?? 0;
            return (
              <div key={status} className="min-w-28">
                <div className="text-2xl font-bold text-neutral-900">{count.toLocaleString("th-TH")}</div>
                <StatusBadge status={status} />
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          คำขอใหม่ย้อนหลัง {MONTHS_BACK} เดือน
        </h2>
        {monthKeys.length === 0 ? (
          <p className="text-sm text-neutral-400">ยังไม่มีข้อมูลในช่วงนี้</p>
        ) : (
          <table className="text-sm">
            <tbody>
              {monthKeys.map((key) => (
                <tr key={key}>
                  <td className="pr-6 py-1 text-neutral-500">{monthLabel(key)}</td>
                  <td className="py-1 font-semibold text-neutral-900">
                    {byMonth.get(key)!.toLocaleString("th-TH")} คำขอ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          จำนวนใบเสนอราคาต่อทีมงาน
        </h2>
        {quotedByCounts.length === 0 ? (
          <p className="text-sm text-neutral-400">ยังไม่มีการเสนอราคา</p>
        ) : (
          <table className="text-sm">
            <tbody>
              {[...quotedByCounts]
                .sort((a, b) => b._count._all - a._count._all)
                .map((row) => (
                  <tr key={row.quotedBy}>
                    <td className="pr-6 py-1 text-neutral-700">{row.quotedBy}</td>
                    <td className="py-1 font-semibold text-neutral-900">
                      {row._count._all.toLocaleString("th-TH")} ใบ
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
