import z from "zod";
import { sanitizeDisplayText } from "./utils";

export const reportTargetTypes = [
    "message",
    "post",
    "comment",
    "user",
] as const;

export const reportReasons = [
    "spam",
    "harassment",
    "hate_speech",
    "nsfw",
    "self_harm",
    "impersonation",
    "misinformation",
    "other",
] as const;

export const reportStatuses = [
    "pending",
    "reviewed",
    "dismissed",
    "actioned",
] as const;

export const validateCreateReportBody = z.object({
    targetType: z.enum(reportTargetTypes, { error: "Invalid target type" }),
    targetId: z.string({ error: "Invalid target ID" }).trim(),
    reason: z.enum(reportReasons, { error: "Invalid reason" }),
    description: z
        .string()
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length <= 1000, {
            message: "Description must be at most 1000 characters",
        })
        .optional(),
});

export const validateStaffReportsQuery = z.object({
    status: z.enum(reportStatuses).optional(),
    targetType: z.enum(reportTargetTypes).optional(),
    before: z.string().trim().optional(),
    limit: z.coerce.number().min(1).max(100).default(50),
});

export const validateStaffReportParams = z.object({
    reportId: z.string({ error: "Invalid report ID" }).trim(),
});

export const validateStaffReportUpdateBody = z.object({
    status: z.enum(["reviewed", "dismissed", "actioned"], {
        error: "Invalid status",
    }),
});

export const validateStaffReportTakedownBody = z.object({
    reason: z
        .string()
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length <= 500, {
            message: "Reason must be at most 500 characters",
        })
        .optional(),
});
