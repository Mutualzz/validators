import z from "zod";
import { snowflake } from "../reusables/snowflake";
import { zAnimated } from "../reusables/animated";
import { zFormat } from "../reusables/format";
import { zSize } from "../reusables/size";

export const profilesGetImageParams = z.object({
  userId: snowflake("Invalid user ID"),
  asset: z.string({ error: "Invalid asset hash" }),
});

export const profilesGetImageQuery = z.object({
  format: zFormat.optional(),
  size: zSize.optional(),
  animated: zAnimated.optional(),
});

export const profilesGetFontParams = z.object({
  userId: snowflake("Invalid user ID"),
  font: z.string({ error: "Invalid font" }),
});

export const profilesGetMusicParams = z.object({
  userId: snowflake("Invalid user ID"),
  music: z.string({ error: "Invalid music" }),
});
