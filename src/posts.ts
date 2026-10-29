import z from "zod";
import { snowflake } from "./reusables/snowflake";
import {
  cursorPaginationQuery,
  zLimit,
  zPage,
} from "./reusables/pagination";

export const postsFeedQuery = cursorPaginationQuery(25, 50);

export const postsForYouQuery = z.object({
  page: zPage,
  limit: zLimit(25, 50),
});

export const postsScheduledQuery = z.object({
  limit: zLimit(50, 100),
});

export const postCommentsGetQuery = cursorPaginationQuery(25, 50);

export const validatePostParams = z.object({
  postId: snowflake("Invalid Post ID"),
});

export const validatePostBodyPut = z.object({
  content: z
    .string()
    .max(2000, "Post cannot exceed 2000 characters")
    .trim()
    .optional(),
  scheduledFor: z.string({ error: "Invalid scheduled date" }).optional(),
  expressionIds: z
    .array(snowflake("Invalid expression ID"))
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
  postId: snowflake("Invalid Post ID"),
  commentId: snowflake("Invalid Comment ID"),
});

export const validatePostCommentBodyPut = z.object({
  content: z
    .string()
    .max(1000, "Comment cannot exceed 1000 characters")
    .trim()
    .optional(),
  expressionIds: z
    .array(snowflake("Invalid expression ID"))
    .max(3, "You can only attach up to 3 stickers")
    .optional(),
  repliedToId: snowflake("Invalid comment ID").optional(),
});

export const validatePostCommentBodyPatch = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters")
    .trim(),
});
