import z from "zod";

export const ACTIVITY_ART_MAX_BASE64_LENGTH = 96 * 1024; // 96 KB

export const gatewayActivityArtUploadPayload = z.object({
  nonce: z.string().min(1).max(64),
  image: z
    .string()
    .min(1)
    .max(ACTIVITY_ART_MAX_BASE64_LENGTH)
    .regex(/^[A-Za-z0-9+/]+={0,2}$/),
});
