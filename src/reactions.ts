import z from "zod";

export const validateReactionEmojiBody = z.object({
  emoji: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("unicode"),
      value: z.string().min(1).max(32),
    }),
    z.object({
      type: z.literal("expression"),
      id: z.string({ error: "Invalid expression ID" }),
    }),
  ]),
});

export const validateReactionParams = z.object({
  channelId: z.string({ error: "Invalid Channel ID" }),
  messageId: z.string({ error: "Invalid Message ID" }),
});

export const validateReactionUserParams = validateReactionParams.extend({
  userId: z.string({ error: "Invalid User ID" }),
});

export const validateReactionUsersQuery = z.object({
  type: z.enum(["unicode", "expression"]),
  value: z.string().optional(),
  id: z.string().optional(),
  after: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});
