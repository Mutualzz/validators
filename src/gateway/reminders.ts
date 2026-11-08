import z from "zod";
import { zSnowflake } from "../reusables/snowflake";

export const MAX_REMINDERS = 25;
export const MAX_REMINDER_AHEAD_MS = 365 * 24 * 60 * 60 * 1000;
const SCHEDULE_PAST_GRACE_MS = 60_000;

export const isWithinScheduleWindow = (value: string) => {
  const delayMs = new Date(value).getTime() - Date.now();
  return delayMs > -SCHEDULE_PAST_GRACE_MS && delayMs <= MAX_REMINDER_AHEAD_MS;
};

const nonce = z.string().min(1).max(64);

export const gatewayReminderSetPayload = z.object({
  nonce,
  messageId: zSnowflake,
  remindAt: z.iso.datetime({ offset: true }).refine(isWithinScheduleWindow),
});

export const gatewayReminderDeletePayload = z.object({
  nonce,
  messageId: zSnowflake,
});
