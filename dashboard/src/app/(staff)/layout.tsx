import type { ReactNode } from "react";
import { requireStaffSession } from "@/lib/auth";
import { logoutAction } from "./actions";

export default async function StaffLayout({ children }: { children: ReactNode }) {
  await requireStaffSession();

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="YUME Insurance" className="h-8 w-8 rounded-full" />
            <span className="text-lg font-bold text-neutral-900">YUME Insurance · Staff</span>
          </div>
          <form action={logoutAction}>
            <button className="text-sm text-neutral-500 hover:text-neutral-800" type="submit">
              ออกจากระบบ
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
