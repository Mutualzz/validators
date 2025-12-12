import z from "zod";

// GET
export const validateInviteParamsGet = z.object({
    spaceId: z.string({ error: "Space ID is required" }),
});

export const validateInviteBodyPost = z.object({
    channelId: z.string(),
});
