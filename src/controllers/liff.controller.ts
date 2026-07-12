import { Request, Response } from "express";
import { z } from "zod";
import { toCommonEraYear } from "../lib/thaiYear";
import { submitLiffInsuranceRequest } from "../services/liffSubmission.service";

const CURRENT_YEAR = new Date().getFullYear();

const submitBodySchema = z.object({
  idToken: z.string().min(1),
  carRegistration: z.string().min(1),
  province: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  // Accepts both ค.ศ. (2025) and พ.ศ. (2568); normalized to CE before the range check.
  year: z.coerce
    .number()
    .int()
    .transform(toCommonEraYear)
    .pipe(z.number().gte(1990).lte(CURRENT_YEAR + 1)),
  chassisNumber: z.string().min(1),
});

const STATUS_BY_REJECTION_REASON = {
  invalid_id_token: 401,
  not_found: 404,
  ownership_mismatch: 403,
} as const;

export async function submitInsuranceRequest(req: Request, res: Response): Promise<void> {
  const { requestId } = req.params;
  if (!requestId) {
    res.status(400).json({ error: "missing_request_id" });
    return;
  }

  const parsedBody = submitBodySchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: "invalid_request", details: parsedBody.error.flatten().fieldErrors });
    return;
  }

  const { idToken, ...carInfo } = parsedBody.data;

  const result = await submitLiffInsuranceRequest({ idToken, requestId, carInfo });

  if (!result.ok) {
    res.status(STATUS_BY_REJECTION_REASON[result.reason]).json({ error: result.reason });
    return;
  }

  res.status(200).json({ status: "ok" });
}
