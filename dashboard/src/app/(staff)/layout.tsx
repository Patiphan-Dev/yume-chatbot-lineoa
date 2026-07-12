import type { ReactNode } from "react";
import { SidebarNav } from "@/components/Sidebar";
import { requireStaffSession } from "@/lib/auth";
import { logoutAction } from "./actions";

export default async function StaffLayout({ children }: { children: ReactNode }) {
  const session = await requireStaffSession();

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <div className="flex items-center gap-2.5 border-b border-neutral-200 px-5 py-5">
          <img src="/logo.png" alt="YUME Insurance" className="h-9 w-9 rounded-full" />
          <div className="leading-tight">
            <div className="text-sm font-bold text-neutral-900">YUME Insurance</div>
            <div className="text-xs text-neutral-500">Staff Dashboard</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <SidebarNav isAdmin={session.role === "admin"} />
        </div>

        <div className="border-t border-neutral-200 p-3">
          <div className="px-3 pb-2 text-xs text-neutral-400">
            เข้าสู่ระบบเป็น <span className="font-medium text-neutral-600">{session.name}</span>
          </div>
          <form action={logoutAction}>
            <button
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
              type="submit"
            >
              ⎋ ออกจากระบบ
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
