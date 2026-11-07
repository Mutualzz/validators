import z from "zod";

export const gatewayLyricsRequestPayload = z.object({
  nonce: z.string().min(1).max(64),
  trackName: z.string().trim().min(1).max(256),
  artistName: z.string().trim().min(1).max(256),
  durationMs: z.number().int().min(1000).max(3_600_000),
});
