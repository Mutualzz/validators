import z from "zod";
import {
    disallowedNameSubstrings,
    invisibleCharsRegex,
    notAllowedNames,
} from "./constants";
import { emailRegex } from "./regexes";
import { sanitizeName } from "./utils";

export const validateSpacePut = z.object({
    name: z
        .string()
        .min(2, "Space name must be atleast 2 characters long")
        .max(32, "Space name must be atleast 32 characters long")
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
});

export const validateSpaceGet = z.object({
    id: z
        .string({ error: "Invalid space ID" })
        .min(1, { error: "Space ID cannot be empty" }),
});
