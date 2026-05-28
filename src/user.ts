import z from "zod";

export const validateUserGet = z.object({
    userId: z.string({ error: "Invalid user ID" }),
});
