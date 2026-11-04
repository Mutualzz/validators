import z from "zod";
import { zSize } from "../reusables/size";

export const externalImageGetParams = z.object({
  signature: z
    .string({ error: "Invalid signature" })
    .regex(/^[A-Za-z0-9_-]{32}$/, { error: "Invalid signature" }),
  encoded: z
    .string({ error: "Invalid image" })
    .regex(/^[A-Za-z0-9_-]{1,2048}$/, { error: "Invalid image" }),
});

export const externalImageGetQuery = z.object({
  size: zSize.optional(),
});
