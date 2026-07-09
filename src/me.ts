import z from "zod";
import {
  disallowedNameSubstrings,
  invisibleCharsRegex,
  notAllowedNames,
} from "./constants";
import { emailRegex, pswdRegex } from "./regexes";
import { sanitizeName, sanitizeDisplayText } from "./utils";

export const validateUsernameChange = z.object({
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
    }),

  password: z
    .string({ error: "Password is required" })
    .trim()
    .regex(pswdRegex, {
      error:
        "Password is too weak, must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number",
    }),
});

export const validateMeUpdate = z.object({
  avatar: z.any().nullable().optional(),
  defaultAvatar: z
    .object({
      type: z
        .number()
        .min(0, "Default avatar type must be between 0 and 5")
        .max(5, "Default avatar type must be between 0 and 5")
        .optional(),
      color: z.string().nullable().optional(),
    })
    .optional(),

  globalName: z
    .string()
    .trim()
    .min(1, "Nickname must be at least 1 character")
    .max(32, "Nickname must be at most 32 characters")
    .transform(sanitizeDisplayText)
    .refine((val) => !invisibleCharsRegex.test(val), {
      error: "Nickname contains invisible or invalid characters",
    })
    .optional(),
});

export const validateMeSettingsUpdate = z.object({
  currentTheme: z.string().trim().nullable().optional(),
  currentIcon: z.string().trim().nullable().optional(),
  preferredMode: z.enum(["feed", "spaces"]).optional(),
  spacePositions: z.array(z.string().trim()).optional(),
  preferredSelfMute: z.boolean().optional(),
  preferredSelfDeaf: z.boolean().optional(),
  favoriteEmojis: z.array(z.string()).optional(),
  favoriteGifs: z.array(z.string()).optional(),
  favoriteStickers: z.array(z.string()).optional(),
  pushEnabled: z.boolean().optional(),
  pushDirectMessages: z.boolean().optional(),
  pushMentions: z.boolean().optional(),
});

export const validatePreviousAvatarDelete = z.object({
  avatar: z.string({ error: "Avatar hash is required" }),
});

export const validateVerifyEmail = z.object({
  code: z
    .string()
    .length(6, "Verification code must be exactly 6 characters long"),
});

export const validateChangePassword = z
  .object({
    currentPassword: z
      .string({ error: "Current Password is required" })
      .trim()
      .regex(pswdRegex, {
        error:
          "Password is too weak, must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number",
      }),

    newPassword: z
      .string({ error: "New Password is required" })
      .trim()
      .regex(pswdRegex, {
        error:
          "Password is too weak, must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number",
      }),

    confirmNewPassword: z
      .string({ error: "Confirm new Password is required" })
      .trim(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    error: "Passwords do not match",
    path: ["newPassword", "confirmNewPassword"],
  });

export const validateDmChannelCreateBody = z.object({
  recipientId: z.string().trim(),
});

export const validateRelationshipRequest = z.object({
  identifier: z
    .string({ error: "Invalid user" })
    .min(1)
    .max(64)
    .transform((value) => value.trim().toLowerCase()),
});

export const validatePushTokenRegister = z.object({
  token: z.string().trim().min(1),
  platform: z.enum(["ios", "android"]),
});

export const validatePushTokenDelete = z.object({
  token: z.string().trim().min(1).optional(),
});
