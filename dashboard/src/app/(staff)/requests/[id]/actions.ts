"use server";

import { Message } from "@line/bot-sdk";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { buildAttachmentMessages, saveAttachments, validateAttachments } from "@/lib/attachments";
import { prisma } from "@/lib/db";
import { INSURANCE_TYPE_LABEL_TH } from "@/lib/insuranceType";
import { pushLineMessage } from "@/lib/line";
import { buildQuoteResultFlex } from "@/lib/quoteResult.flex";

const quoteSchema = z.object({
  premium: z.coerce.number().int().positive("กรุณากรอกเบี้ยประกันเป็นจำนวนเต็มบวก"),
  note: z.string().optional(),
});

export type SubmitQuoteResult = { ok: true } | { ok: false; message: string };

function extractFiles(formData: FormData): File[] {
  return formData
    .getAll("attachments")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

export async function submitQuoteAction(requestId: string, formData: FormData): Promise<SubmitQuoteResult> {
  const parsed = quoteSchema.safeParse({
    premium: formData.get("premium"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" };
  }

  const files = extractFiles(formData);
  const attachmentError = validateAttachments(files);
  if (attachmentError) {
    return { ok: false, message: attachmentError.message };
  }

  const existing = await prisma.insuranceRequest.findUnique({ where: { id: requestId } });
  if (!existing) {
    return { ok: false, message: "ไม่พบคำขอนี้" };
  }

  const attachments = await saveAttachments(requestId, files);

  const updated = await prisma.insuranceRequest.update({
    where: { id: requestId },
    data: {
      status: "QUOTED",
      quotedPremium: parsed.data.premium,
      quoteNote: parsed.data.note ?? null,
      quotedAt: new Date(),
    },
  });

  const messages: Message[] = [
    buildQuoteResultFlex(
      INSURANCE_TYPE_LABEL_TH[updated.insuranceType],
      updated.quotedPremium ?? parsed.data.premium,
      updated.quoteNote,
    ),
    ...buildAttachmentMessages(attachments),
  ];

  try {
    await pushLineMessage(updated.lineUserId, messages);
  } catch (error) {
    console.error("Failed to push quote result to customer", error);
    return { ok: false, message: "บันทึกราคาสำเร็จ แต่ส่งข้อความหาลูกค้าไม่สำเร็จ กรุณาลองส่งอีกครั้ง" };
  }

  revalidatePath(`/requests/${requestId}`);
  revalidatePath("/");

  return { ok: true };
}
