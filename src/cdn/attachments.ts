import z from "zod";

export const attachmentsGetParams = z.object({
  messageId: z.string({ error: "Invalid message ID" }),
  filename: z.string({ error: "Invalid filename" }),
});
