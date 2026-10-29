import z from "zod";

const MAX_SNOWFLAKE = 2n ** 63n - 1n;

export const snowflake = (error = "Invalid ID") =>
  z.coerce
    .string<string>()
    .trim()
    .refine((id) => /^\d{1,19}$/.test(id) && BigInt(id) <= MAX_SNOWFLAKE, {
      error,
    })
    .transform((id) => BigInt(id).toString());

export const zSnowflake = snowflake();
