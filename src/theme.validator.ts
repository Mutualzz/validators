import { z } from "zod";
import {
    disallowedNameSubstrings,
    invisibleCharsRegex,
    notAllowedNames,
} from "./constants";
import { colorLikeRegex, emailRegex } from "./regexes";
import { sanitizeName } from "./utils";

const validateColor = z.string().regex(colorLikeRegex, {
    error: ({ input }) =>
        input === ""
            ? "Color cannot be empty"
            : `"${input}" is not a valid color`,
});

export const validateThemePut = z.object({
    name: z
        .string()
        .min(2, "Theme name must be atleast 2 characters long")
        .max(32, "Name must be atleast 32 characters long")
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

    type: z.enum(["dark", "light"], "Invalid Theme type provided"),

    colors: z.object({
        common: z.object({
            white: validateColor,
            black: validateColor,
        }),

        primary: validateColor,
        neutral: validateColor,
        background: validateColor,
        surface: validateColor,

        danger: validateColor,
        info: validateColor,
        success: validateColor,
        warning: validateColor,
    }),

    typography: z.object({
        colors: z.object({
            primary: validateColor,
            secondary: validateColor,
            accent: validateColor,
            muted: validateColor,
        }),
    }),
});
