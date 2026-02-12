import z from "zod";

// GET
export const validateInviteParamsGet = z.object({
    spaceId: z.string({ error: "Space ID is required" }),
});

export const validateInviteBodyPost = z.object({
    channelId: z.string(),
});

export const validateInviteParamsCode = z.object({
    spaceId: z.string(),
    code: z.string().min(1),
});

export const validateInviteBodyPatch = z.object({
    maxUses: z.number().int().min(0).max(1000).optional(),
    expiresAt: z
        .union([
            z
                .number()
                .int()
                .min(0)
                .max(60 * 60 * 24 * 30),
            z.null(),
        ])
        .optional(),
});
