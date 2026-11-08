import z from "zod";
import { zSnowflake } from "../reusables/snowflake";

export const MAX_NOTIFICATIONS_PER_USER = 200;
export const NOTIFICATION_PAGE_SIZE = 50;

const nonce = z.string().min(1).max(64);

export const gatewayNotificationListPayload = z.object({
  nonce,
  before: zSnowflake.optional(),
});

export const gatewayNotificationMarkReadPayload = z.union([
  z.object({ nonce, all: z.literal(true) }),
  z.object({ nonce, ids: z.array(zSnowflake).min(1).max(100) }),
]);

export const gatewayNotificationDeletePayload = z.object({
  nonce,
  id: zSnowflake,
});
