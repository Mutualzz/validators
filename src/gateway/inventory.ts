import z from "zod";
import { zSnowflake } from "../reusables/snowflake";

export const gatewayInventorySubscribePayload = z.object({
  bridgeId: zSnowflake,
  minecraftUuid: z.guid().transform((uuid) => uuid.toLowerCase()),
});
