import z from "zod";

// PUT
export const validateMessageParamsPut = z.object({
  channelId: z.string({ error: "Invalid Channel ID" }),
});

export const validateMessageParamsModify = z.object({
  channelId: z.string({ error: "Invalid Channel ID" }),
  messageId: z.string({ error: "Invalid Message ID" }),
});

export const validateMessageBodyPut = z.object({
  content: z
    .string()
    .max(2000, "Message cannot exceed 2000 characters")
    .trim()
    .optional(),
  nonce: z.string().optional(),
  repliedToId: z.string({ error: "Invalid replied to message ID" }).optional(),
  mentionReply: z.boolean().optional(),
  expressionIds: z
    .array(z.string({ error: "Invalid expression ID" }))
    .max(3, "You can only attach up to 3 stickers")
    .optional(),
});

export const validateMessageBodyPatch = z.object({
  content: z
    .string()
    .max(2000, "Message cannot exceed 2000 characters")
    .trim()
    .optional(),
});

export const validateMessageAckParams = z.object({
  channelId: z.string({ error: "Invalid Channel ID" }),
  messageId: z.string({ error: "Invalid Message ID" }),
});
