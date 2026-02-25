import type { OrderModel } from "../model"

interface OrderCardProps {
  order: OrderModel
}

export const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <article className="card shadow-sm border-0">
      <div className="card-body">
        <h6 className="card-title mb-2">{order.title}</h6>
        <p className="mb-1">Продуктов: {order.productsCount}</p>
        <p className="mb-0 text-body-secondary small">{order.date}</p>
      </div>
    </article>
  )
}
