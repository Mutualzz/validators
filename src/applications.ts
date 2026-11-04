import { z } from "zod";
import { snowflake } from "./reusables/snowflake";
import { notAllowedNames } from "./constants";
import { sanitizeDisplayText } from "./utils";

export const MAX_APPLICATIONS_PER_USER = 25;

const applicationName = z
    .string()
    .transform(sanitizeDisplayText)
    .refine((val) => val.length >= 2, {
        message: "Application name must be at least 2 characters long",
    })
    .refine((val) => val.length <= 32, {
        message: "Application name must be at most 32 characters long",
    })
    .refine((val) => !notAllowedNames.includes(val.toLowerCase()), {
        error: ({ input }) => `"${input}" is not allowed`,
    });

const applicationDescription = z
    .string()
    .transform(sanitizeDisplayText)
    .refine((val) => val.length <= 400, {
        message: "Description must be at most 400 characters",
    });

export const validateApplicationCreate = z.object({
    name: applicationName,
    description: applicationDescription.optional(),
});

export const validateApplicationUpdate = z.object({
    name: applicationName.optional(),
    description: applicationDescription.nullable().optional(),
});

export const validateApplicationParams = z.object({
    applicationId: snowflake("Invalid application ID"),
});
