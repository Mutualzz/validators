import { z } from "zod";

const CUSTOM_FONT_HASH_RE = /^font:[a-f0-9]{64}(?:\.(?:woff2|woff|ttf|otf))?$/i;
const WEB_FONT_FAMILY_RE = /^[\p{L}\p{N}][\p{L}\p{N} '&.,-]{0,78}$/u;

export function isCustomFontRef(value: string) {
  return CUSTOM_FONT_HASH_RE.test(value);
}

export function normalizeFontFamilyName(value: string | null | undefined) {
  if (value == null) return value;
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (isCustomFontRef(trimmed)) return trimmed;

  const match = trimmed.match(/'([^']+)'|"([^"]+)"/);
  if (match?.[1] || match?.[2]) return (match[1] ?? match[2])!.trim();

  if (trimmed.includes(",")) {
    return trimmed.split(",")[0]!.trim().replace(/^["']|["']$/g, "");
  }

  return trimmed;
}

export function isValidWebFontFamilyName(value: string) {
  const trimmed = value.trim();
  return (
    trimmed.length >= 1 &&
    trimmed.length <= 80 &&
    WEB_FONT_FAMILY_RE.test(trimmed)
  );
}

export function isValidFontFamily(value: string | null | undefined) {
  if (!value) return true;
  const normalized = normalizeFontFamilyName(value);
  if (!normalized) return true;
  if (isCustomFontRef(normalized)) return true;
  return isValidWebFontFamilyName(normalized);
}

export function isAllowedGoogleFontFamily(value: string | null | undefined) {
  return isValidFontFamily(value);
}

export const validateFontFamily = z.preprocess(
  (value) =>
    typeof value === "string" ? normalizeFontFamilyName(value) : value,
  z
    .string()
    .trim()
    .max(80)
    .nullable()
    .optional()
    .refine((value) => isValidFontFamily(value), {
      message: "Invalid font family",
    }),
);
export const validateGoogleFontFamily = validateFontFamily;
