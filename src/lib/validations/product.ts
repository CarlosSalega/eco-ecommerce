import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(2, "El nombre es requerido"),
  description: z.string().optional(),
  price: z.union([
    z.string().min(1, "El precio es requerido"),
    z.number().min(0, "El precio debe ser mayor o igual a 0"),
  ]),
  stock: z.union([
    z.string().min(1, "El stock es requerido"),
    z.number().min(0, "El stock debe ser mayor o igual a 0"),
  ]),
  categoryId: z.string().optional(),
  images: z.any().optional(),
  isActive: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
