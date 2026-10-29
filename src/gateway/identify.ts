import z from "zod";

export const gatewayIdentifyPayload = z.object({
  token: z.string().min(1).max(512),
});

export const gatewayResumePayload = z.object({
  token: z.string().min(1).max(512),
  sessionId: z.uuid(),
  seq: z.number().int().min(0).nullish(),
});
