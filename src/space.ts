import z from "zod";
import { emailRegex } from "./regexes";

export const validateSpaceCreate = z.object({
    name: z
        .string()
        .min(2, {
            error: "Space name must be at least 2 characters long",
        })
        .max(100, {
            error: "Space name must be at least 100 characters long",
        })
        .refine((val) => !emailRegex.test(val), {
            error: "Name cannot be an email",
        })
        .trim(),

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
    id: z.string({ error: "Invalid space ID" }).trim(),
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
