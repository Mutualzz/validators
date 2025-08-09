// Regex for email validation
export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

// Regex for password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
export const pswdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
