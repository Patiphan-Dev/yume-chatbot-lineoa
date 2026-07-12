import { Message } from "@line/bot-sdk";
import { QuoteAttachment } from "@prisma/client";
import { prisma } from "./db";
import { env } from "./env";

export const MAX_ATTACHMENTS = 4; // flex + 4 attachments = LINE's 5-messages-per-push cap
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export interface AttachmentValidationError {
  message: string;
}

export function validateAttachments(files: File[]): AttachmentValidationError | null {
  if (files.length > MAX_ATTACHMENTS) {
    return { message: `แนบไฟล์ได้สูงสุด ${MAX_ATTACHMENTS} ไฟล์` };
  }
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { message: `ไฟล์ ${file.name} ไม่รองรับ (รับเฉพาะ JPG, PNG, PDF)` };
    }
    if (file.size > MAX_FILE_BYTES) {
      return { message: `ไฟล์ ${file.name} ใหญ่เกิน 5MB` };
    }
  }
  return null;
}

export async function saveAttachments(requestId: string, files: File[]): Promise<QuoteAttachment[]> {
  const saved: QuoteAttachment[] = [];
  for (const file of files) {
    const data = Buffer.from(await file.arrayBuffer());
    saved.push(
      await prisma.quoteAttachment.create({
        data: { requestId, filename: file.name, contentType: file.type, data },
      }),
    );
  }
  return saved;
}

export function attachmentUrl(attachmentId: string): string {
  return `${env.DASHBOARD_PUBLIC_URL}/files/${attachmentId}`;
}

/** Images become native LINE image messages; PDFs become a tappable link message. */
export function buildAttachmentMessages(attachments: QuoteAttachment[]): Message[] {
  const messages: Message[] = [];
  const pdfs = attachments.filter((a) => a.contentType === "application/pdf");

  for (const image of attachments.filter((a) => a.contentType.startsWith("image/"))) {
    const url = attachmentUrl(image.id);
    messages.push({ type: "image", originalContentUrl: url, previewImageUrl: url });
  }

  if (pdfs.length > 0) {
    const lines = pdfs.map((pdf) => `📎 ${pdf.filename}\n${attachmentUrl(pdf.id)}`);
    messages.push({ type: "text", text: ["เอกสารแนบ:", ...lines].join("\n\n") });
  }

  return messages;
}
