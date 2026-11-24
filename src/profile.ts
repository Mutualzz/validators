import {
  DISPLAY_NAME_EFFECTS,
  PROFILE_BACKGROUND_IMAGE_FITS,
  PROFILE_BLOCK_BORDER_STYLES,
  PROFILE_BLOCK_ENTRANCES,
  PROFILE_BLOCK_SHADOWS,
  PROFILE_BLOCK_TEXT_ALIGNS,
  PROFILE_EMBED_KINDS,
  PROFILE_GALLERY_LAYOUTS,
  PROFILE_GALLERY_MAX_IMAGES,
} from "@mutualzz/types";
import { z } from "zod";
import { validateFontFamily } from "./fonts";
import { validateThemeCreate } from "./theme";
import { sanitizeDisplayText, sanitizeMarkdownText } from "./utils";

const roundPercent = (value: number) =>
  Math.round(Math.min(100, Math.max(0, value)) * 100) / 100;

const percent = z
  .number()
  .min(0, "Position must be at least 0%")
  .max(100, "Position must be at most 100%")
  .transform(roundPercent);

const profileBackgroundColor = z
  .string()
  .max(512)
  .nullable()
  .optional()
  .refine(
    (val) =>
      val == null ||
      val === "" ||
      /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(val) ||
      /^linear-gradient\(.+\)$/i.test(val),
    "Must be a hex color or linear gradient",
  )
  .transform((val) => (val === "" ? null : val));

const profileTheme = z
  .object({
    sourceId: z.string().min(1).max(64),
    name: z.string().max(64),
    type: validateThemeCreate.shape.type,
    style: validateThemeCreate.shape.style,
    colors: validateThemeCreate.shape.colors,
    typographyColors: validateThemeCreate.shape.typography.shape.colors,
  })
  .nullable()
  .optional();

const profileDisplayNameStyle = z
  .object({
    color: profileBackgroundColor,
    font: validateFontFamily,
    effect: z.enum(DISPLAY_NAME_EFFECTS).nullable().optional(),
    effectColor: z
      .string()
      .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a hex color")
      .nullable()
      .optional(),
  })
  .nullable()
  .optional();

const profileBadgeSettings = z
  .object({
    order: z.array(z.string().max(32)).max(32),
    hidden: z.array(z.string().max(32)).max(32),
  })
  .nullable()
  .optional();

const profileBlockHexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a hex color")
  .nullable()
  .optional();

const profileBlockAppearance = z
  .object({
    borderWidth: z.number().int().min(0).max(8).optional(),
    borderStyle: z.enum(PROFILE_BLOCK_BORDER_STYLES).optional(),
    borderColor: profileBlockHexColor,
    shadow: z.enum(PROFILE_BLOCK_SHADOWS).nullable().optional(),
    shadowColor: profileBlockHexColor,
    opacity: z.number().int().min(20).max(100).optional(),
    blur: z.number().int().min(0).max(20).optional(),
    padding: z.number().int().min(0).max(32).optional(),
    textAlign: z.enum(PROFILE_BLOCK_TEXT_ALIGNS).optional(),
    font: validateFontFamily,
    entrance: z.enum(PROFILE_BLOCK_ENTRANCES).optional(),
    textEffect: z.enum(DISPLAY_NAME_EFFECTS).optional(),
    textEffectColor: profileBlockHexColor,
  })
  .nullable()
  .optional();

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
    "connections",
    "mutual",
    "divider",
    "quote",
    "draw",
    "sticker",
    "countdown",
    "gallery",
    "nowPlaying",
    "embed",
  ]),
  x: percent,
  y: percent,
  width: percent.refine((v) => v >= 1, "Width must be at least 1%"),
  height: percent.refine((v) => v >= 1, "Height must be at least 1%"),
  zIndex: z.number().int().min(0),
  cornerRadius: z
    .number()
    .int()
    .min(0, "Corner radius must be at least 0px")
    .max(48, "Corner radius must be at most 48px")
    .optional(),
  backgroundColor: profileBackgroundColor,
  locked: z.boolean().optional(),
  hidden: z.boolean().optional(),
  visibility: z.enum(["everyone", "friends", "nobody"]).optional(),
  groupId: z.string().min(1).max(64).optional(),
  rotation: z.number().int().min(-180).max(180).optional(),
  appearance: profileBlockAppearance,
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
  youtubeUrl: z.url().max(2048).nullable().optional(),
  audioHash: z
    .string()
    .regex(/^[a-f0-9_]+$/i)
    .max(128)
    .nullable()
    .optional(),
  track: z
    .object({
      source: z.enum(["itunes"]),
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
  showPlaying: z.boolean().optional(),
  showListening: z.boolean().optional(),
});

const profileRolesBlock = profileBlockBase.extend({
  type: z.literal("roles"),
  maxRoles: z.number().int().min(1).max(12).optional(),
});

