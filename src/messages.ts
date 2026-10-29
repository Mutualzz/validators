import z from "zod";
import { zLimit } from "./reusables/pagination";
import { snowflake, zSnowflake } from "./reusables/snowflake";

// GET
export const messagesGetQuery = z.object({
  around: zSnowflake.optional(),
  before: zSnowflake.optional(),
  after: zSnowflake.optional(),
  limit: zLimit(50, 100),
});

// PUT
export const validateMessageParamsPut = z.object({
  channelId: snowflake("Invalid Channel ID"),
});

export const validateMessageParamsModify = z.object({
  channelId: snowflake("Invalid Channel ID"),
  messageId: snowflake("Invalid Message ID"),
});

export const validateMessageBodyPut = z.object({
  content: z
    .string()
    .max(2000, "Message cannot exceed 2000 characters")
    .trim()
    .optional(),
  nonce: z.string().optional(),
  repliedToId: snowflake("Invalid replied to message ID").optional(),
  mentionReply: z.boolean().optional(),
  expressionIds: z
    .array(snowflake("Invalid expression ID"))
    .max(3, "You can only attach up to 3 stickers")
    .optional(),
  sharedPostId: snowflake("Invalid Post ID").optional(),
  codedLinks: z
    .array(
      z.object({
        type: z.union([z.literal(0), z.literal(1)]),
        code: z.string().min(1).max(32),
      }),
    )
    .max(5)
    .optional(),
  attachmentSpoilers: z
    .preprocess(
      (val) => {
        if (val == null) return undefined;
        const arr = Array.isArray(val) ? val : [val];
        return arr.map((v) => v === true || v === "true");
      },
      z.array(z.boolean()).optional(),
    ),
});

export const validateMessageBodyPatch = z.object({
  content: z
    .string()
    .max(2000, "Message cannot exceed 2000 characters")
    .trim()
    .optional(),
});

export const validateMessageAckParams = z.object({
  channelId: snowflake("Invalid Channel ID"),
  messageId: snowflake("Invalid Message ID"),
});
