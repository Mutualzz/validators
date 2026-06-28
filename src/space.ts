import z from "zod";
import { emailRegex } from "./regexes";
import { sanitizeDisplayText } from "./utils";

export const validateSpaceCreate = z.object({
    name: z
        .string()
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length >= 2, {
            message: "Space name must be at least 2 characters long",
        })
        .refine((val) => val.length <= 100, {
            message: "Space name must be at most 100 characters long",
        })
        .refine((val) => !emailRegex.test(val), {
            error: "Name cannot be an email",
        }),

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

export const validateSpaceDeleteParams = z.object({
    spaceId: z.string({ error: "Invalid space ID" }).trim(),
});

export const validateSpaceGetBulkQuery = z.object({
    limit: z
        .number()
        .min(10, {
            error: "You can request minimum of 10",
        })
        .max(100, {
            error: "You can request maximum of 100",
        })
        .default(50),
});

export const validateSpaceGetOneParams = validateSpaceDeleteParams;

export const validateSpaceUpdateParams = z.object({
    spaceId: z.string({ error: "Invalid space ID" }).trim(),
});

export const validateSpaceUpdate = z.object({
    name: z
        .string()
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length >= 2, {
            message: "Space name must be at least 2 characters long",
        })
        .refine((val) => val.length <= 100, {
            message: "Space name must be at most 100 characters long",
        })
        .optional(),

    description: z
        .string()
        .trim()
        .max(1000, { message: "Description must be at most 1000 characters long" })
        .nullable()
        .optional(),

    crop: z
        .object({
            x: z.number().min(0, { error: "Crop x must be at least 0" }),
            y: z.number().min(0, { error: "Crop y must be at least 0" }),
            width: z.number().min(1, { error: "Crop width must be at least 1" }),
            height: z.number().min(1, { error: "Crop height must be at least 1" }),
        })
        .nullable()
        .optional(),
});
