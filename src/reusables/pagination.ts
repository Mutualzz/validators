import z from "zod";
import { zSnowflake } from "./snowflake";

export const zLimit = (defaultLimit: number, max: number) =>
  z.coerce
    .number()
    .int()
    .catch(defaultLimit)
    .transform((n) => Math.max(1, Math.min(n, max)));

export const zPage = z.coerce.number().int().min(1).catch(1);

export const cursorPaginationQuery = (defaultLimit: number, max: number) =>
  z
    .object({
      before: zSnowflake.optional(),
      after: zSnowflake.optional(),
      limit: zLimit(defaultLimit, max),
    })
    .refine((q) => !(q.before && q.after), {
      error: "Cannot use both before and after",
    });
