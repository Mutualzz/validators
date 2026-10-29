import z from "zod";
import { snowflake } from "../reusables/snowflake";
import { zAnimated } from "../reusables/animated";
import { zFormat } from "../reusables/format";
import { zSize } from "../reusables/size";

export const expressionsGetParams = z.object({
  expressionId: snowflake("Invalid expression ID"),
  assetHash: z.string({ error: "Invalid asset hash" }),
});

export const expressionsGetQuery = z.object({
  format: zFormat.optional(),
  size: zSize.optional(),
  animated: zAnimated.optional(),
});
