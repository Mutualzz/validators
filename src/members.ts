import z from "zod";

export const validateMembersGetAllParams = z.object({
    spaceId: z.string({ error: "Invalid space ID" }).trim(),
});

export const validateMembersGetAllQuery = z.object({
    limit: z
        .number({ error: "Invalid limit" })
        .min(10, {
            error: "You can request minimum of 10",
        })
        .max(100, {
            error: "You can request maximum of 100",
        })
        .default(50),
});

export const validateMembersActionParams = z.object({
    spaceId: z.string({ error: "Invalid space ID" }),
    memberId: z.string({ error: "Invalid member ID" }).optional(),
});

export const validateMembersAddParams = validateMembersGetAllParams;

export const validateMembersAddBody = z.object({
    channelId: z.string({ error: "Channel ID is required" }).trim(),
    code: z.string({ error: "Invitation code is required" }).trim(),
});

export const validateMembersRemoveMeParams = validateMembersAddParams;

export const validateMemberKickBody = z.object({});

export const validateMemberBanBody = z.object({
    reason: z.string({ error: "Invalid reason provided" }).trim().optional(),
    // Timeframe in seconds for which the messages sent by the user will be deleted. -1 to delete all messages, 0 to not delete any messages, or a positive integer up to 7 days (604800 seconds).
    deleteMessageTimeframe: z.number().min(-1).max(604800),
});
