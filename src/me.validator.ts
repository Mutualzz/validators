import { defaultAvatars } from "@mutualzz/types";
import z from "zod";
import {
    disallowedNameSubstrings,
    invisibleCharsRegex,
    notAllowedNames,
} from "./constants";
import { emailRegex } from "./regexes";
import { sanitizeName } from "./utils";

export const validateMePatch = z.object({
    username: z
        .string()
        .min(2, "Username must be at least 2 characters long")
        .max(32, "Username must be at most 32 characters long")
        .trim()
        .toLowerCase()
        .transform((val) => sanitizeName(val.toLowerCase()))
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
            error: "Username contains invisible or invalid characters",
        })
        .refine((val) => !emailRegex.test(val), {
            error: "Username cannot be an email",
        })
        .optional(),

    avatar: z.any().optional(),
    defaultAvatar: z
        .enum(defaultAvatars, {
            error: (input) => `"${input}" is not a valid default avatar`,
        })
        .optional(),

    globalName: z
        .string()
        .trim()
        .min(1, "Nickname must be at least 1 character")
        .max(32, "Nickname must be at most 32 characters")
        .transform((val) => val.trim().replace(/\s{2,}/g, " "))
        .optional(),
});

export const validateMeSettingsPatch = z.object({
    currentTheme: z.string().trim().optional(),
    preferredMode: z.enum(["feed", "spaces"]).optional(),
    spacePositions: z.array(z.string().trim()).optional(),
});

export const validatePreviousAvatarDelete = z.object({
    avatar: z.string({ error: "Avatar hash is required" }),
});
