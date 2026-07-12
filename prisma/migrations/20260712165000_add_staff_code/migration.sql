-- AlterTable: SERIAL backfills existing rows in creation order automatically
ALTER TABLE "staff_members" ADD COLUMN "codeNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "staff_members_codeNumber_key" ON "staff_members"("codeNumber");
