import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  LINE_CHANNEL_ACCESS_TOKEN: z.string().min(1, "LINE_CHANNEL_ACCESS_TOKEN is required"),
  LINE_CHANNEL_SECRET: z.string().min(1, "LINE_CHANNEL_SECRET is required"),
  LINE_STAFF_GROUP_ID: z.string().min(1, "LINE_STAFF_GROUP_ID is required"),
  LIFF_APP_URL: z.string().url(),
  // Origin the LIFF form is served from (e.g. https://your-liff-app.vercel.app) — CORS-allowed
  // for /api/liff since the form runs on its own domain, separate from this backend.
  LIFF_APP_ORIGIN: z.string().url(),
  // Channel ID the LIFF app is registered under — usually the same Messaging API channel,
  // unless car-info form uses a separate LINE Login channel. Required by the id_token verify call.
  LINE_LOGIN_CHANNEL_ID: z.string().min(1, "LINE_LOGIN_CHANNEL_ID is required"),
  // Set after running `npm run richmenu:setup` once. Optional: setDefaultRichMenu (run by that
  // script) already covers new followers; this only enables the extra explicit link-on-follow call.
  LINE_RICH_MENU_ID: z.string().min(1).optional(),
  // Pooled (pgbouncer transaction-mode) connection used by the app at runtime.
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  // Non-pooled connection Prisma Migrate uses for schema changes — pgbouncer transaction mode
  // can't run migrations reliably.
  DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
