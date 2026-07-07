import z from "zod";

export const validatePostParams = z.object({
  postId: z.string({ error: "Invalid Post ID" }),
});

export const validatePostBodyPut = z.object({
  content: z
    .string()
    .max(2000, "Post cannot exceed 2000 characters")
    .trim()
    .optional(),
  scheduledFor: z.string({ error: "Invalid scheduled date" }).optional(),
  expressionIds: z
    .array(z.string({ error: "Invalid expression ID" }))
    .max(3, "You can only attach up to 3 stickers")
    .optional(),
});

export const validatePostBodyPatch = z.object({
  content: z
    .string()
    .max(2000, "Post cannot exceed 2000 characters")
    .trim()
    .optional(),
  scheduledFor: z
    .string({ error: "Invalid scheduled date" })
    .nullable()
    .optional(),
});

export const validatePostCommentParams = z.object({
  postId: z.string({ error: "Invalid Post ID" }),
  commentId: z.string({ error: "Invalid Comment ID" }),
});

export const validatePostCommentBodyPut = z.object({
  content: z
    .string()
    .max(1000, "Comment cannot exceed 1000 characters")
    .trim()
    .optional(),
  expressionIds: z
    .array(z.string({ error: "Invalid expression ID" }))
    .max(3, "You can only attach up to 3 stickers")
    .optional(),
  repliedToId: z.string({ error: "Invalid comment ID" }).optional(),
});

export const validatePostCommentBodyPatch = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters")
    .trim(),
});
