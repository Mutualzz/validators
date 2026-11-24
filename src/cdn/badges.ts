import z from "zod";
import { zFormat } from "../reusables/format";
import { zSize } from "../reusables/size";

export const badgesGetParams = z.object({
  id: z
    .string({ error: "Invalid badge ID" })
    .regex(/^[A-Za-z]+$/, { error: "Invalid badge ID" }),
});

export const badgesGetQuery = z.object({
  format: zFormat.optional(),
  size: zSize.optional(),
});
