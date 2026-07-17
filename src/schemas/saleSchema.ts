import { z } from "zod";

const numberFromForm = z.preprocess((value) => {
  if (typeof value === "string") {
    return Number(value);
  }

  return value;
}, z.number().positive());

export const createSaleSchema = z.object({
  productId: z.string().min(1),
  quantity: numberFromForm,
  amount: numberFromForm,
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;