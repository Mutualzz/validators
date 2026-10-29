import z from "zod";

export const zSize = z.coerce.number().int().min(1).max(4096);
