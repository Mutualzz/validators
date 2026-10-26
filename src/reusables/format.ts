import z from "zod";

export const zFormat = z
  .string()
  .lowercase()
  .refine(
    (val) => {
      if (!val) return true;
      const lower = val.toLowerCase();
      return ["png", "webp", "avif", "jpg", "jpeg", "gif"].includes(lower);
    },
    { error: "Invalid format" },
  )
  .transform((val) => (val === "jpeg" ? "jpg" : val));
