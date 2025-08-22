import { z } from "zod";
import {
    disallowedNameSubstrings,
    invisibleCharsRegex,
    notAllowedNames,
} from "./constants";
import { emailRegex, pswdRegex } from "./regexes";
import { sanitizeName } from "./utils";

export const validateRegister = z
    .object({
        username: z
            .string()
            .min(2, "Username must be at least 2 characters long")
            .max(32, "Username must be at most 32 characters long")
            .toLowerCase()
            .transform((val) => sanitizeName(val.toLowerCase()))
            .refine(
                (val) =>
                    !disallowedNameSubstrings.some((sub) => val.includes(sub)),
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
            }),

        email: z.email("Invalid email address").toLowerCase(),

        password: z
            .string()
            .regex(
                pswdRegex,
                "Password is too weak, must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number",
            ),

        confirmPassword: z.string(),

        globalName: z
            .string()
            .min(1, "Nickname must be at least 1 character")
            .max(32, "Nickname must be at most 32 characters")
            .transform((val) => val.trim().replace(/\s{2,}/g, " "))
            .optional(),

        dateOfBirth: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine(
        (data) => {
            const dateOfBirth = new Date(data.dateOfBirth);
            return new Date().getFullYear() - dateOfBirth.getFullYear() >= 13;
        },
        {
            error: "You must be at least 13 years old to register",
            path: ["dateOfBirth"],
        },
    );

export const validateLogin = z.object({
    username: z.string().toLowerCase().optional(),
    email: z.email().toLowerCase().optional(),
    password: z.string(),
});
