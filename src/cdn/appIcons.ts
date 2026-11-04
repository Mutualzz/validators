import z from "zod";
import { zFormat } from "../reusables/format";
import { zSize } from "../reusables/size";

export const appIconsGetParams = z.object({
  id: z
    .string({ error: "Invalid app icon ID" })
    .transform((val) => val.replace(/\.png$/i, ""))
    .pipe(z.string().regex(/^[a-z0-9_-]+$/i, { error: "Invalid app icon ID" })),
});

export const appIconsGetQuery = z.object({
  format: zFormat.default("png"),
  size: zSize.optional(),
});
