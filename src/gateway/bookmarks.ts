import z from "zod";
import { zSnowflake } from "../reusables/snowflake";

export const MAX_BOOKMARKS = 25;

export const gatewayBookmarkPayload = z.object({
  nonce: z.string().min(1).max(64),
  messageId: zSnowflake,
});
