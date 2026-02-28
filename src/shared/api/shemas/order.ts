import { z } from "zod"

export const createOrderSchema = z.object({
  title: z.string().trim().min(2, "Title must contain at least 2 characters"),
  description: z.string().trim().min(5, "Description must contain at least 5 characters"),
  date: z.string().min(1, "Date is required")
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
