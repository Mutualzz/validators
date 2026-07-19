import emojiRegex from "emojibase-regex";
import { colorLikeRegex, colorValueRegex } from "./regexes";
import z from "zod";

const ZERO_WIDTH_CHARS = /[\u200B-\u200D\uFEFF]/g;
const UNSAFE_DISPLAY_CHARS = /[\u0000-\u001F\u007F<>\\]/g;
const UNSAFE_MARKDOWN_CONTROL_CHARS =
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export const sanitizeDisplayText = (input: string) =>
    input
        .replace(ZERO_WIDTH_CHARS, "")
        .replace(UNSAFE_DISPLAY_CHARS, "")
        .trim()
        .replace(/\s{2,}/g, " ");

export const sanitizeMarkdownText = (input: string) => {
    const preserved: string[] = [];
    const withPlaceholders = input.replace(/<a?:[^:]+:\d+>/g, (match) => {
        const index = preserved.length;
        preserved.push(match);
        return `\uE000EMOJI${index}\uE001`;
    });

    const cleaned = withPlaceholders
        .replace(ZERO_WIDTH_CHARS, "")
        .replace(UNSAFE_MARKDOWN_CONTROL_CHARS, "")
        .replace(/[<>]/g, "");

    return cleaned.replace(/\uE000EMOJI(\d+)\uE001/g, (_, index) => {
        return preserved[Number(index)] ?? "";
    });
};

// Sanitize username by trimming whitespace and replacing multiple spaces with a single space
export const sanitizeName = (input: string, toLowerCase = true) => {
    let returnValue = input
        .replace(emojiRegex, "") // remove emojis
        .replace(ZERO_WIDTH_CHARS, "") // remove zero-width
        .trim()
        .replace(/\s{2,}/g, " "); // collapse spaces

    if (toLowerCase) returnValue = returnValue.toLowerCase();

    return returnValue;
};

export const validateColor = z.string().regex(colorLikeRegex, {
    error: ({ input }) =>
        input === ""
            ? "Color cannot be empty"
            : `"${input}" is not a valid color`,
});

export const validateNonGradientColor = z.string().regex(colorValueRegex, {
    error: ({ input }) =>
        input === ""
            ? "Color cannot be empty"
            : `"${input}" is not a valid color or it cannot be a gradient`,
});
