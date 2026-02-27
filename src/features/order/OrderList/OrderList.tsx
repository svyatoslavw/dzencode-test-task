import { OrderCard } from "@/entities/order"
import type { OrderModel } from "@/entities/order/model/types"
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"

interface OrderListProps {
  locale: Locale
  orders: OrderModel[]
  selectedOrderId: number | null
  hasNextPage: boolean
  isFetchingNextPage: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
  onSelectOrder: (orderId: number) => void
  setOrderToDelete: (orderId: number | null) => void
}

const OrderList = ({
  locale,
  orders,
  selectedOrderId,
  hasNextPage,
  isFetchingNextPage,
  containerRef,
  onSelectOrder,
  setOrderToDelete
}: OrderListProps) => {
  return (
    <section
      className={selectedOrderId ? "col-12 col-xxl-6 h-100" : "col-12  h-100"}
      style={{ minHeight: 0 }}
    >
      <div
        className="rounded-3 border border-secondary border-opacity-25 h-100 d-flex flex-column overflow-hidden"
        style={{ minHeight: 0 }}
      >
        <table className="table table-hover align-middle app-scroll-table">
          <thead className="table-light">
            <tr>
              <th>{m.orders_column_order({}, { locale })}</th>
              <th>{m.orders_column_products({}, { locale })}</th>
              <th>{m.orders_column_date({}, { locale })}</th>
              <th>{m.orders_column_total({}, { locale })}</th>
              <th className="text-end">{m.orders_column_actions({}, { locale })}</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-body-secondary py-4">
                  {m.orders_empty({}, { locale })}
                </td>
              </tr>
            )}

            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                locale={locale}
                isSelected={order.id === selectedOrderId}
                handleSelectOrder={onSelectOrder}
                setOrderToDelete={setOrderToDelete}
              />
            ))}

            {hasNextPage && (
              <tr>
                <td colSpan={5}>
                  <div ref={containerRef} className="d-flex justify-content-center py-2">
                    {isFetchingNextPage && (
                      <p className="text-body-secondary mb-0">
                        {m.orders_load_more_loading({}, { locale })}
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export { OrderList }
