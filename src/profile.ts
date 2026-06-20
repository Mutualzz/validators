import { z } from "zod";
import { validateFontFamily } from "./fonts";
import { sanitizeMarkdownText } from "./utils";

const roundPercent = (value: number) =>
  Math.round(Math.min(100, Math.max(0, value)) * 100) / 100;

const percent = z
  .number()
  .min(0, "Position must be at least 0%")
  .max(100, "Position must be at most 100%")
  .transform(roundPercent);

const profileBlockBase = z.object({
  id: z.string().min(1),
  type: z.enum([
    "header",
    "text",
    "image",
    "music",
    "links",
    "activity",
    "roles",
    "mutual",
    "divider",
    "quote",
  ]),
  x: percent,
  y: percent,
  width: percent.refine((v) => v >= 1, "Width must be at least 1%"),
  height: percent.refine((v) => v >= 1, "Height must be at least 1%"),
  zIndex: z.number().int().min(0),
});

const profileHeaderBlock = profileBlockBase.extend({
  type: z.literal("header"),
  bannerHeight: z.number().min(30).max(80).optional(),
  bannerFocusY: percent.optional(),
});

const profileTextBlock = profileBlockBase.extend({
  type: z.literal("text"),
  content: z
    .string()
    .max(2000, "Text block content must be at most 2000 characters")
    .transform(sanitizeMarkdownText),
});

const profileImageBlock = profileBlockBase.extend({
  type: z.literal("image"),
  src: z.string().min(1).max(2048),
  objectFit: z.enum(["cover", "contain"]).optional(),
});

const profileMusicBlock = profileBlockBase.extend({
  type: z.literal("music"),
  title: z.string().max(200).nullable().optional(),
  artists: z.string().max(200).nullable().optional(),
  image: z.string().max(2048).nullable().optional(),
  previewUrl: z.string().max(2048).nullable().optional(),
  trackUrl: z.string().max(2048).nullable().optional(),
  track: z
    .object({
      source: z.enum(["itunes", "deezer"]),
      id: z.string().min(1).max(128),
      name: z.string().min(1).max(300),
      artists: z.string().max(300),
      image: z.string().max(2048).nullable().optional(),
      previewUrl: z.string().max(2048).nullable().optional(),
      trackUrl: z.string().max(2048),
    })
    .nullable()
    .optional(),
});

const profileLinkItem = z.object({
  label: z.string().min(1).max(80),
  url: z.string().url().max(2048),
});

const profileLinksBlock = profileBlockBase.extend({
  type: z.literal("links"),
  links: z.array(profileLinkItem).max(8),
});

const profileActivityBlock = profileBlockBase.extend({
  type: z.literal("activity"),
  showCustomStatus: z.boolean().optional(),
});

const profileRolesBlock = profileBlockBase.extend({
  type: z.literal("roles"),
  maxRoles: z.number().int().min(1).max(12).optional(),
});

const profileMutualBlock = profileBlockBase.extend({
  type: z.literal("mutual"),
  mode: z.enum(["spaces", "friends"]),
  maxItems: z.number().int().min(1).max(12).optional(),
});

const profileDividerBlock = profileBlockBase.extend({
  type: z.literal("divider"),
  style: z.enum(["line", "dotted", "space"]).optional(),
});

const profileQuoteBlock = profileBlockBase.extend({
  type: z.literal("quote"),
  content: z
    .string()
    .max(1000, "Quote content must be at most 1000 characters")
    .transform(sanitizeMarkdownText),
  variant: z.enum(["default", "accent", "warning"]).optional(),
  attribution: z.string().max(120).nullable().optional(),
});

export const validateProfileBlock = z.discriminatedUnion("type", [
  profileHeaderBlock,
  profileTextBlock,
  profileImageBlock,
  profileMusicBlock,
  profileLinksBlock,
  profileActivityBlock,
  profileRolesBlock,
  profileMutualBlock,
  profileDividerBlock,
  profileQuoteBlock,
]);

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, "Invalid hex color")
  .nullable()
  .optional();

const assetRef = z
  .string()
  .max(2048)
  .nullable()
  .optional()
  .refine(
    (val) =>
      val == null ||
      val === "" ||
      val.startsWith("https://") ||
      /^[a-f0-9_]+$/i.test(val),
    "Must be a CDN hash or HTTPS URL",
  );

export const validateProfileUpdate = z.object({
  backgroundColor: hexColor,
  backgroundImage: assetRef,
  banner: assetRef,
  bio: z
    .string()
    .max(512, "Bio must be at most 512 characters")
    .transform((val) => sanitizeMarkdownText(val.trim()))
    .nullable()
    .optional()
    .transform((val) => (val === "" ? null : val)),
  introMusicUrl: z.preprocess(
    (val) => (val === "" ? null : val),
    z
      .union([
        z.string().url(),
        z.string().regex(/^[a-f0-9_]+$/i),
        z.null(),
      ])
      .optional(),
  ),
  introMusicTrackId: z.preprocess(
    (val) => (val === "" ? null : val),
    z.union([z.string().regex(/^\d+$/), z.null()]).optional(),
  ),
  introMusicTrackSource: z.preprocess(
    (val) => (Array.isArray(val) ? val[0] : val),
    z.enum(["itunes", "deezer"]).nullable().optional(),
  ),
  pageFontFamily: validateFontFamily,
  blocks: z.array(validateProfileBlock).max(100).optional().default([]),
});

export const validateProfileMusicSearch = z.object({
  q: z.string().trim().min(1).max(100),
  limit: z.coerce.number().int().min(1).max(20).optional().default(10),
  source: z.preprocess(
    (val) => (Array.isArray(val) ? val[0] : val),
    z.enum(["itunes", "deezer", "all"]).optional().default("all"),
  ),
});

export const validateProfileGet = z.object({
  identifier: z
    .string({ error: "Invalid user" })
    .min(1)
    .max(64)
    .transform((value) => value.trim().toLowerCase()),
});

export const profileAssetUploadTypes = [
  "banner",
  "background",
  "music",
  "font",
] as const;

export type ProfileAssetUploadType = (typeof profileAssetUploadTypes)[number];

export const validateProfileAssetUpload = z.object({
  type: z.preprocess(
    (val) => (Array.isArray(val) ? val[0] : val),
    z.enum(profileAssetUploadTypes),
  ).default("background"),
});
