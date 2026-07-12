import { prisma } from "../lib/prisma";
import { ConversationContext, InsuranceType, Service } from "../types/conversation";
import { ensureLineUser } from "./lineUser.service";

export async function getConversationContext(lineUserId: string): Promise<ConversationContext> {
  await ensureLineUser(lineUserId);

  const state = await prisma.conversationState.upsert({
    where: { lineUserId },
    update: {},
    create: { lineUserId, step: "MAIN_MENU" },
  });

  return {
    lineUserId,
    step: state.step,
    selectedService: state.selectedService,
    selectedInsuranceType: state.selectedInsuranceType,
  };
}

export async function setServiceSelected(lineUserId: string, service: Service): Promise<void> {
  const data = { step: "AWAITING_INSURANCE_TYPE" as const, selectedService: service };
  await prisma.conversationState.upsert({
    where: { lineUserId },
    update: data,
    create: { lineUserId, ...data },
  });
}

export async function setInsuranceTypeSelected(lineUserId: string, insuranceType: InsuranceType): Promise<void> {
  const data = { step: "AWAITING_CAR_INFO" as const, selectedInsuranceType: insuranceType };
  await prisma.conversationState.upsert({
    where: { lineUserId },
    update: data,
    create: { lineUserId, ...data },
  });
}

export async function resetToMainMenu(lineUserId: string): Promise<void> {
  const data = { step: "MAIN_MENU" as const, selectedService: null, selectedInsuranceType: null };
  await prisma.conversationState.upsert({
    where: { lineUserId },
    update: data,
    create: { lineUserId, ...data },
  });
}

export async function markSubmitted(lineUserId: string): Promise<void> {
  await prisma.conversationState.upsert({
    where: { lineUserId },
    update: { step: "SUBMITTED" },
    create: { lineUserId, step: "SUBMITTED" },
  });
}
