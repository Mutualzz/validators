import z from "zod";
import { snowflake } from "./reusables/snowflake";
import { sanitizeDisplayText } from "./utils";

export const validateMembersGetAllParams = z.object({
    spaceId: snowflake("Invalid space ID"),
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
    spaceId: snowflake("Invalid space ID"),
    userId: snowflake("Invalid user ID"),
});

export const validateMembersAddParams = validateMembersGetAllParams;

export const validateMembersAddBody = z.object({
    channelId: snowflake("Channel ID is required"),
    code: z.string({ error: "Invitation code is required" }).trim(),
});

export const validateMembersRemoveMeParams = validateMembersAddParams;

export const validateMemberKickBody = z.object({});

export const validateMemberBanBody = z.object({
    reason: z
        .string({ error: "Invalid reason provided" })
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length <= 512, {
            message: "Ban reason must be at most 512 characters",
        }),
    // Timeframe in seconds for which the messages sent by the user will be deleted. -1 to delete all messages, 0 to not
    // delete any messages, or a positive integer up to 7 days (604800 seconds).
    deleteMessageTimeframe: z.number().min(-1).max(604800),
});

export const validateMemberVoiceModerationBody = z
    .object({
        spaceDeaf: z.boolean().optional(),
        spaceMute: z.boolean().optional(),
        disconnect: z.boolean().optional(),
        channelId: snowflake("Invalid channel ID").optional(),
    })
    .refine(
        (body) => !(body.disconnect && body.channelId),
        "Cannot disconnect and move a member at the same time",
    );
