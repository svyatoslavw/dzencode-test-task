import { OrderCard } from "@/entities/order"
import type { OrderModel } from "@/entities/order/model/types"

interface OrderListProps {
  orders: OrderModel[]
  selectedOrderId: number | null
  onSelectOrder: (orderId: number) => void
  setOrderToDelete: (orderId: number | null) => void
}

const OrderList = ({
  orders,
  selectedOrderId,
  onSelectOrder,
  setOrderToDelete
}: OrderListProps) => {
  return (
    <section className={selectedOrderId ? "col-12 col-xxl-6" : "col-12"}>
      <div className="overflow-auto rounded-3 border border-secondary border-opacity-25">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Приход</th>
              <th>Продукты</th>
              <th>Дата</th>
              <th>Сумма</th>
              <th className="text-end">Действия</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-body-secondary py-4">
                  Приходы не найдены
                </td>
              </tr>
            )}

            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isSelected={order.id === selectedOrderId}
                handleSelectOrder={onSelectOrder}
                setOrderToDelete={setOrderToDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export { OrderList }
