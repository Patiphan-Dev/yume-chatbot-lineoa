"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps {
  isAdmin: boolean;
}

interface NavItem {
  href: string;
  label: string;
  icon: string;
  isActive: (pathname: string) => boolean;
}

const REQUEST_ITEM: NavItem = {
  href: "/",
  label: "คำขอเช็คเบี้ย",
  icon: "📋",
  isActive: (pathname) => pathname === "/" || pathname.startsWith("/requests"),
};

const STAFF_ITEM: NavItem = {
  href: "/staff",
  label: "จัดการทีมงาน",
  icon: "👥",
  isActive: (pathname) => pathname.startsWith("/staff"),
};

const ACTIVITY_ITEM: NavItem = {
  href: "/activity",
  label: "บันทึกกิจกรรม",
  icon: "📜",
  isActive: (pathname) => pathname.startsWith("/activity"),
};

export function SidebarNav({ isAdmin }: SidebarNavProps) {
  const pathname = usePathname();
  const items = isAdmin ? [REQUEST_ITEM, STAFF_ITEM, ACTIVITY_ITEM] : [REQUEST_ITEM];

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.isActive(pathname);
        return (
          <Link
            key={item.href}
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
