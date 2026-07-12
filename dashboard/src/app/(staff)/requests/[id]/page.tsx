import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { prisma } from "@/lib/db";
import { INSURANCE_TYPE_LABEL_TH } from "@/lib/insuranceType";
import { QuoteForm } from "./QuoteForm";

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await prisma.insuranceRequest.findUnique({
    where: { id },
    include: {
      user: true,
      attachments: { select: { id: true, filename: true, contentType: true, createdAt: true } },
    },
  });

  if (!request) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">คำขอ #{request.id}</h1>
        <StatusBadge status={request.status} />
      </div>

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">ข้อมูลลูกค้าและรถ</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <Field label="ลูกค้า" value={request.user.displayName ?? request.lineUserId} />
          <Field label="ประเภทประกัน" value={INSURANCE_TYPE_LABEL_TH[request.insuranceType]} />
          <Field label="ทะเบียนรถ" value={request.carRegistration ?? "-"} />
          <Field label="จังหวัด" value={request.province ?? "-"} />
          <Field label="ยี่ห้อ/รุ่น" value={`${request.brand ?? "-"} ${request.model ?? ""}`.trim()} />
          <Field label="ปีรถ" value={request.year?.toString() ?? "-"} />
          <Field label="เลขตัวถัง" value={request.chassisNumber ?? "-"} />
          <Field label="เวลาที่รับข้อมูล" value={request.updatedAt.toLocaleString("th-TH")} />
        </dl>
      </section>

      {request.attachments.length > 0 && (
        <section className="rounded-lg border border-neutral-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            เอกสารที่เคยส่งให้ลูกค้า
          </h2>
          <ul className="space-y-1 text-sm">
            {request.attachments.map((attachment) => (
              <li key={attachment.id}>
                <a
                  href={`/files/${attachment.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-800 hover:underline"
                >
                  {attachment.contentType.startsWith("image/") ? "🖼️" : "📎"} {attachment.filename}
                </a>
                <span className="ml-2 text-xs text-neutral-400">
                  {attachment.createdAt.toLocaleString("th-TH")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">เสนอราคาเบี้ยประกัน</h2>
        <QuoteForm requestId={request.id} existingPremium={request.quotedPremium} existingNote={request.quoteNote} />
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-neutral-400">{label}</dt>
      <dd className="font-medium text-neutral-900">{value}</dd>
    </div>
  );
}
