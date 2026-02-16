import { validateNonGradientColor } from "./utils";
import z from "zod";

export const validateRoleParams = z.object({
    spaceId: z.string({ error: "Invalid space ID" }).trim(),
    roleId: z.string({ error: "Invalid role ID" }).trim(),
});

export const validateRoleUpdate = z.object({
    name: z
        .string({ error: "Invalid role name" })
        .trim()
        .min(1)
        .max(100)
        .optional(),
    color: validateNonGradientColor.optional(),
    position: z
        .number({ error: "Invalid role position" })
        .int()
        .nonnegative()
        .optional(),
    mentionable: z.boolean().optional(),
    hoist: z.boolean().optional(),
    permissions: z.string({ error: "Invalid permissions" }).optional(),
});

export const validateRoleMemberParams = z.object({
    spaceId: z.string({ error: "Invalid space ID" }).trim(),
    userId: z.string({ error: "Invalid user ID" }).trim(),
    roleId: z.string({ error: "Invalid role ID" }).trim(),
});
