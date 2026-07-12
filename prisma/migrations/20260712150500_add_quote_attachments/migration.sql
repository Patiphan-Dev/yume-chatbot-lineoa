-- CreateTable
CREATE TABLE "quote_attachments" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quote_attachments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "quote_attachments" ADD CONSTRAINT "quote_attachments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "insurance_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
