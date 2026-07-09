import z from "zod";
import {
    disallowedNameSubstrings,
    invisibleCharsRegex,
    notAllowedNames,
} from "./constants";
import { emailRegex } from "./regexes";
import { sanitizeDisplayText, sanitizeName } from "./utils";

export const validateStaffUserParams = z.object({
    userId: z.string({ error: "Invalid user ID" }).trim(),
});

const staffReason = z
    .string({ error: "Invalid reason provided" })
    .trim()
    .transform(sanitizeDisplayText)
    .refine((val) => val.length <= 512, {
        message: "Reason must be at most 512 characters",
    })
    .optional();

export const validateStaffDisableUserBody = z
    .object({
        disabled: z.boolean({ error: "Invalid disabled value" }),
        reason: staffReason,
    })
    .refine((val) => !val.disabled || !!val.reason, {
        message: "A reason is required to disable an account",
        path: ["reason"],
    });

export const validateStaffForceLogoutBody = z.object({
    reason: staffReason,
});

export const validateStaffDeleteUserBody = z.object({
    mode: z.enum(["soft", "hard"]).default("soft"),
    reason: z
        .string({ error: "A deletion reason is required" })
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length >= 1, {
            message: "A deletion reason is required",
        })
        .refine((val) => val.length <= 512, {
            message: "Reason must be at most 512 characters",
        }),
    confirmUsername: z
        .string({ error: "Username confirmation is required" })
        .trim()
        .toLowerCase()
        .refine((val) => val.length >= 1, {
            message: "Type the username to confirm deletion",
        }),
});

export const validateStaffWarnUserBody = z.object({
    reason: z
        .string({ error: "A warning reason is required" })
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length >= 1, {
            message: "A warning reason is required",
        })
        .refine((val) => val.length <= 512, {
            message: "Reason must be at most 512 characters",
        }),
});

export const validateStaffRestrictUserBody = z.object({
    hours: z.coerce
        .number({ error: "Invalid duration" })
        .min(1, "Duration must be at least 1 hour")
        .max(720, "Duration cannot exceed 30 days"),
    reason: z
        .string({ error: "A reason is required" })
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length >= 1, {
            message: "A reason is required",
        })
        .refine((val) => val.length <= 512, {
            message: "Reason must be at most 512 characters",
        }),
});

export const validateStaffNotesQuery = z.object({
    before: z.string().trim().optional(),
    limit: z.coerce.number().min(1).max(100).default(50),
});

export const validateStaffCreateNoteBody = z.object({
    content: z
        .string({ error: "Note content is required" })
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length >= 1, {
            message: "Note content is required",
        })
        .refine((val) => val.length <= 2000, {
            message: "Note must be at most 2000 characters",
        }),
});

export const validateStaffSearchUsersQuery = z
    .object({
        query: z.string().trim().min(1).max(64).optional(),
        flag: z.string().trim().optional(),
        after: z.string().trim().optional(),
        limit: z.coerce.number().min(1).max(100).default(25),
    })
    .refine((val) => !!val.query || !!val.flag, {
        message: "Provide a search query or a flag filter",
    });

export const validateStaffActionsQuery = z.object({
    before: z.string().trim().optional(),
    limit: z.coerce.number().min(1).max(100).default(50),
});

export const validateStaffSetFlagParams = z.object({
    userId: z.string({ error: "Invalid user ID" }).trim(),
    flag: z.string({ error: "Invalid flag" }).trim(),
});

export const validateStaffSetFlagBody = z.object({
    enabled: z.boolean({ error: "Invalid enabled value" }),
    reason: staffReason,
});

export const validateStaffSessionParams = z.object({
    userId: z.string({ error: "Invalid user ID" }).trim(),
    sessionId: z.string({ error: "Invalid session ID" }).trim(),
});

const staffUsername = z
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
    .optional();

const staffGlobalName = z
    .string()
    .trim()
    .min(1, "Display name must be at least 1 character")
    .max(32, "Display name must be at most 32 characters")
    .transform(sanitizeDisplayText)
    .refine((val) => !invisibleCharsRegex.test(val), {
        error: "Display name contains invisible or invalid characters",
    })
    .nullable()
    .optional();

export const validateStaffProfileUpdateBody = z
    .object({
        username: staffUsername,
        globalName: staffGlobalName,
        reason: staffReason,
    })
    .refine((val) => val.username !== undefined || val.globalName !== undefined, {
        message: "Provide a username or display name to update",
    });
