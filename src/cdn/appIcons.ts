import z from "zod";
import { zFormat } from "../reusables/format";

export const appIconsGetParams = z.object({
  id: z
    .string({ error: "Invalid app icon ID" })
    .regex(/^[a-z0-9_-]+$/i, { error: "Invalid app icon ID" })
    .transform((val) => val.replace(/\.png$/i, "")),
});

export const appIconsGetQuery = z.object({
  format: zFormat.default("png"),
  size: z.number().optional(),
});
