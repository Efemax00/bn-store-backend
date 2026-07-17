import { z } from "zod";

const numberFromForm = z.preprocess((value) => {
  if (typeof value === "string") {
    const normalized = value.replace(/,/g, "").trim();

    return normalized === "" ? undefined : Number(normalized);
  }

  return value;
}, z.number().positive());

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

const notesFromForm = z.preprocess((value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((note) => note.trim())
      .filter(Boolean);
  }

  return [];
}, z.array(z.string().min(1)).default([]));



export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(120),

  manufacturer: z.string().trim().min(2).max(120),

  price: numberFromForm,

  currency: z.string().trim().length(3).default("NGN"),

  size: z.string().trim().min(2).max(120),

  stock: numberFromForm,

  type: optionalString,

  description: optionalString,

  notes: notesFromForm,
});

export type CreateProductInput = z.infer<typeof createProductSchema>;