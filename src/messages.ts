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
        .max(2000, "Message content cannot exceed 2000 characters")
        .trim()
        .optional(),
    nonce: z.string().optional(),
});

export const validateMessageAckParams = z.object({
    channelId: z.string({ error: "Invalid Channel ID" }),
    messageId: z.string({ error: "Invalid Message ID" }),
});
