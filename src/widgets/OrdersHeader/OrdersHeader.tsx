interface OrdersHeaderProps {
  ordersCount: number
}

const OrdersHeader = ({ ordersCount = 0 }: OrdersHeaderProps) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <h1 className="fw-semibold">Orders / {ordersCount}</h1>
      {/* <button className="btn btn-primary align-items-center d-flex gap-1">
        <PlusIcon />
        Add Product
      </button> */}
    </div>
  )
}

export { OrdersHeader }
