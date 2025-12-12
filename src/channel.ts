import z from "zod";
import { emailRegex } from "./regexes";

// GET
export const validateChannelParamsGet = z.object({
    channelId: z.string({ error: "Channel ID is required" }),
});

// POST
export const validateChannelBodyCreate = z.object({
    name: z
        .string({ error: "Channel name is required" })
        .min(1, "Channel name must be atleast 1 characters long")
        .max(100, "Channel name must be atleast 100 characters long")
        .refine((val) => !emailRegex.test(val), {
            error: "Name cannot be an email",
        }),
    type: z
        .int({ error: "Channel type is required" })
        .min(0, "Invalid channel type provided")
        .max(4, "Invalid channel type provided"),

    parentId: z.string().optional(),
    spaceId: z.string().optional(),
});

// PATCH
export const validateChannelParamsUpdate = z.object({
    channelId: z.string({ error: "Channel ID is required" }),
});

export const validateChannelBodyUpdate = z.object({
    name: z
        .string()
        .min(1, "Channel name must be atleast 1 characters long")
        .max(100, "Channel name must be atleast 100 characters long")
        .refine((val) => !emailRegex.test(val), {
            error: "Name cannot be an email",
        })
        .optional(),

    topic: z
        .string()
        .max(250, "Topic cannot be longer than 250 characters")
        .refine((val) => !emailRegex.test(val), {
            error: "Topic cannot contain an email",
        })
        .nullable()
        .optional(),

    parentId: z.string().nullable().optional(),

    nsfw: z.boolean().optional(),

    position: z.number().int().min(0).optional(),

    spaceId: z.string().optional(),
});

export const validateChannelBulkBodyPatch = z.array(
    validateChannelBodyUpdate.extend({
        id: z.string({ error: "Invalid Channel ID" }),
    }),
);

// DELETE
export const validateChannelParamsDelete = z.object({
    channelId: z.string({ error: "Invalid Channel ID" }),
});

export const validateChannelQueryDelete = z.object({
    parentOnly: z
        .string()
        .refine((val) => val === "true" || val === "false")
        .transform((val) => val === "true")
        .optional(),
    spaceId: z.string().optional(),
});
