import z from "zod";
import { sanitizeDisplayText } from "./utils";

export const supportTicketCategories = [
    "account",
    "bug",
    "donations",
    "feature",
    "other",
] as const;

export const supportTicketStatuses = [
    "open",
    "awaiting_reply",
    "resolved",
    "closed",
] as const;

export const validateCreateSupportTicketBody = z.object({
    category: z.enum(supportTicketCategories, {
        error: "Invalid category",
    }),
    subject: z
        .string({ error: "Subject is required" })
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length >= 1, {
            message: "Subject is required",
        })
        .refine((val) => val.length <= 200, {
            message: "Subject must be at most 200 characters",
        }),
    message: z
        .string({ error: "A message is required" })
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length >= 1, {
            message: "A message is required",
        })
        .refine((val) => val.length <= 4000, {
            message: "Message must be at most 4000 characters",
        }),
    platform: z
        .string()
        .trim()
        .max(32, "Platform must be at most 32 characters")
        .optional(),
    appVersion: z
        .string()
        .trim()
        .max(32, "App version must be at most 32 characters")
        .optional(),
});

export const validateSupportTicketsQuery = z.object({
    status: z.enum(supportTicketStatuses).optional(),
    before: z.string().trim().optional(),
    limit: z.coerce.number().min(1).max(100).default(50),
});

export const validateSupportTicketParams = z.object({
    ticketId: z.string({ error: "Invalid ticket ID" }).trim(),
});

export const validateCreateSupportMessageBody = z.object({
    message: z
        .string({ error: "A message is required" })
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length >= 1, {
            message: "A message is required",
        })
        .refine((val) => val.length <= 4000, {
            message: "Message must be at most 4000 characters",
        }),
});

export const validateStaffSupportTicketsQuery = z.object({
    status: z.enum(supportTicketStatuses).optional(),
    category: z.enum(supportTicketCategories).optional(),
    before: z.string().trim().optional(),
    limit: z.coerce.number().min(1).max(100).default(50),
});

export const validateStaffSupportTicketUpdateBody = z
    .object({
        status: z.enum(supportTicketStatuses).optional(),
        assignedToId: z.string().trim().nullable().optional(),
    })
    .refine(
        (data) => data.status !== undefined || data.assignedToId !== undefined,
        {
            message: "Provide a status or assignee update",
        },
    );
