import { z } from "zod";
import {
    disallowedNameSubstrings,
    invisibleCharsRegex,
    notAllowedNames,
} from "./constants";
import { validateFontFamily } from "./fonts";
import { emailRegex } from "./regexes";
import { sanitizeName, validateColor, validateNonGradientColor, sanitizeDisplayText } from "./utils";

const wallpaperPercent = z.number().min(0).max(200);
const wallpaperOpacity = z.number().min(0).max(100);
const wallpaperBlur = z.number().min(0).max(40);

export const validateThemeWallpaper = z
    .object({
        brightness: wallpaperPercent.optional(),
        saturation: wallpaperPercent.optional(),
        overlay: wallpaperOpacity.optional(),
        chrome: wallpaperOpacity.optional(),
        content: wallpaperOpacity.optional(),
        card: wallpaperOpacity.optional(),
        popout: wallpaperOpacity.optional(),
        composer: wallpaperOpacity.optional(),
        blur: wallpaperBlur.optional(),
    })
    .nullable()
    .optional();

export const validateThemeCreate = z.object({
    name: z
        .string()
        .min(2, "Theme name must be atleast 2 characters long")
        .max(32, "Theme name must be atleast 32 characters long")
        .transform((val) => sanitizeName(val, false))
        .refine(
            (val) => !disallowedNameSubstrings.some((sub) => val.includes(sub)),
            {
                error: "Please only use numbers, letters, underscores, or periods",
            },
        )
        .refine((val) => !notAllowedNames.includes(val), {
            error: ({ input }) => `"${input}" is not allowed`,
        })
        .refine((val) => !invisibleCharsRegex.test(val), {
            error: "Name contains invisible or invalid characters",
        })
        .refine((val) => !emailRegex.test(val), {
            error: "Name cannot be an email",
        }),

    description: z
        .string()
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length <= 500, {
            message: "Description must be at most 500 characters",
        })
        .optional(),

    adaptive: z.boolean(),
    type: z.enum(["dark", "light"], "Invalid Theme type provided"),
    style: z.enum(["normal", "gradient"], "Invalid Theme style provided"),

    colors: z.object({
        common: z.object({
            white: validateNonGradientColor,
            black: validateNonGradientColor,
        }),

        primary: validateNonGradientColor,
        neutral: validateNonGradientColor,
        background: validateColor,
        surface: validateColor,

        danger: validateNonGradientColor,
        info: validateNonGradientColor,
        success: validateNonGradientColor,
        warning: validateNonGradientColor,
    }),

    typography: z.object({
        fontFamily: validateFontFamily,
        colors: z.object({
            primary: validateNonGradientColor,
            secondary: validateNonGradientColor,
            accent: validateNonGradientColor,
            muted: validateNonGradientColor,
        }),
    }),

    wallpaper: validateThemeWallpaper,
});

export const validateThemeUpdateQuery = z.object({
    themeId: z.string({ error: "Theme ID is required" }),
});

export const validateThemeUpdateBody = validateThemeCreate
    .partial()
    .extend({
        backgroundImage: z.string().trim().nullable().optional(),
    });

export const validateSpaceThemeParams = z.object({
    spaceId: z.string({ error: "Invalid space ID" }).trim(),
});

export const validateSpaceThemeIdParams = z.object({
    spaceId: z.string({ error: "Invalid space ID" }).trim(),
    themeId: z.string({ error: "Theme ID is required" }).trim(),
});
