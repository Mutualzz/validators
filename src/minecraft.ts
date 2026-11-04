import z from "zod";
import { MAX_SERVER_ID } from "./bridges";

export const MAX_MINECRAFT_CHAT = 2000;
export const MAX_MINECRAFT_NAME = 32;
export const MAX_MINECRAFT_ITEM_BYTES = 32768; // 32 KiB, the max size of a Minecraft item NBT tag
export const MAX_MINECRAFT_EVENT_MESSAGE = 512;

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

export const minecraftGameEventData = minecraftPlayerData.extend({
  kind: z.enum(["death", "advancement"]),
  message: z
    .string()
    .trim()
    .min(1)
    .transform((message) => message.slice(0, MAX_MINECRAFT_EVENT_MESSAGE)),
});

export const minecraftServerStatusData = z.object({
  tps: z.number().min(0).max(100),
  mspt: z.number().min(0).max(1_000_000),
  maxPlayers: z.number().int().min(0).max(1_000_000),
  version: z.string().trim().max(32).catch("unknown"),
  motd: z
    .string()
    .transform((motd) => motd.trim().slice(0, 256))
    .catch(""),
});

const minecraftItemSlot = (maxSlot: number) =>
  z.object({
    slot: z.number().int().min(0).max(maxSlot),
    type: z.string().min(1).max(128),
    amount: z.number().int().min(1).max(99),
    data: z.base64().max(MAX_MINECRAFT_ITEM_BYTES).optional(),
  });

export const minecraftInventoryData = minecraftPlayerData.extend({
  inventory: z.array(minecraftItemSlot(40)).max(41),
  enderChest: z.array(minecraftItemSlot(26)).max(27),
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

export type MinecraftInventoryData = z.infer<typeof minecraftInventoryData>;
