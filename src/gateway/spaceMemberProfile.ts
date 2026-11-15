import z from "zod";
import { zSnowflake } from "../reusables/snowflake";

export const SPACE_NICKNAME_MAX_LENGTH = 32;
export const SPACE_BIO_MAX_LENGTH = 190;
export const SPACE_PRONOUNS_MAX_LENGTH = 40;

const nonce = z.string().min(1).max(64);

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .transform((value) => (value.length > 0 ? value : null))
    .nullable()
    .optional();

const profileImageHash = z
  .string()
  .regex(/^[a-f0-9_]{8,128}$/i, "Invalid image")
  .nullable()
  .optional();

export const gatewaySpaceMemberProfileUpdatePayload = z.object({
  nonce,
  spaceId: zSnowflake,
  userId: zSnowflake.optional(),
  nickname: optionalText(SPACE_NICKNAME_MAX_LENGTH),
  bio: optionalText(SPACE_BIO_MAX_LENGTH),
  pronouns: optionalText(SPACE_PRONOUNS_MAX_LENGTH),
  avatar: profileImageHash,
  banner: profileImageHash,
});
