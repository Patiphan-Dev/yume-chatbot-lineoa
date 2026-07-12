import Link from "next/link";
import { ACTIVITY_ACTIONS, ActivityAction } from "@/lib/activityLog";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const PAGE_SIZE = 100;

function actionLabel(action: string): string {
  return ACTIVITY_ACTIONS[action as ActivityAction] ?? action;
}

export default async function ActivityLogPage() {
  await requireAdminSession();

  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">บันทึกกิจกรรม</h1>
        <p className="mt-1 text-sm text-neutral-500">แสดง {PAGE_SIZE} รายการล่าสุด</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-4 py-3">เวลา</th>
              <th className="px-4 py-3">ผู้ทำรายการ</th>
              <th className="px-4 py-3">การกระทำ</th>
              <th className="px-4 py-3">รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-neutral-100 last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                  {log.createdAt.toLocaleString("th-TH", { dateStyle: "short", timeStyle: "medium" })}
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-neutral-900">{log.actorName}</span>
                  <span className="ml-1.5 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                    {log.actorRole === "admin" ? "แอดมิน" : "ทีมงาน"}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-700">{actionLabel(log.action)}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {log.detail ?? "-"}
                  {log.requestId && (
                    <Link href={`/requests/${log.requestId}`} className="ml-2 text-amber-800 hover:underline">
                      เปิดคำขอ →
                    </Link>
                  )}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-400">
                  ยังไม่มีบันทึกกิจกรรม
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
