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

export const validateMembersGetOneParams = z.object({
    spaceId: z.string({ error: "Invalid space ID" }),
    memberId: z.string({ error: "Invalid member ID" }).optional(),
});

export const validateMembersAddParams = validateMembersGetAllParams;

export const validateMembersAddBody = z.object({
    channelId: z.string({ error: "Channel ID is required" }).trim(),
    code: z.string({ error: "Invitation code is required" }).trim(),
});

export const validateMembersRemoveMeParams = validateMembersAddParams;
