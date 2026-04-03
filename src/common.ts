import z from "zod";

export const imageFileValidator = z.object({
    fieldname: z.string(),
    originalname: z.string().min(1),
    encoding: z.string(),
    mimetype: z.enum(["image/png", "image/jpeg", "image/webp", "image/gif"]),
    size: z
        .number()
        .min(1, "File size must be greater than 0 bytes")
        .max(5 * 1024 * 1024, "File size exceeds the limit of 5MB"),
    buffer: z.instanceof(Uint8Array),
});

export const validateSpaceParam = z.object({
    spaceId: z.string({ error: "Invalid space ID" }).trim(),
});
