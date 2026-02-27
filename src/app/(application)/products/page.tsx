import { getPaginatedProducts } from "@/app/api/database"
import { PAGE_LIMIT } from "@/shared/api/contracts"
import { getServerLocale } from "@/shared/lib/locale"
import { ProductsHeader } from "@/widgets/ProductsHeader/ProductsHeader"
import { ProductsTable } from "@/widgets/ProductsTable/ProductsTable"

export const dynamic = "force-dynamic"

interface ProductsPageProps {
  searchParams: Promise<{ type?: string | string[] }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const locale = await getServerLocale()
  const resolvedSearchParams = await searchParams
  const rawType = Array.isArray(resolvedSearchParams.type)
    ? resolvedSearchParams.type[0]
    : resolvedSearchParams.type
  const type = rawType?.trim() ?? ""
  const initialPage = getPaginatedProducts({
    page: 1,
    limit: PAGE_LIMIT,
    type: type || undefined
  })

  return (
    <section className="h-100 d-flex flex-column gap-3" style={{ minHeight: 0 }}>
      <ProductsHeader locale={locale} productsCount={initialPage.pagination.total} />
      <div className="flex-grow-1" style={{ minHeight: 0 }}>
        <ProductsTable locale={locale} initialType={type} initialPage={initialPage} />
      </div>
    </section>
  )
}
