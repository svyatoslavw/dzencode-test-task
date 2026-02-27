import type { ProductModel } from "@/entities/product/model/types"

interface ProductListProps {
  products: ProductModel[]
  setProductIdToDelete: (productId: number | null) => void
}

const formatDate = (value: string) => {
  const date = new Date(value.includes("T") ? value : value.replace(" ", "T"))

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("ru-RU").format(date)
}

const qualityLabel = (quality: "new" | "used") => (quality === "new" ? "Новый" : "БУ")

const getPriceBySymbol = (
  prices: { value: number; symbol: "USD" | "UAH" }[],
  symbol: "USD" | "UAH"
) => prices.find((price) => price.symbol === symbol)?.value

const ProductList = ({ products, setProductIdToDelete }: ProductListProps) => {
  return (
    <section className="col-12">
      <div className="overflow-auto rounded-3 border border-secondary border-opacity-25">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Название</th>
              <th>Тип</th>
              <th>Остаток</th>
              <th>Гарантия</th>
              <th>Состояние</th>
              <th>Продавец</th>
              <th>Приход</th>
              <th className="text-end">Цена</th>
              <th className="text-end">Дата</th>
              <th className="text-end">Действия</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center text-body-secondary py-4">
                  Продукты не найдены
                </td>
              </tr>
            )}

            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="fw-semibold clamp">{product.title}</div>
                </td>
                <td>
                  <div className="clamp">{product.type}</div>
                </td>
                <td>
                  <span
                    className={`badge ${product.inStock ? "text-bg-success" : "text-bg-secondary"}`}
                  >
                    {product.inStock ? "В наличии" : "Нет в наличии"}
                  </span>
                </td>
                <td>
                  <div className="d-flex flex-column text-nowrap">
                    <span className="small text-body-secondary">
                      {formatDate(product.guarantee.start)}
                    </span>
                    <span>{formatDate(product.guarantee.end)}</span>
                  </div>
                </td>
                <td>{qualityLabel(product.quality)}</td>
                <td>
                  <div className="clamp">{product.seller}</div>
                </td>
                <td>
                  <div className="clamp">{product.orderTitle}</div>
                </td>
                <td className="text-end fw-semibold">
                  <div className="d-flex flex-column text-nowrap">
                    <span className="small text-body-secondary">
                      {getPriceBySymbol(product.price, "USD") ?? "—"} USD
                    </span>
                    <span>{getPriceBySymbol(product.price, "UAH") ?? "—"} UAH</span>
                  </div>
                </td>
                <td className="text-end text-nowrap">{formatDate(product.date)}</td>
                <td className="text-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => setProductIdToDelete(product.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export { ProductList }
