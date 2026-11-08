import z from "zod";
import { zSnowflake } from "../reusables/snowflake";
import { isWithinScheduleWindow } from "./reminders";

export const MAX_SCHEDULED_MESSAGES = 25;

const nonce = z.string().min(1).max(64);

export const scheduledForSchema = z.iso
  .datetime({ offset: true })
  .refine(isWithinScheduleWindow, "Pick a time within the next year");

export const gatewayScheduledMessageEditPayload = z
  .object({
    nonce,
    id: zSnowflake,
    content: z
      .string()
      .max(2000, "Message cannot exceed 2000 characters")
      .trim()
      .optional(),
    scheduledFor: scheduledForSchema.optional(),
  })
  .refine(
    (payload) =>
      payload.content !== undefined || payload.scheduledFor !== undefined,
    "Nothing to change",
  );

export const gatewayScheduledMessageDeletePayload = z.object({
  nonce,
  id: zSnowflake,
});
