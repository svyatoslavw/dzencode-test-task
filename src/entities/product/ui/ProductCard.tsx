import type { ProductModel } from "../model"

interface ProductCardProps {
  product: ProductModel
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article className="card shadow-sm border-0">
      <div className="card-body">
        <h6 className="card-title mb-2">{product.title}</h6>
        <p className="mb-1">Тип: {product.type}</p>
        <p className="mb-0 text-body-secondary small">Приход: {product.orderTitle}</p>
      </div>
    </article>
  )
}
