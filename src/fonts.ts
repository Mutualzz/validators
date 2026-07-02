import { z } from "zod";

const CUSTOM_FONT_HASH_RE = /^font:[a-f0-9]{64}(?:\.(?:woff2|woff|ttf|otf))?$/i;
const WEB_FONT_FAMILY_RE = /^[\p{L}\p{N}][\p{L}\p{N} '&.,-]{0,78}$/u;

export function isCustomFontRef(value: string) {
  return CUSTOM_FONT_HASH_RE.test(value);
}

export function isValidWebFontFamilyName(value: string) {
  const trimmed = value.trim();
  return trimmed.length >= 1 && trimmed.length <= 80 && WEB_FONT_FAMILY_RE.test(trimmed);
}

export function isValidFontFamily(value: string | null | undefined) {
  if (!value) return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (isCustomFontRef(trimmed)) return true;
  return isValidWebFontFamilyName(trimmed);
}

/** @deprecated Use isValidFontFamily */
export function isAllowedGoogleFontFamily(value: string | null | undefined) {
  return isValidFontFamily(value);
}

export const validateFontFamily = z
  .string()
  .trim()
  .max(80)
  .nullable()
  .optional()
  .refine((value) => isValidFontFamily(value), {
    message: "Invalid font family",
  });

/** @deprecated Use validateFontFamily */
export const validateGoogleFontFamily = validateFontFamily;
