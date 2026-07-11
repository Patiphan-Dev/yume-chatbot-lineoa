import type { InsuranceRequest } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { CarInfoInput } from "../types/carInfo";
import { InsuranceType } from "../types/conversation";

export class InsuranceRequestNotFoundError extends Error {
  constructor(requestId: string) {
    super(`Insurance request ${requestId} not found`);
    this.name = "InsuranceRequestNotFoundError";
  }
}

export class RequestOwnershipMismatchError extends Error {
  constructor(requestId: string) {
    super(`Insurance request ${requestId} does not belong to the authenticated LINE user`);
    this.name = "RequestOwnershipMismatchError";
  }
}

export async function createInsuranceRequest(
  lineUserId: string,
  insuranceType: InsuranceType,
): Promise<InsuranceRequest> {
  return prisma.insuranceRequest.create({
    data: { lineUserId, insuranceType },
  });
}

/** Attaches car info from the LIFF form to a request created earlier via chat. */
export async function addCarInfo(
  requestId: string,
  lineUserId: string,
  carInfo: CarInfoInput,
): Promise<InsuranceRequest> {
  const existing = await prisma.insuranceRequest.findUnique({ where: { id: requestId } });
  if (!existing) throw new InsuranceRequestNotFoundError(requestId);
  if (existing.lineUserId !== lineUserId) throw new RequestOwnershipMismatchError(requestId);

  return prisma.insuranceRequest.update({
    where: { id: requestId },
    data: { ...carInfo, status: "IN_REVIEW" },
  });
}
