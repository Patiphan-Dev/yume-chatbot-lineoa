import express, { Router } from "express";
import { submitInsuranceRequest } from "../controllers/liff.controller";

export const liffRouter = Router();

liffRouter.post("/insurance-requests/:requestId/submit", express.json(), submitInsuranceRequest);
