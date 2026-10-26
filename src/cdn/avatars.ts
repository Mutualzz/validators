import z from "zod";
import { zAnimated } from "../reusables/animated";
import { zFormat } from "../reusables/format";

export const avatarsGetParams = z.object({
  userId: z.string({ error: "Invalid user ID" }),
  avatar: z.string({ error: "Invalid avatar hash" }),
});

export const avatarsGetQuery = z.object({
  format: zFormat.default("png"),
  size: z.number().optional(),
  animated: zAnimated.optional(),
});
