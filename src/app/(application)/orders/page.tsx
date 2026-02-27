import { getPaginatedOrders } from "@/app/api/database"
import { PAGE_LIMIT } from "@/shared/api/contracts"
import { OrdersHeader } from "@/widgets/OrdersHeader/OrdersHeader"
import { OrdersTable } from "@/widgets/OrdersTable/OrdersTable"

export const dynamic = "force-dynamic"

export default function OrdersPage() {
  const initialPage = getPaginatedOrders({
    page: 1,
    limit: PAGE_LIMIT
  })

  return (
    <>
      <OrdersHeader ordersCount={initialPage.pagination.total} />
      <OrdersTable initialPage={initialPage} />
    </>
  )
}
