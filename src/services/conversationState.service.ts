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
  await prisma.conversationState.update({
    where: { lineUserId },
    data: { step: "AWAITING_INSURANCE_TYPE", selectedService: service },
  });
}

export async function setInsuranceTypeSelected(lineUserId: string, insuranceType: InsuranceType): Promise<void> {
  await prisma.conversationState.update({
    where: { lineUserId },
    data: { step: "AWAITING_CAR_INFO", selectedInsuranceType: insuranceType },
  });
}

export async function resetToMainMenu(lineUserId: string): Promise<void> {
  await prisma.conversationState.update({
    where: { lineUserId },
    data: { step: "MAIN_MENU", selectedService: null, selectedInsuranceType: null },
  });
}

export async function markSubmitted(lineUserId: string): Promise<void> {
  await prisma.conversationState.update({
    where: { lineUserId },
    data: { step: "SUBMITTED" },
  });
}
