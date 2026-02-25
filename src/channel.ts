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
        .min(1, "Channel name must be at least 1 characters long")
        .max(100, "Channel name must be at least 100 characters long")
        .refine((val) => !emailRegex.test(val), {
            error: "Name cannot be an email",
        }),
    type: z.string().refine((val) => ["0", "1", "2", "3", "4"].includes(val), {
        error: "Invalid channel type provided",
    }),

    parentId: z.string().optional().nullable(),
    spaceId: z.string().optional().nullable(),
    ownerId: z.string().optional().nullable(),
    recipientIds: z.array(z.string()).optional().nullable(),

    crop: z
        .object({
            x: z.number().min(0, {
                error: "Crop x must be at least 0",
            }),
            y: z.number().min(0, {
                error: "Crop y must be at least 0",
            }),
            width: z.number().min(1, {
                error: "Crop width must be at least 1",
            }),
            height: z.number().min(1, {
                error: "Crop height must be at least 1",
            }),
        })
        .nullable()
        .optional(),
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

    position: z
        .number({ error: "Invalid channel position" })
        .int()
        .nonnegative()
        .optional(),

    spaceId: z.string().optional(),
});

export const validateChannelBulkBodyPatch = z.object({
    spaceId: z.string(),
    channels: z.array(
        validateChannelBodyUpdate.extend({
            id: z.string({ error: "Invalid Channel ID" }),
        }),
    ),
});

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
