import z from "zod";

export const validateExpressionPutBody = z.object({
    spaceId: z.string().trim().optional(),
    userId: z.string().trim().optional(),

    name: z.string().trim(),
    type: z.string().refine((val) => ["0", "1"].includes(val), {
        error: "Invalid expression type provided",
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
            rounded: z.boolean().optional(),
        })
        .nullable(),
});
