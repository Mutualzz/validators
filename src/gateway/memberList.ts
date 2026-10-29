import z from "zod";
import { zSnowflake } from "../reusables/snowflake";

export const MAX_MEMBER_LIST_RANGE = 100;
export const MAX_MEMBER_LIST_RANGES = 200;

const memberListRange = z
  .tuple([z.number().int().min(0), z.number().int().min(0)])
  .refine(([start, end]) => end >= start, {
    error: "Range end must be >= start",
  })
  .refine(([start, end]) => end - start < MAX_MEMBER_LIST_RANGE, {
    error: `Range must cover at most ${MAX_MEMBER_LIST_RANGE} members`,
  });

export const gatewayLazyRequestPayload = z.object({
  spaceId: zSnowflake,
  channels: z.record(
    zSnowflake,
    z.array(memberListRange).max(MAX_MEMBER_LIST_RANGES),
  ),
});

export const gatewaySubscribeUserPayload = z.object({
  userId: zSnowflake,
});
