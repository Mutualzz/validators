import z from "zod";

export const MAX_SCHEDULE_DURATION_MS = 7 * 24 * 60 * 60_000;
export const MAX_CUSTOM_STATUS_TEXT = 128;

const zScheduleDuration = z.coerce
  .number()
  .transform((ms) => Math.max(0, Math.min(ms, MAX_SCHEDULE_DURATION_MS)));

export const gatewayPresenceScheduleSetPayload = z.object({
  status: z.enum(["online", "idle", "dnd", "invisible"]),
  durationMs: zScheduleDuration,
});

const customStatusEmoji = z
  .object({
    id: z.string().trim().max(32).optional(),
    name: z.string().trim().max(64).optional(),
    animated: z.boolean().optional(),
  })
  .refine((emoji) => emoji.id || emoji.name, {
    error: "Emoji needs an id or a name",
  });

export const gatewayCustomStatusScheduleSetPayload = z
  .object({
    text: z
      .string()
      .trim()
      .transform((text) => text.slice(0, MAX_CUSTOM_STATUS_TEXT))
      .catch(""),
    emoji: customStatusEmoji.nullish().catch(null),
    durationMs: zScheduleDuration,
  })
  .refine((body) => body.text || body.emoji, {
    error: "Custom status needs text or an emoji",
  });
