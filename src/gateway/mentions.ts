import z from "zod";
import { zSnowflake } from "../reusables/snowflake";

export const MENTIONS_PAGE_SIZE = 25;

const nonce = z.string().min(1).max(64);

export const gatewayMentionListPayload = z.object({
  nonce,
  before: zSnowflake.optional(),
  includeEveryone: z.boolean(),
  includeRoles: z.boolean(),
  spaceId: zSnowflake.optional(),
});

export const gatewayMentionDismissPayload = z.object({
  nonce,
  messageId: zSnowflake,
});
