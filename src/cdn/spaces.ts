import z from "zod";
import { snowflake } from "../reusables/snowflake";
import { zAnimated } from "../reusables/animated";
import { zFormat } from "../reusables/format";
import { zSize } from "../reusables/size";

export const spacesGetIconParams = z.object({
  spaceId: snowflake("Invalid space ID"),
  icon: z.string({ error: "Invalid icon hash" }),
});

export const spacesGetIconQuery = z.object({
  format: zFormat.optional(),
  size: zSize.optional(),
  animated: zAnimated.optional(),
});
