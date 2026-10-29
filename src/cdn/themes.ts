import z from "zod";
import { snowflake } from "../reusables/snowflake";
import { zAnimated } from "../reusables/animated";
import { zFormat } from "../reusables/format";
import { zSize } from "../reusables/size";

export const themesGetBackgroundParams = z.object({
  themeId: snowflake("Invalid theme ID"),
  asset: z.string({ error: "Invalid asset hash" }),
});

export const themesGetBackgroundQuery = z.object({
  format: zFormat.optional(),
  size: zSize.optional(),
  animated: zAnimated.optional(),
});