const profileConnectionsBlock = profileBlockBase.extend({
  type: z.literal("connections"),
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

const profileDrawBlock = profileBlockBase.extend({
  type: z.literal("draw"),
  svgData: z.string().max(200000).nullable().optional(),
  paths: z.string().max(200000).nullable().optional(),
  backgroundColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/)
    .nullable()
    .optional(),
});

const profileStickerBlock = profileBlockBase.extend({
  type: z.literal("sticker"),
  expressionId: z.string().trim().min(1).max(128),
});

const profileCountdownBlock = profileBlockBase.extend({
  type: z.literal("countdown"),
  targetAt: z
    .string()
    .max(40)
    .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date"),
  title: z.string().trim().max(80).nullable().optional(),
});

const profileEmbedBlock = profileBlockBase.extend({
  type: z.literal("embed"),
  kind: z.enum(PROFILE_EMBED_KINDS),
  url: z
    .string()
    .max(2048)
    .refine((value) => {
      try {
        return new URL(value).protocol === "https:";
      } catch {
        return false;
      }
    }, "Must be an https link")
    .nullable()
    .optional(),
});

const profileNowPlayingBlock = profileBlockBase.extend({
  type: z.literal("nowPlaying"),
  hideWhenIdle: z.boolean().optional(),
});

const profileGalleryBlock = profileBlockBase.extend({
  type: z.literal("gallery"),
  images: z
    .array(z.object({ src: z.string().min(1).max(2048) }))
    .max(PROFILE_GALLERY_MAX_IMAGES),
  layout: z.enum(PROFILE_GALLERY_LAYOUTS).optional(),
});

export const validateProfileBlock = z.discriminatedUnion("type", [
  profileHeaderBlock,
  profileTextBlock,
  profileImageBlock,
  profileMusicBlock,
  profileLinksBlock,
  profileActivityBlock,
  profileRolesBlock,
  profileConnectionsBlock,
  profileMutualBlock,
  profileDividerBlock,
  profileQuoteBlock,
  profileDrawBlock,
  profileStickerBlock,
  profileCountdownBlock,
  profileGalleryBlock,
  profileNowPlayingBlock,
  profileEmbedBlock,
]);

const mobileProfileBlockBase = z.object({
  id: z.string().min(1),
  type: z.enum([
    "header",
    "text",
    "image",
    "music",
    "links",
    "activity",
    "roles",
    "connections",
    "mutual",
    "divider",
    "quote",
    "draw",
    "sticker",
  ]),
  size: z.enum(["s", "m", "l"]),
  order: z.number().int().min(0),
  cornerRadius: z
    .number()
    .int()
    .min(0, "Corner radius must be at least 0px")
    .max(48, "Corner radius must be at most 48px")
    .optional(),
  backgroundColor: profileBackgroundColor,
});

const mobileProfileHeaderBlock = mobileProfileBlockBase.extend({
  type: z.literal("header"),
  bannerHeight: z.number().min(30).max(80).optional(),
  bannerFocusY: percent.optional(),
});

const mobileProfileTextBlock = mobileProfileBlockBase.extend({
  type: z.literal("text"),
  content: z
    .string()
    .max(2000, "Text block content must be at most 2000 characters")
    .transform(sanitizeMarkdownText),
});

const profileImageCrop = z
  .object({
    x: z.number().min(0).max(1),
    y: z.number().min(0).max(1),
    width: z.number().min(0).max(1),
    height: z.number().min(0).max(1),
  })
  .refine((crop) => crop.width > 0 && crop.height > 0, {
    message: "Image crop dimensions must be greater than zero",
  });

const mobileProfileImageBlock = mobileProfileBlockBase.extend({
  type: z.literal("image"),
  src: z.string().min(1).max(2048),
  objectFit: z.enum(["cover", "contain"]).optional(),
  crop: profileImageCrop.nullable().optional(),
});

const mobileProfileMusicBlock = mobileProfileBlockBase.extend({
  type: z.literal("music"),
  title: z.string().max(200).nullable().optional(),
  artists: z.string().max(200).nullable().optional(),
  image: z.string().max(2048).nullable().optional(),
  previewUrl: z.string().max(2048).nullable().optional(),
  trackUrl: z.string().max(2048).nullable().optional(),
  youtubeUrl: z.url().max(2048).nullable().optional(),
  audioHash: z
    .string()
    .regex(/^[a-f0-9_]+$/i)
    .max(128)
    .nullable()
    .optional(),
  track: z
    .object({
      source: z.enum(["itunes"]),
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

const mobileProfileLinksBlock = mobileProfileBlockBase.extend({
  type: z.literal("links"),
  links: z.array(profileLinkItem).max(8),
});

const mobileProfileActivityBlock = mobileProfileBlockBase.extend({
  type: z.literal("activity"),
  showCustomStatus: z.boolean().optional(),
});

const mobileProfileRolesBlock = mobileProfileBlockBase.extend({
  type: z.literal("roles"),
  maxRoles: z.number().int().min(1).max(12).optional(),
});

const mobileProfileConnectionsBlock = mobileProfileBlockBase.extend({
  type: z.literal("connections"),
});

const mobileProfileMutualBlock = mobileProfileBlockBase.extend({
  type: z.literal("mutual"),
  mode: z.enum(["spaces", "friends"]),
  maxItems: z.number().int().min(1).max(12).optional(),
});

const mobileProfileDividerBlock = mobileProfileBlockBase.extend({
  type: z.literal("divider"),
  style: z.enum(["line", "dotted", "space"]).optional(),
});

const mobileProfileQuoteBlock = mobileProfileBlockBase.extend({
  type: z.literal("quote"),
  content: z
    .string()
    .max(1000, "Quote content must be at most 1000 characters")
    .transform(sanitizeMarkdownText),
  variant: z.enum(["default", "accent", "warning"]).optional(),
  attribution: z.string().max(120).nullable().optional(),
});

const mobileProfileDrawBlock = mobileProfileBlockBase.extend({
  type: z.literal("draw"),
  svgData: z.string().max(200000).nullable().optional(),
  paths: z.string().max(200000).nullable().optional(),
  backgroundColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/)
    .nullable()
    .optional(),
});

const mobileProfileStickerBlock = mobileProfileBlockBase.extend({
  type: z.literal("sticker"),
  expressionId: z.string().trim().min(1).max(128),
});

export const validateMobileProfileBlock = z.discriminatedUnion("type", [
  mobileProfileHeaderBlock,
  mobileProfileTextBlock,
  mobileProfileImageBlock,
  mobileProfileMusicBlock,
  mobileProfileLinksBlock,
  mobileProfileActivityBlock,
  mobileProfileRolesBlock,
  mobileProfileConnectionsBlock,
  mobileProfileMutualBlock,
  mobileProfileDividerBlock,
  mobileProfileQuoteBlock,
  mobileProfileDrawBlock,
  mobileProfileStickerBlock,
]);

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
  backgroundColor: profileBackgroundColor,
  backgroundImage: assetRef,
  backgroundImageFit: z
    .enum(PROFILE_BACKGROUND_IMAGE_FITS)
    .nullable()
    .optional(),
  banner: assetRef,
  bio: z
    .string()
    .max(512, "Bio must be at most 512 characters")
    .transform((val) => sanitizeMarkdownText(val.trim()))
    .nullable()
    .optional()
    .transform((val) => (val === "" ? null : val)),
  pronouns: z
    .string()
    .max(32, "Pronouns must be at most 32 characters")
    .transform((val) => sanitizeDisplayText(val))
    .nullable()
    .optional()
    .transform((val) => (val === "" ? null : val)),
  profileMusicUrl: z.preprocess(
    (val) => (val === "" ? null : val),
    z
      .union([z.string().url(), z.string().regex(/^[a-f0-9_]+$/i), z.null()])
      .optional(),
  ),
  profileMusicTrackId: z.preprocess(
    (val) => (val === "" ? null : val),
    z.union([z.string().regex(/^\d+$/), z.null()]).optional(),
  ),
  profileMusicTrackSource: z.preprocess(
    (val) => (Array.isArray(val) ? val[0] : val),
    z.enum(["itunes"]).nullable().optional(),
  ),
  profileMusicTitle: z.string().max(200).nullable().optional(),
  profileMusicAuthorName: z.string().max(200).nullable().optional(),
  pageFontFamily: validateFontFamily,
  theme: profileTheme,
  displayNameStyle: profileDisplayNameStyle,
  badgeSettings: profileBadgeSettings,
  blocks: z.array(validateProfileBlock).max(100).optional().default([]),
  mobileBlocks: z
    .array(validateMobileProfileBlock)
    .max(100)
    .optional()
    .default([]),
});

export const validateProfileMusicSearch = z.object({
  q: z.string().trim().min(1).max(100),
  limit: z.coerce.number().int().min(1).max(20).optional().default(10),
});

export const validateProfileMusicPreview = z.object({
  source: z.preprocess(
    (val) => (Array.isArray(val) ? val[0] : val),
    z.enum(["itunes"]),
  ),
  id: z.preprocess(
    (val) => (Array.isArray(val) ? val[0] : val),
    z.string().trim().min(1).max(128),
  ),
});

export const validateProfileVersionDelete = z.object({
  versionId: z.string().regex(/^\d{1,10}$/, { error: "Invalid version" }),
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
  "image",
  "music",
  "font",
] as const;

export type ProfileAssetUploadType = (typeof profileAssetUploadTypes)[number];

export const validateProfileAssetUpload = z.object({
  type: z
    .preprocess(
      (val) => (Array.isArray(val) ? val[0] : val),
      z.enum(profileAssetUploadTypes),
    )
    .default("background"),
});
