import type { ProductModel } from "@/entities/product"
import { ProductCard } from "@/entities/product"
import { m } from "@/shared/i18n/messages"
import type { Locale } from "@/shared/i18n/runtime"

interface ProductListProps {
  locale: Locale
  products: ProductModel[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
  setProductIdToDelete: (productId: number | null) => void
}

const ProductList = ({
  locale,
  products,
  hasNextPage,
  isFetchingNextPage,
  containerRef,
  setProductIdToDelete
}: ProductListProps) => {
  return (
    <section className="col-12 h-100" style={{ minHeight: 0 }}>
      <div className="rounded-3 table-responsive border border-secondary border-opacity-25 h-100 d-flex flex-column overflow-hidden">
        <table className="table align-middle app-scroll-table products-table">
          <thead className="table-light">
            <tr>
              <th>{m.products_column_name({}, { locale })}</th>
              <th>{m.products_column_type({}, { locale })}</th>
              <th>{m.products_column_stock({}, { locale })}</th>
              <th>{m.products_column_guarantee({}, { locale })}</th>
              <th>{m.products_column_condition({}, { locale })}</th>
              <th>{m.products_column_seller({}, { locale })}</th>
              <th>{m.products_column_order({}, { locale })}</th>
              <th className="text-end">{m.products_column_price({}, { locale })}</th>
              <th className="text-end">{m.products_column_date({}, { locale })}</th>
              <th className="text-end">{m.products_column_actions({}, { locale })}</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center text-body-secondary py-4">
                  {m.products_empty({}, { locale })}
                </td>
              </tr>
            )}

            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                setProductIdToDelete={setProductIdToDelete}
              />
            ))}

            {hasNextPage && (
              <tr>
                <td colSpan={10}>
                  <div ref={containerRef} className="d-flex justify-content-center py-2">
                    {isFetchingNextPage && (
                      <p className="text-body-secondary mb-0">
                        {m.products_load_more_loading({}, { locale })}
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

export { ProductList }
