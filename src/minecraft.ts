import z from "zod";
import { MAX_SERVER_ID } from "./bridges";

export const MAX_MINECRAFT_CHAT = 2000;
export const MAX_MINECRAFT_NAME = 32;

// z.guid() rather than z.uuid(): Floodgate (Bedrock) players have version-0 UUIDs
const minecraftUuid = z.guid();

const minecraftName = z
  .string()
  .trim()
  .min(1)
  .transform((name) => name.slice(0, MAX_MINECRAFT_NAME))
  .catch("Unknown");

export const minecraftIdentifyData = z.object({
  token: z.string().min(1).max(512),
  serverId: z.string().min(1).max(MAX_SERVER_ID),
});

export const minecraftChatData = z.object({
  uuid: minecraftUuid.optional(),
  name: minecraftName,
  content: z
    .string()
    .trim()
    .min(1)
    .transform((content) => content.slice(0, MAX_MINECRAFT_CHAT)),
});

export const minecraftPlayerData = z.object({
  uuid: minecraftUuid,
  name: minecraftName,
});

export const minecraftLinkData = minecraftPlayerData.extend({
  code: z
    .string()
    .trim()
    .max(32)
    .transform((code) => code.toUpperCase())
    .optional(),
});

export const minecraftVoiceJoinData = minecraftPlayerData.extend({
  room: z.string().max(64).catch("default"),
});

export const minecraftVoiceStateData = z.object({
  uuid: minecraftUuid,
  selfMute: z.boolean().catch(false),
  selfDeaf: z.boolean().catch(false),
});

export const minecraftAudioControl = z.object({
  t: z.literal("voice_state"),
  selfMute: z.boolean().catch(false),
  selfDeaf: z.boolean().catch(false),
});
