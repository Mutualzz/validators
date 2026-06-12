import z from "zod";

export const validateExpressionPutBody = z.object({
  spaceId: z.string().trim().optional(),

  name: z
    .string()
    .trim()
    .transform(
      (val) =>
        val
          .toLowerCase()
          .replace(/[\s.\-]+/g, "_") // spaces, dots, hyphens → underscore
          .replace(/[^a-z0-9_]/g, "") // strip anything else
          .replace(/_{2,}/g, "_") // collapse runs of underscores
          .replace(/^_+|_+$/g, ""), // trim leading/trailing underscores
    )
    .pipe(
      z
        .string()
        .min(2, { message: "Expression name must be at least 2 characters" })
        .max(32, { message: "Expression name must be at most 32 characters" })
        .regex(/^[a-z0-9_]+$/, {
          message:
            "Expression name may only contain letters, numbers, and underscores",
        }),
    ),
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
    })
    .nullable()
    .optional(),
});

export const validateExpressionParams = z.object({
  expressionId: z.string().trim(),
});
