import { z } from "zod";
import {
    disallowedNameSubstrings,
    invisibleCharsRegex,
    notAllowedNames,
} from "./constants";
import { emailRegex } from "./regexes";
import { sanitizeName, validateColor, validateNonGradientColor } from "./utils";

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

    description: z.string().optional(),

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
        colors: z.object({
            primary: validateNonGradientColor,
            secondary: validateNonGradientColor,
            accent: validateNonGradientColor,
            muted: validateNonGradientColor,
        }),
    }),
});

export const validateThemeUpdateQuery = z.object({
    id: z.string({ error: "Theme ID is required" }),
});

export const validateThemeUpdateBody = validateThemeCreate.partial();
