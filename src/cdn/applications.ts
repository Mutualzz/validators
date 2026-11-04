import z from "zod";
import { snowflake } from "../reusables/snowflake";
import { zFormat } from "../reusables/format";
import { zSize } from "../reusables/size";

export const applicationsGetIconParams = z.object({
  applicationId: snowflake("Invalid application ID"),
  icon: z
    .string({ error: "Invalid icon hash" })
    .transform((val) => val.replace(/\.[a-z]+$/i, ""))
    .pipe(z.string().regex(/^[a-f0-9]{64}$/i, { error: "Invalid icon hash" })),
});

export const applicationsGetIconQuery = z.object({
  format: zFormat.optional(),
  size: zSize.optional(),
});
