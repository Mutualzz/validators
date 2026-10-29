import z from "zod";
import { zSize } from "../reusables/size";

export const defaultAvatarsGetParams = z.object({
  id: z.string({ error: "Invalid default avatar ID" }),
});

export const defaultAvatarsGetQuery = z.object({
  format: z.string().optional(),
  size: zSize.optional(),
  version: z.enum(["light", "dark"]).optional().default("light"),
});
