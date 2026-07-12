import { prisma } from "./db";
import { SessionPayload } from "./session";

export const ACTIVITY_ACTIONS = {
  LOGIN: "เข้าสู่ระบบ",
  LOGIN_FAILED: "เข้าสู่ระบบไม่สำเร็จ",
  QUOTE_SENT: "ส่งใบเสนอราคาให้ลูกค้า",
  STATUS_CHANGED: "เปลี่ยนสถานะคำขอ",
  STAFF_CREATED: "เพิ่มสมาชิกทีมงาน",
  STAFF_SUSPENDED: "ระงับสมาชิกทีมงาน",
  STAFF_REACTIVATED: "เปิดใช้งานสมาชิกทีมงาน",
  STAFF_PASSWORD_RESET: "เปลี่ยนรหัสผ่านสมาชิก",
} as const;

export type ActivityAction = keyof typeof ACTIVITY_ACTIONS;

interface LogActivityInput {
  actor: Pick<SessionPayload, "name" | "role">;
  action: ActivityAction;
  requestId?: string;
  detail?: string;
}

/** Audit logging must never break the action it records — failures go to console only. */
export async function logActivity({ actor, action, requestId, detail }: LogActivityInput): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        actorName: actor.name,
        actorRole: actor.role,
        action,
        requestId: requestId ?? null,
        detail: detail ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to write activity log", { action, error });
  }
}
