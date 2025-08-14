// Regex for email validation
export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

// Regex for password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
export const pswdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export const colorLikeRegex =
    /^(?:#(?:[A-Fa-f0-9]{3,8})|rgb\(\s*(?:\d{1,3}\s*,){2}\s*\d{1,3}\s*\)|rgba\(\s*(?:\d{1,3}\s*,){3}\s*(?:\d*\.?\d+)\s*\)|hsl\(\s*(?:\d{1,3}\s*,){2}\s*\d{1,3}%\s*\)|hsla\(\s*(?:\d{1,3}\s*,){2}\s*\d{1,3}%\s*,\s*(?:\d*\.?\d+)\s*\))$/;
