import { getPaginatedProducts } from "@/app/api/database"
import { PAGE_LIMIT } from "@/shared/api/contracts"
import { ProductsHeader } from "@/widgets/ProductsHeader/ProductsHeader"
import { ProductsTable } from "@/widgets/ProductsTable/ProductsTable"

export const dynamic = "force-dynamic"

interface ProductsPageProps {
  searchParams: Promise<{ type?: string | string[] }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
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
    <>
      <ProductsHeader productsCount={initialPage.pagination.total} />
      <ProductsTable initialType={type} initialPage={initialPage} />
    </>
  )
}
