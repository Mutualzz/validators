import z from "zod";
import { zSnowflake } from "../reusables/snowflake";

export const MEMBER_LIST_CHUNK_SIZE = 100;
export const MAX_MEMBER_LIST_WINDOW_CHUNKS = 5;

export const gatewayLazyRequestPayload = z.object({
  spaceId: zSnowflake,
  channelId: zSnowflake,
  chunks: z.array(z.number().int().min(0)).max(MAX_MEMBER_LIST_WINDOW_CHUNKS),
});

export const MAX_REQUESTED_MEMBER_IDS = 100;
export const MAX_MEMBER_SEARCH_RESULTS = 100;
export const MAX_ROLE_MEMBER_RESULTS = 1000;

export const gatewayRequestSpaceMembersPayload = z
  .object({
    spaceId: zSnowflake.optional(),
    nonce: z.string().min(1).max(64),
    userIds: z.array(zSnowflake).min(1).max(MAX_REQUESTED_MEMBER_IDS).optional(),
    query: z.string().trim().min(1).max(32).optional(),
    roleId: zSnowflake.optional(),
    limit: z.number().int().min(1).max(MAX_ROLE_MEMBER_RESULTS).optional(),
  })
  .refine(
    (payload) =>
      [payload.userIds, payload.query, payload.roleId].filter(
        (filter) => filter !== undefined,
      ).length === 1,
    { error: "Provide exactly one of userIds, query or roleId" },
  )
  .refine(
    (payload) => payload.spaceId !== undefined || payload.query !== undefined,
    { error: "spaceId is required unless searching by query" },
  );

export const gatewaySubscribeUserPayload = z.object({
  userId: zSnowflake,
});
