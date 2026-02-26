import { ProductsHeader } from "@/widgets/ProductsHeader/ProductsHeader"
import { ProductsTable } from "@/widgets/ProductsTable/ProductsTable"

export default function ProductsPage() {
  return (
    <>
      <ProductsHeader productsCount={245} />
      <ProductsTable />
    </>
  )
}
