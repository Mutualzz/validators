import z from "zod";
import { zSnowflake } from "../reusables/snowflake";

const zFlag = z.boolean().optional().catch(undefined);

export const gatewayVoiceStateUpdatePayload = z.object({
  spaceId: zSnowflake.nullish(),
  channelId: zSnowflake.nullish(),
  selfMute: zFlag,
  selfDeaf: zFlag,
  refreshRtc: zFlag,
  client: z
    .enum(["desktop", "mobile", "web", "minecraft"])
    .optional()
    .catch(undefined),
});

export const gatewayCallCreatePayload = z.object({
  channelId: zSnowflake,
  silent: zFlag,
  selfMute: zFlag,
  selfDeaf: zFlag,
});

export const gatewayCallRespondPayload = z.object({
  callId: zSnowflake,
  action: z.enum(["accept", "decline", "cancel"]),
  selfMute: zFlag,
  selfDeaf: zFlag,
});
