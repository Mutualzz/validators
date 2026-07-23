import { z } from "zod";
import {
    disallowedNameSubstrings,
    invisibleCharsRegex,
    notAllowedNames,
} from "./constants";
import { emailRegex, pswdRegex } from "./regexes";
import { sanitizeName, sanitizeDisplayText } from "./utils";

export const validateRegister = z
    .object({
        username: z
            .string({ error: "Username is required" })
            .min(2, {
                error: "Username must be at least 2 characters long",
            })
            .max(32, {
                error: "Username must be at most 32 characters long",
            })
            .toLowerCase()
            .trim()
            .transform((val) => sanitizeName(val.toLowerCase()))
            .refine(
                (val) =>
                    !disallowedNameSubstrings.some((sub) => val.includes(sub)),
                {
                    error: "Please only use numbers, letters, underscores, or periods",
                },
            )
            .refine((val) => /^[a-z0-9._]+$/.test(val), {
                error: "Please only use numbers, letters, underscores, or periods",
            })
            .refine((val) => !notAllowedNames.includes(val), {
                error: ({ input }) => `"${input}" is not allowed`,
            })
            .refine((val) => !invisibleCharsRegex.test(val), {
                error: "Username contains invisible or invalid characters",
            })
            .refine((val) => !emailRegex.test(val), {
                error: "Username cannot be an email",
            }),

        email: z.email("Invalid email address").trim().toLowerCase(),

        password: z
            .string({ error: "Password is required" })
            .trim()
            .regex(pswdRegex, {
                error: "Password is too weak, must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number",
            }),

        confirmPassword: z
            .string({ error: "Confirm Password is required" })
            .trim(),

        globalName: z
            .string({ error: "Invalid display name" })
            .trim()
            .min(1, {
                error: "Display name must be at least 1 character",
            })
            .max(32, {
                error: "Display name must be at most 32 characters",
            })
            .transform(sanitizeDisplayText)
            .refine((val) => !invisibleCharsRegex.test(val), {
                error: "Display name contains invisible or invalid characters",
            })
            .optional(),

        dateOfBirth: z.union([z.string(), z.date()]).transform((val) => {
            if (val instanceof Date) return val.toDateString();
            return new Date(val).toDateString();
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine(
        ({ dateOfBirth }) => {
            const dob = new Date(dateOfBirth);
            if (Number.isNaN(dob.getTime())) return false;
            const now = new Date();
            let age = now.getFullYear() - dob.getFullYear();
            const monthDiff = now.getMonth() - dob.getMonth();
            if (
                monthDiff < 0 ||
                (monthDiff === 0 && now.getDate() < dob.getDate())
            ) {
                age -= 1;
            }
            return age >= 13;
        },
        {
            error: "You must be at least 13 years old to register",
            path: ["dateOfBirth"],
        },
    );

export const validateLogin = z.object({
    username: z
        .string({ error: "Invalid username" })
        .trim()
        .toLowerCase()
        .optional(),
    email: z
        .email({ error: "Invalid email address" })
        .trim()
        .toLowerCase()
        .optional(),
    password: z.string({ error: "Password is required" }).trim(),
});

export const validateForgotPassword = z.object({
    username: z
        .string({ error: "Invalid username" })
        .trim()
        .toLowerCase()
        .optional(),
    email: z
        .email({ error: "Invalid email address" })
        .trim()
        .toLowerCase()
        .optional(),
});

export const validateResetPassword = z
    .object({
        token: z.string().trim(),
        password: z
            .string()
            .trim()
            .min(8, {
                error: "Password must be at least 8 characters long",
            })
            .regex(pswdRegex, {
                error: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
            }),
        confirmPassword: z.string().trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: "Passwords do not match",
        path: ["confirmPassword"],
    });
