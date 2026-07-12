"use server";

import { RequestStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { logActivity } from "@/lib/activityLog";
import { requireStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { STATUS_LABEL_TH } from "@/components/StatusBadge";

export type UpdateStatusResult = { ok: true } | { ok: false; message: string };

const VALID_STATUSES = Object.values(RequestStatus);

export async function updateRequestStatusAction(
  requestId: string,
  status: RequestStatus,
): Promise<UpdateStatusResult> {
  const session = await requireStaffSession();

  if (!VALID_STATUSES.includes(status)) {
    return { ok: false, message: "สถานะไม่ถูกต้อง" };
  }

  const existing = await prisma.insuranceRequest.findUnique({ where: { id: requestId } });
  if (!existing) {
    return { ok: false, message: "ไม่พบคำขอนี้" };
  }
  if (existing.status === status) {
    return { ok: true };
  }

  await prisma.insuranceRequest.update({ where: { id: requestId }, data: { status } });

  await logActivity({
    actor: session,
    action: "STATUS_CHANGED",
    requestId,
    detail: `${STATUS_LABEL_TH[existing.status]} → ${STATUS_LABEL_TH[status]}`,
  });

  revalidatePath("/");
  revalidatePath(`/requests/${requestId}`);

  return { ok: true };
}
