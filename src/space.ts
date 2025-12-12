import z from "zod";
import { emailRegex } from "./regexes";

export const validateSpacePut = z.object({
    name: z
        .string()
        .min(2, "Space name must be atleast 2 characters long")
        .max(100, "Space name must be atleast 100 characters long")
        .refine((val) => !emailRegex.test(val), {
            error: "Name cannot be an email",
        }),
});

export const validateSpaceGet = z.object({
    id: z
        .string({ error: "Invalid space ID" })
        .min(1, { error: "Space ID cannot be empty" }),
});

export const validateSpaceGetQuery = z.object({
    partial: z.boolean().optional(),
});
