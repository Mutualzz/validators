import z from "zod";

const UNSAFE_NAME_CHARS = /[\u0000-\u001F\u007F<>\\]/g;

export const sanitizeEmojiName = (val: string) =>
  val
    .toLowerCase()
    .replace(/[\s.\-]+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_{2,}/g, "_")
    .replace(/^_+|_+$/g, "");

export const sanitizeStickerName = (val: string) =>
  val
    .replace(UNSAFE_NAME_CHARS, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const emojiNameSchema = z
  .string()
  .trim()
  .transform(sanitizeEmojiName)
  .pipe(
    z
      .string()
      .min(2, { message: "Expression name must be at least 2 characters" })
      .max(32, { message: "Expression name must be at most 32 characters" })
      .regex(/^[a-z0-9_]+$/, {
        message:
          "Expression name may only contain letters, numbers, and underscores",
      }),
  );

const stickerNameSchema = z
  .string()
  .trim()
  .transform(sanitizeStickerName)
  .pipe(
    z
      .string()
      .min(2, { message: "Sticker name must be at least 2 characters" })
      .max(32, { message: "Sticker name must be at most 32 characters" })
      .regex(/^[\p{L}\p{N}\p{M} ._'\-!?&+#]+$/u, {
        message: "Sticker name contains invalid characters",
      }),
  );

export const parseExpressionName = (type: string | number, name: string) => {
  const isSticker = String(type) === "1";
  return (isSticker ? stickerNameSchema : emojiNameSchema).parse(name);
};

export const validateExpressionPutBody = z
  .object({
    spaceId: z.string().trim().optional(),

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
      })
      .nullable()
      .optional(),
  })
  .transform((data) => ({
    ...data,
    name: parseExpressionName(data.type, data.name),
  }));

export const validateExpressionPatchBody = (type: string | number) =>
  z
    .object({
      name: z.string().trim(),
    })
    .transform((data) => ({
      name: parseExpressionName(type, data.name),
    }));

export const validateExpressionParams = z.object({
  expressionId: z.string().trim(),
});
