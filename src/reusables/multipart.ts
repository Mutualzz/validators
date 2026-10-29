import z from "zod";

export const zJsonString = z.string().transform((raw, ctx) => {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    ctx.issues.push({ code: "custom", message: "Invalid JSON", input: raw });
    return z.NEVER;
  }
});

const cropValue = (min: number, label: string) =>
  z
    .number()
    .min(min, { error: `Crop ${label} must be at least ${min}` })
    .transform(Math.round);

export const zCrop = z.object({
  x: cropValue(0, "x"),
  y: cropValue(0, "y"),
  width: cropValue(1, "width"),
  height: cropValue(1, "height"),
});

export const zMultipartCrop = zJsonString.pipe(zCrop);
