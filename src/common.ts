import z from "zod";

const imageMimeType = z.preprocess(
    (val) => (val === "image/jpg" ? "image/jpeg" : val),
    z.enum(["image/png", "image/jpeg", "image/webp", "image/gif"]),
);

export const imageFileValidator = z.object({
    fieldname: z.string(),
    originalname: z.string().min(1),
    encoding: z.string(),
    mimetype: imageMimeType,
    size: z
        .number()
        .min(1, "File size must be greater than 0 bytes")
        .max(50 * 1024 * 1024, "File size exceeds the limit of 50MB"),
    buffer: z.instanceof(Uint8Array),
});

export const profileMusicFileValidator = z.object({
    fieldname: z.string(),
    originalname: z
        .string()
        .min(1)
        .refine((name) => !/\.wav$/i.test(name), "WAV files are not supported"),
    encoding: z.string(),
    mimetype: z.enum(["audio/mpeg", "audio/mp3"]),
    size: z
        .number()
        .min(1, "File size must be greater than 0 bytes")
        .max(15 * 1024 * 1024, "MP3 file size exceeds the limit of 15MB"),
    buffer: z.instanceof(Uint8Array),
});

const fontMimeType = z.preprocess(
    (val) => (val === "application/x-font-woff2" ? "font/woff2" : val),
    z.enum(["font/woff2", "application/font-woff2", "application/octet-stream"]),
);

function isWoff2Buffer(buffer: Uint8Array) {
    return (
        buffer.length >= 4 &&
        buffer[0] === 0x77 &&
        buffer[1] === 0x4f &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x32
    );
}

export const fontFileValidator = z
    .object({
        fieldname: z.string(),
        originalname: z
            .string()
            .min(1)
            .refine((name) => /\.woff2$/i.test(name), "Only .woff2 files are supported"),
        encoding: z.string(),
        mimetype: fontMimeType,
        size: z
            .number()
            .min(1, "File size must be greater than 0 bytes")
            .max(2 * 1024 * 1024, "Font file size exceeds the limit of 2MB"),
        buffer: z.instanceof(Uint8Array),
    })
    .refine((file) => isWoff2Buffer(file.buffer), "Invalid WOFF2 file");

export const validateSpaceParam = z.object({
    spaceId: z.string({ error: "Invalid space ID" }).trim(),
});
