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

export const FONT_EXTENSIONS = ["woff2", "woff", "ttf", "otf"] as const;
export type FontExt = (typeof FONT_EXTENSIONS)[number];

const fontMimeType = z.preprocess(
    (val) => (val === "application/x-font-woff2" ? "font/woff2" : val),
    z.enum([
        "font/woff2",
        "font/woff",
        "font/ttf",
        "font/otf",
        "font/sfnt",
        "application/font-woff2",
        "application/font-woff",
        "application/font-sfnt",
        "application/x-font-woff",
        "application/x-font-ttf",
        "application/x-font-otf",
        "application/octet-stream",
    ]),
);

function fontExtFromName(name: string): FontExt | null {
    const match = /\.(woff2|woff|ttf|otf)$/i.exec(name);
    return match ? (match[1].toLowerCase() as FontExt) : null;
}

function isWoff2Buffer(buffer: Uint8Array) {
    return (
        buffer.length >= 4 &&
        buffer[0] === 0x77 &&
        buffer[1] === 0x4f &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x32
    );
}

function isWoffBuffer(buffer: Uint8Array) {
    return (
        buffer.length >= 4 &&
        buffer[0] === 0x77 &&
        buffer[1] === 0x4f &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x46
    );
}

function isOtfBuffer(buffer: Uint8Array) {
    return (
        buffer.length >= 4 &&
        buffer[0] === 0x4f &&
        buffer[1] === 0x54 &&
        buffer[2] === 0x54 &&
        buffer[3] === 0x4f
    );
}

function isTtfBuffer(buffer: Uint8Array) {
    if (buffer.length < 4) return false;
    if (
        buffer[0] === 0x00 &&
        buffer[1] === 0x01 &&
        buffer[2] === 0x00 &&
        buffer[3] === 0x00
    )
        return true;

    const tag = String.fromCharCode(buffer[0], buffer[1], buffer[2], buffer[3]);
    return tag === "true" || tag === "typ1";
}

function isValidFontBuffer(ext: FontExt, buffer: Uint8Array) {
    switch (ext) {
        case "woff2":
            return isWoff2Buffer(buffer);
        case "woff":
            return isWoffBuffer(buffer);
        case "otf":
            return isOtfBuffer(buffer);
        case "ttf":
            return isTtfBuffer(buffer);
    }
}

export const fontFileValidator = z
    .object({
        fieldname: z.string(),
        originalname: z
            .string()
            .min(1)
            .refine(
                (name) => fontExtFromName(name) !== null,
                "Only .ttf, .otf, .woff and .woff2 files are supported",
            ),
        encoding: z.string(),
        mimetype: fontMimeType,
        size: z
            .number()
            .min(1, "File size must be greater than 0 bytes")
            .max(5 * 1024 * 1024, "Font file size exceeds the limit of 5MB"),
        buffer: z.instanceof(Uint8Array),
    })
    .refine((file) => {
        const ext = fontExtFromName(file.originalname);
        return !!ext && isValidFontBuffer(ext, file.buffer);
    }, "Invalid font file");

export function fontExtFromFile(file: { originalname: string }): FontExt {
    return fontExtFromName(file.originalname) ?? "woff2";
}

export const validateSpaceParam = z.object({
    spaceId: z.string({ error: "Invalid space ID" }).trim(),
});
