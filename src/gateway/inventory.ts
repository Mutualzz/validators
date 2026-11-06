import z from "zod";
import { zSnowflake } from "../reusables/snowflake";
import { bridgeInventoryEditOp } from "../minecraft";
import { MAX_SERVER_ID } from "../bridges";

const nonce = z.string().min(1).max(64);

export const gatewayNoncePayload = z.object({ nonce });

export const gatewayInventorySubscribePayload = z.object({
  bridgeId: zSnowflake,
  minecraftUuid: z.guid().transform((uuid) => uuid.toLowerCase()),
});

export const gatewayInventoryEditPayload =
  gatewayInventorySubscribePayload.extend({
    nonce,
    serverId: z.string().trim().min(1).max(MAX_SERVER_ID),
    op: bridgeInventoryEditOp,
  });

export const gatewayInventoryEditCancelPayload = z.object({
  nonce,
  bridgeId: zSnowflake,
  editId: zSnowflake,
});
