import z from "zod";

export const validateUserGet = z.object({
    identifier: z
        .string({ error: "Invalid user" })
        .min(1)
        .max(64)
        .transform((value) => value.trim().toLowerCase()),
});
