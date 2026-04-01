import z from "zod";

export const validateExpressionPutBody = z.object({
    spaceId: z.string().trim().optional(),
    userId: z.string().trim().optional(),

    name: z.string().trim().optional(),
    type: z.string().refine((val) => ["0", "1"].includes(val), {
        error: "Invalid expression type provided",
    }),
});
