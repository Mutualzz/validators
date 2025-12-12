import z from "zod";

// PUT
export const validateMessageParamsPut = z.object({
    channelId: z.string({ error: "Invalid Channel ID" }),
});

export const validateMessageParamsPatch = z.object({
    channelId: z.string({ error: "Invalid Channel ID" }),
    messageId: z.string({ error: "Invalid Message ID" }),
});

export const validateMessageBodyPut = z.object({
    content: z
        .string()
        .min(1, "Message content must be at least 1 character long")
        .max(2000, "Message content cannot exceed 2000 characters")
        .trim(),
    nonce: z.string().optional(),
});
