import emojiRegex from "emojibase-regex";

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
