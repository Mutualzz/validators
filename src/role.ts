import { validateNonGradientColor, sanitizeDisplayText } from "./utils";
import z from "zod";

export const validateRoleParams = z.object({
    spaceId: z.string({ error: "Invalid space ID" }).trim(),
    roleId: z.string({ error: "Invalid role ID" }).trim(),
});

export const validateRoleUpdate = z.object({
    name: z
        .string({ error: "Invalid role name" })
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length >= 1, {
            message: "Role name must be at least 1 character",
        })
        .refine((val) => val.length <= 100, {
            message: "Role name must be at most 100 characters",
        })
        .optional(),
    color: validateNonGradientColor.optional(),
    position: z
        .number({ error: "Invalid role position" })
        .int()
        .nonnegative()
        .optional(),
    mentionable: z.boolean().optional(),
    hoist: z.boolean().optional(),
    allow: z.string({ error: "Invalid bitfield" }).optional(),
    deny: z.string({ error: "Invalid bitfield" }).optional(),
});

export const validateRoleMemberParams = z.object({
    spaceId: z.string({ error: "Invalid space ID" }).trim(),
    userId: z.string({ error: "Invalid user ID" }).trim(),
    roleId: z.string({ error: "Invalid role ID" }).trim(),
});
