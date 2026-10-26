import z from "zod";
import { zAnimated } from "../reusables/animated";
import { zFormat } from "../reusables/format";

export const channelsGetIconParams = z.object({
  channelId: z.string({ error: "Invalid channel ID" }),
  icon: z.string({ error: "Invalid icon hash" }),
});

export const channelsGetIconQuery = z.object({
  format: zFormat.default("png"),
  size: z.string().optional(),
  animated: zAnimated.optional(),
});
