import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  STAFF_DASHBOARD_PASSWORD: z.string().min(1, "STAFF_DASHBOARD_PASSWORD is required"),
  SESSION_SECRET: z.string().min(16, "SESSION_SECRET must be at least 16 characters"),
  LINE_CHANNEL_ACCESS_TOKEN: z.string().min(1, "LINE_CHANNEL_ACCESS_TOKEN is required"),
  // Public base URL of this dashboard — LINE fetches attachment images from
  // /files/<id> here, so it must be the real deployed origin, not localhost.
  DASHBOARD_PUBLIC_URL: z.string().url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

export const env = parsed.data;
