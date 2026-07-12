import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Public (unauthenticated) file endpoint: LINE's servers fetch attachment
// images from here when delivering messages to customers, so it cannot sit
// behind the staff session. Ids are cuids — effectively unguessable.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const attachment = await prisma.quoteAttachment.findUnique({ where: { id } });
  if (!attachment) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(Buffer.from(attachment.data), {
    headers: {
      "Content-Type": attachment.contentType,
      "Content-Disposition": `inline; filename="${encodeURIComponent(attachment.filename)}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
