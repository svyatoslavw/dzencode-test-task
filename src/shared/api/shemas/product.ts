import { z } from "zod"

export const PRODUCT_TYPES = [
  "Monitors",
  "Phones",
  "Laptops",
  "Accessories",
  "Tablets",
  "Printers",
  "Scanners",
  "Audio"
] as const

export const PRODUCT_PRICE_CURRENCIES = ["USD", "UAH"] as const

export const createProductSchema = z
  .object({
    imageUrl: z.string().trim().url("Image URL must be valid"),
    title: z.string().trim().min(2, "Title must contain at least 2 characters"),
    type: z.enum(PRODUCT_TYPES),
    quality: z.enum(["new", "used"]),
    stock: z.boolean(),
    guaranteeStart: z.string().min(1, "Guarantee start date is required"),
    guaranteeEnd: z.string().min(1, "Guarantee end date is required"),
    seller: z.string().trim().min(2, "Seller must contain at least 2 characters"),
    date: z.string().min(1, "Date is required"),
    price: z.number().positive("Price must be greater than 0"),
    currency: z.enum(PRODUCT_PRICE_CURRENCIES),
    orderId: z.number().int().positive("Order ID must be a positive number")
  })
  .refine((values) => values.guaranteeEnd >= values.guaranteeStart, {
    path: ["guaranteeEnd"],
    message: "Guarantee end date must be after start date"
  })

export type CreateProductInput = z.infer<typeof createProductSchema>
