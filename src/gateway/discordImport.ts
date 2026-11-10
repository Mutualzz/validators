import z from "zod";
import { validateDiscordImportExecute } from "../auth";

export const gatewayDiscordImportExecutePayload =
  validateDiscordImportExecute.extend({
    nonce: z.string().min(1).max(64),
  });
