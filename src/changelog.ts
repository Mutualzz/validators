import z from "zod";
import { snowflake } from "./reusables/snowflake";

const semverString = z
  .string()
  .trim()
  .regex(/^\d+\.\d+\.\d+$/, "Version must be semver (e.g. 1.2.3)");

export const validateChangelogUnseenQuery = z.object({
  platform: z.enum(["desktop", "mobile"]),
  version: semverString,
});

export const validateChangelogParams = z.object({
  changelogId: snowflake("Invalid changelog ID"),
});
