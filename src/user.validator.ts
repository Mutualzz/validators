import z from "zod";

export const validateUserGet = z.object({
    id: z
        .string({ error: "Invalid user ID" })
        .min(1, { error: "User ID cannot be empty" }),
});
