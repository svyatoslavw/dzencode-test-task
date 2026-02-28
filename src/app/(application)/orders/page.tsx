import type { Metadata } from "next"
import { getPaginatedOrders } from "@/app/api/database"
import { PAGE_LIMIT } from "@/shared/api/contracts"
import { getServerLocale } from "@/shared/lib/locale"
import { OrdersHeader } from "@/widgets/OrdersHeader/OrdersHeader"
import { OrdersTable } from "@/widgets/OrdersTable/OrdersTable"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "Orders"
}

export default async function OrdersPage() {
  const locale = await getServerLocale()
  const initialPage = getPaginatedOrders({
    page: 1,
    limit: PAGE_LIMIT
  })

  return (
    <section className="h-100 d-flex flex-column gap-3" style={{ minHeight: 0 }}>
      <OrdersHeader locale={locale} ordersCount={initialPage.pagination.total} />
      <div className="flex-grow-1" style={{ minHeight: 0 }}>
        <OrdersTable locale={locale} initialPage={initialPage} />
      </div>
    </section>
  )
}
