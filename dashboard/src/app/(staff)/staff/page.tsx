import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatStaffCode } from "@/lib/staffCode";
import { AddStaffForm, StaffRowActions } from "./StaffManager";

export default async function StaffManagementPage() {
  await requireAdminSession();

  const staffMembers = await prisma.staffMember.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-neutral-900">จัดการทีมงาน</h1>

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">เพิ่มสมาชิกใหม่</h2>
        <AddStaffForm />
      </section>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-4 py-3">รหัสสมาชิก</th>
              <th className="px-4 py-3">ชื่อ</th>
              <th className="px-4 py-3">ชื่อผู้ใช้</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3">เพิ่มเมื่อ</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((staff) => (
              <tr key={staff.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-amber-800">
                  {formatStaffCode(staff.codeNumber)}
                </td>
                <td className="px-4 py-3 font-medium text-neutral-900">{staff.name}</td>
                <td className="px-4 py-3 text-neutral-600">{staff.username}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      staff.active ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {staff.active ? "ใช้งานอยู่" : "ระงับแล้ว"}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {staff.createdAt.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <StaffRowActions
                    staff={{
                      id: staff.id,
                      name: staff.name,
                      username: staff.username,
                      active: staff.active,
                      createdAt: staff.createdAt.toISOString(),
                    }}
                  />
                </td>
              </tr>
            ))}
            {staffMembers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  ยังไม่มีสมาชิก — เพิ่มสมาชิกคนแรกได้จากฟอร์มด้านบน
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-neutral-400">
        สมาชิกที่ถูกระงับจะเข้าสู่ระบบไม่ได้ทันที · บัญชี admin หลักตั้งค่าผ่านระบบหลังบ้าน ไม่แสดงในรายการนี้
      </p>
    </div>
  );
}
