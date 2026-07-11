-- CreateEnum
CREATE TYPE "ConversationStep" AS ENUM ('MAIN_MENU', 'AWAITING_INSURANCE_TYPE', 'AWAITING_CAR_INFO', 'SUBMITTED');

-- CreateEnum
CREATE TYPE "Service" AS ENUM ('CHECK_PREMIUM', 'RENEW_PREMIUM', 'INQUIRY', 'OTHER');

-- CreateEnum
CREATE TYPE "InsuranceType" AS ENUM ('CAR_CLASS_1', 'CAR_CLASS_2_3', 'RENTAL_COMMERCIAL', 'LUXURY_SUPERCAR', 'EV', 'FIRE', 'CONSTRUCTION', 'OTHER');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'QUOTED', 'CLOSED');

-- CreateTable
CREATE TABLE "line_users" (
    "id" TEXT NOT NULL,
    "lineUserId" TEXT NOT NULL,
    "displayName" TEXT,
    "pictureUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "line_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_states" (
    "id" TEXT NOT NULL,
    "lineUserId" TEXT NOT NULL,
    "step" "ConversationStep" NOT NULL DEFAULT 'MAIN_MENU',
    "selectedService" "Service",
    "selectedInsuranceType" "InsuranceType",
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversation_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_requests" (
    "id" TEXT NOT NULL,
    "lineUserId" TEXT NOT NULL,
    "insuranceType" "InsuranceType" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "carRegistration" TEXT,
    "province" TEXT,
    "brand" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "quotedPremium" INTEGER,
    "quoteNote" TEXT,
    "quotedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurance_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "line_users_lineUserId_key" ON "line_users"("lineUserId");

-- CreateIndex
CREATE UNIQUE INDEX "conversation_states_lineUserId_key" ON "conversation_states"("lineUserId");

-- AddForeignKey
ALTER TABLE "conversation_states" ADD CONSTRAINT "conversation_states_lineUserId_fkey" FOREIGN KEY ("lineUserId") REFERENCES "line_users"("lineUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_requests" ADD CONSTRAINT "insurance_requests_lineUserId_fkey" FOREIGN KEY ("lineUserId") REFERENCES "line_users"("lineUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
