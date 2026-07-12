"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const NAV_ITEMS: { href: string; status: string; label: string; icon: string }[] = [
  { href: "/?status=ALL", status: "ALL", label: "คำขอทั้งหมด", icon: "📋" },
  { href: "/?status=PENDING", status: "PENDING", label: "รอดำเนินการ", icon: "🕐" },
  { href: "/?status=IN_REVIEW", status: "IN_REVIEW", label: "กำลังตรวจสอบ", icon: "🔍" },
  { href: "/?status=QUOTED", status: "QUOTED", label: "เสนอราคาแล้ว", icon: "💰" },
  { href: "/?status=CLOSED", status: "CLOSED", label: "ปิดงาน", icon: "✅" },
];

function SidebarNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeStatus = pathname === "/" ? (searchParams.get("status") ?? "ALL") : null;

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = activeStatus === item.status;
        return (
          <Link
            key={item.status}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-amber-50 text-amber-800"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarNav() {
  // useSearchParams requires a Suspense boundary during prerendering.
  return (
    <Suspense fallback={null}>
      <SidebarNavInner />
    </Suspense>
  );
}
