export type CurrencySymbol = "USD" | "UAH"

export interface ProductPriceModel {
  value: number
  symbol: CurrencySymbol
  isDefault: boolean
}

export interface ProductModel {
  id: number
  serialNumber: number
  isNew: boolean
  inStock: boolean
  quality: "new" | "used"
  seller: string
  photo: string
  title: string
  type: string
  guarantee: {
    start: string
    end: string
  }
  order: number
  orderTitle: string
  date: string
  price: ProductPriceModel[]
}
