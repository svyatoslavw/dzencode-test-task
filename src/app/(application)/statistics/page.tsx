import type { Metadata } from "next"
import { getOrdersTrend, getProductTypeDistribution, getSellerActivity } from "@/app/api/database"
import { m } from "@/shared/i18n/messages"
import { getServerLocale } from "@/shared/lib/locale"
import { ChartsPanel } from "@/widgets/ChartsPanel"
import { MapsPanel } from "@/widgets/MapsPanel"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "Statistics"
}

export default async function StatisticsPage() {
  const locale = await getServerLocale()
  const ordersTrend = getOrdersTrend()
  const productTypeDistribution = getProductTypeDistribution()
  const sellers = getSellerActivity()

  return (
    <section className="h-100 d-flex flex-column gap-4">
      <h1 className="fw-semibold mb-0">{m.statistics_header_title({}, { locale })}</h1>
      <section className="d-flex flex-column gap-3">
        <ChartsPanel
          locale={locale}
          ordersTrend={ordersTrend}
          productTypeDistribution={productTypeDistribution}
        />
      </section>

      <section className="d-flex flex-column pb-5 gap-3">
        <MapsPanel locale={locale} sellers={sellers} />
      </section>
    </section>
  )
}
