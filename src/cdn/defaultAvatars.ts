import z from "zod";

export const defaultAvatarsGetParams = z.object({
  id: z.string({ error: "Invalid default avatar ID" }),
});

export const defaultAvatarsGetQuery = z.object({
  format: z.string().optional(),
  size: z.string().optional(),
  version: z.enum(["light", "dark"]).optional().default("light"),
});
