import { OrdersHeader } from "@/widgets/OrdersHeader/OrdersHeader"
import { OrdersTable } from "@/widgets/OrdersTable/OrdersTable"

export default function OrdersPage() {
  return (
    <>
      <OrdersHeader ordersCount={348} />
      <OrdersTable />
    </>
  )
}
