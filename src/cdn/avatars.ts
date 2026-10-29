import z from "zod";
import { snowflake } from "../reusables/snowflake";
import { zAnimated } from "../reusables/animated";
import { zFormat } from "../reusables/format";
import { zSize } from "../reusables/size";

export const avatarsGetParams = z.object({
  userId: snowflake("Invalid user ID"),
  avatar: z.string({ error: "Invalid avatar hash" }),
});

export const avatarsGetQuery = z.object({
  format: zFormat.optional(),
  size: zSize.optional(),
  animated: zAnimated.optional(),
});
