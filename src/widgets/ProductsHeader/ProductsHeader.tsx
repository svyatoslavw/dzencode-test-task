interface ProductsHeaderProps {
  productsCount: number
}

const ProductsHeader = ({ productsCount = 0 }: ProductsHeaderProps) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <h1 className="fw-semibold">Products / {productsCount}</h1>
      {/* <button className="btn btn-primary align-items-center d-flex gap-1">
        <PlusIcon />
        Add Product
      </button> */}
    </div>
  )
}

export { ProductsHeader }
