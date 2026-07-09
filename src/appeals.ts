import z from "zod";
import { sanitizeDisplayText } from "./utils";

export const appealStatuses = ["pending", "accepted", "rejected"] as const;

export const validateCreateAppealBody = z.object({
    token: z.string({ error: "Invalid or expired appeal link" }).trim().min(1),
    message: z
        .string({ error: "A message is required" })
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length >= 1, {
            message: "A message is required",
        })
        .refine((val) => val.length <= 2000, {
            message: "Message must be at most 2000 characters",
        }),
});

export const validateStaffAppealsQuery = z.object({
    status: z.enum(appealStatuses).optional(),
    before: z.string().trim().optional(),
    limit: z.coerce.number().min(1).max(100).default(50),
});

export const validateStaffAppealParams = z.object({
    appealId: z.string({ error: "Invalid appeal ID" }).trim(),
});

export const validateStaffAppealUpdateBody = z.object({
    status: z.enum(["accepted", "rejected"], {
        error: "Invalid status",
    }),
    staffResponse: z
        .string()
        .trim()
        .transform(sanitizeDisplayText)
        .refine((val) => val.length <= 1000, {
            message: "Response must be at most 1000 characters",
        })
        .optional(),
});
