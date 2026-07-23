import { z } from "zod";

export const notificationLevelSchema = z.coerce.number().int().min(0).max(2);

export const muteDurationSchema = z.enum([
  "off",
  "1h",
  "8h",
  "24h",
  "1w",
  "forever",
]);

export const patchSpaceNotificationSettingsSchema = z
  .object({
    level: notificationLevelSchema.optional(),
    mutedUntil: z.coerce.date().nullable().optional(),
    muteDuration: muteDurationSchema.optional(),
    suppressEveryone: z.boolean().optional(),
    suppressRoles: z.boolean().optional(),
  })
  .strict();

export const patchChannelNotificationSettingsSchema = z
  .object({
    muted: z.boolean().optional(),
    notificationLevel: notificationLevelSchema.nullable().optional(),
    mutedUntil: z.coerce.date().nullable().optional(),
    muteDuration: muteDurationSchema.optional(),
    useSpaceDefault: z.boolean().optional(),
  })
  .strict();

export type PatchSpaceNotificationSettings = z.infer<
  typeof patchSpaceNotificationSettingsSchema
>;
export type PatchChannelNotificationSettings = z.infer<
  typeof patchChannelNotificationSettingsSchema
>;
