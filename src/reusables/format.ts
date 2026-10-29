import z from "zod";

export const zFormat = z
  .string()
  .toLowerCase()
  .refine(
    (val) => {
      if (!val) return true;
      return ["png", "webp", "avif", "jpg", "jpeg", "gif"].includes(val);
    },
    { error: "Invalid format" },
  )
  .transform((val) => (val === "jpeg" ? "jpg" : val));
