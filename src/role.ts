import { validateNonGradientColor, sanitizeDisplayText } from "./utils";
import z from "zod";
import { snowflake } from "./reusables/snowflake";

export const validateRoleParams = z.object({
    spaceId: snowflake("Invalid space ID"),
    roleId: snowflake("Invalid role ID"),
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
    spaceId: snowflake("Invalid space ID"),
    userId: snowflake("Invalid user ID"),
    roleId: snowflake("Invalid role ID"),
});
