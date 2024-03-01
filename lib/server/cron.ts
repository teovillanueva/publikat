import { headers } from "next/headers";

export function isValidCronExecution() {
  const authHeader = headers().get("authorization");

  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}
