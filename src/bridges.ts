import z from "zod";
import { zSnowflake } from "./reusables/snowflake";

// Messages match the ones the bridge settings screens already show

const NAME_ERROR = "Name must be 1–64 characters";
const SERVER_ID_ERROR = "serverId must be letters, numbers, _ or -";

// Plugin server IDs come from the admin's config.yml, so this is generous
export const MAX_SERVER_ID = 128;

const sanitizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");

const bridgeName = z
  .string({ error: NAME_ERROR })
  .trim()
  .min(1, { error: NAME_ERROR })
  .max(64, { error: NAME_ERROR });

const serverSlug = z
  .string({ error: SERVER_ID_ERROR })
  .max(MAX_SERVER_ID, { error: SERVER_ID_ERROR })
  .transform(sanitizeSlug)
  .refine(Boolean, { error: SERVER_ID_ERROR });

// An empty field keeps the "required" message; a non-numeric one gets "Invalid ID"
const requiredSnowflake = (error: string) =>
  z.string({ error }).trim().min(1, { error }).pipe(zSnowflake);

export const bridgeIdParams = z.object({
  bridgeId: zSnowflake,
});

export const bridgeSpaceParams = z.object({
  spaceId: zSnowflake,
});

export const bridgeBindingParams = z.object({
  bindingId: zSnowflake,
});

export const bridgeMemberParams = z.object({
  userId: zSnowflake,
});

export const bridgeServerParams = z.object({
  serverId: z
    .string()
    .trim()
    .min(1, { error: "serverId is required" })
    .max(MAX_SERVER_ID, { error: "Invalid serverId" }),
});

export const bridgeCreateBody = z.object({
  // Missing name falls back to "<space> Bridge" in the controller
  name: bridgeName.nullish(),
  serverId: serverSlug.nullish(),
  displayName: z.string().trim().max(64).nullish(),
});

export const bridgeUpdateBody = z
  .object({
    name: bridgeName.nullish(),
    status: z.coerce
      .number()
      .refine((status) => status === 0 || status === 1, {
        error: "status must be 0 (active) or 1 (archived)",
      })
      .nullish(),
  })
  .refine((body) => body.name != null || body.status != null, {
    error: "Provide name and/or status",
  });

export const bridgeServerUpdateBody = z.object({
  displayName: z
    .string({ error: "displayName must be 1–64 characters" })
    .trim()
    .min(1, { error: "displayName must be 1–64 characters" })
    .max(64, { error: "displayName must be 1–64 characters" }),
});

export const bridgeAckBody = z.object({
  lastAckedId: z
    .string({ error: "lastAckedId is required" })
    .trim()
    .min(1, { error: "lastAckedId is required" })
    .max(256, { error: "lastAckedId is required" }),
});

export const bridgeRotateTokenBody = z.object({
  // Only used to prefill the plugin config, so junk is ignored
  serverId: z
    .string()
    .max(MAX_SERVER_ID)
    .transform(sanitizeSlug)
    .optional()
    .catch(undefined),
});

const DISCORD_BIND_ERROR = "serverId, guildId, and channelId are required";

export const bridgeDiscordBindBody = z.object(
  {
    serverId: z
      .string({ error: DISCORD_BIND_ERROR })
      .trim()
      .min(1, { error: DISCORD_BIND_ERROR })
      .max(MAX_SERVER_ID, { error: DISCORD_BIND_ERROR }),
    guildId: requiredSnowflake(DISCORD_BIND_ERROR),
    channelId: requiredSnowflake(DISCORD_BIND_ERROR),
  },
  { error: DISCORD_BIND_ERROR },
);

const VOICE_BIND_ERROR = "serverId and channelId are required";

export const bridgeVoiceBindBody = z.object(
  {
    serverId: z
      .string({ error: VOICE_BIND_ERROR })
      .trim()
      .min(1, { error: VOICE_BIND_ERROR })
      .max(MAX_SERVER_ID, { error: VOICE_BIND_ERROR }),
    channelId: requiredSnowflake(VOICE_BIND_ERROR),
    name: z
      .string()
      .max(64)
      .transform((name) => sanitizeSlug(name) || "default")
      .catch("default"),
  },
  { error: VOICE_BIND_ERROR },
);

export const bridgeLinkCodeBody = z.object({
  bridgeId: z.coerce.string().trim().max(32).nullish(),
});

export const bridgeRedeemBody = z.object(
  {
    code: z
      .string({ error: "code is required" })
      .trim()
      .toUpperCase()
      .min(1, { error: "code is required" })
      .max(32, { error: "Invalid or expired code" }),
  },
  { error: "code is required" },
);

export const bridgeChatBody = z.object(
  {
    content: z
      .string({ error: "content is required" })
      .trim()
      .min(1, { error: "content is required" })
      .max(500, { error: "content must be 500 characters or less" }),
    serverId: z.string().max(MAX_SERVER_ID).optional().catch(undefined),
  },
  { error: "content is required" },
);

export const bridgesListQuery = z.object({
  archived: z.stringbool().optional().catch(undefined),
});

export const bridgeMessagesListQuery = z.object({
  // The bridge service clamps the limit itself
  limit: z.coerce.number().int().optional().catch(undefined),
  // A message sourceKey, not a snowflake
  before: z.string().max(256).optional().catch(undefined),
});
