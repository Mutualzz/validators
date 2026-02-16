import emojiRegex from "emojibase-regex";
import { colorLikeRegex, colorValueRegex } from "./regexes";
import z from "zod";

// Sanitize username by trimming whitespace and replacing multiple spaces with a single space
export const sanitizeName = (input: string, toLowerCase = true) => {
    let returnValue = input
        .replace(emojiRegex, "") // remove emojis
        .replace(/[\u200B-\u200D\uFEFF]/g, "") // remove zero-width
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
