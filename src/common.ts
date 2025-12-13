import { Buffer } from "buffer";
import z from "zod";

export const fileValidator = z.object({
    fieldname: z.string(),
    originalname: z.string().min(1),
    encoding: z.string(),
    mimetype: z.enum(["image/png", "image/jpeg", "image/webp", "image/gif"]),
    size: z
        .number()
        .min(1, "File size must be greater than 0 bytes")
        .max(5 * 1024 * 1024, "File size exceeds the limit of 5MB"),
    buffer: z.instanceof(Buffer),
});
