import z from "zod";
import { snowflake } from "./reusables/snowflake";

// GET
export const validateInviteParamsGet = z.object({
    spaceId: snowflake("Space ID is required"),
});

export const validateInviteBodyPost = z.object({
    channelId: snowflake(),
});

export const validateInviteParamsCode = z.object({
    spaceId: snowflake(),
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

export const validateInviteCodeParam = z.object({
    code: z.string().min(1),
});
