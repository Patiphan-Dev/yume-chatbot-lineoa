import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { STATUS_LABEL_TH } from "@/components/StatusBadge";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { INSURANCE_TYPE_LABEL_TH } from "@/lib/insuranceType";
import { readSessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

function csvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

// Route handlers sit outside the (staff) layout guard, so re-check the session
// here; admin-only since the export contains every customer's details.
export async function GET() {
  const cookieStore = await cookies();
  const session = readSessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value, env.SESSION_SECRET);
  if (!session || session.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const requests = await prisma.insuranceRequest.findMany({
    include: { user: { select: { displayName: true } } },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "เลขที่คำขอ",
    "ลูกค้า",
    "ประเภทประกัน",
    "สถานะ",
    "ทะเบียนรถ",
    "จังหวัด",
    "ยี่ห้อ",
    "รุ่น",
    "ปีรถ",
    "เลขตัวถัง",
    "เบี้ยที่เสนอ",
    "เสนอราคาโดย",
    "วันที่เสนอราคา",
    "วันที่แจ้ง",
  ];

  const rows = requests.map((request) =>
    [
      request.id,
      request.user.displayName ?? request.lineUserId,
      INSURANCE_TYPE_LABEL_TH[request.insuranceType],
      STATUS_LABEL_TH[request.status],
      request.carRegistration,
      request.province,
      request.brand,
      request.model,
      request.year,
      request.chassisNumber,
      request.quotedPremium,
      request.quotedBy,
      request.quotedAt?.toLocaleString("th-TH"),
      request.createdAt.toLocaleString("th-TH"),
    ]
      .map(csvCell)
      .join(","),
  );

  // BOM so Excel opens Thai text as UTF-8 instead of mojibake.
  const csv = "﻿" + [header.map(csvCell).join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="yume-insurance-requests.csv"`,
    },
  });
}
