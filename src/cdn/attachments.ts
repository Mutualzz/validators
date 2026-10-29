import z from "zod";
import { snowflake } from "../reusables/snowflake";

export const attachmentsGetParams = z.object({
  messageId: snowflake("Invalid message ID"),
  filename: z.string({ error: "Invalid filename" }),
});
