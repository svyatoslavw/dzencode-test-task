import fs from "node:fs"
import path from "node:path"

import Database from "better-sqlite3"
import { PAGE_LIMIT } from "@/shared/api/contracts"

export type CurrencySymbol = "USD" | "UAH"

export interface UserRecord {
  id: number
  email: string
  name: string
  passwordHash: string
  createdAt: string
}

export interface PublicUser {
  id: number
  email: string
  name: string
  createdAt: string
}

export interface ProductPrice {
  value: number
  symbol: CurrencySymbol
  isDefault: boolean
}

export interface ProductEntity {
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
  price: ProductPrice[]
}

export interface OrderEntity {
  id: number
  title: string
  description: string
  date: string
  productsCount: number
  totalUSD: number
  totalUAH: number
}

export interface OrderDetails extends OrderEntity {
  products: ProductEntity[]
}

export interface OrdersTrendPoint {
  date: string
  count: number
}

export interface ProductTypeDistributionPoint {
  type: string
  count: number
}

export interface SellerActivityPoint {
  seller: string
  count: number
}

interface PaginationParams {
  page: number
  limit: number
}

interface ListProductsParams extends PaginationParams {
  type?: string
  orderId?: number
}

interface CreateOrderParams {
  title: string
  description: string
  date: string
}

interface CreateProductParams {
  imageUrl: string
  title: string
  type: string
  quality: "new" | "used"
  stock: boolean
  guaranteeStart: string
  guaranteeEnd: string
  seller: string
  date: string
  price: number
  currency: CurrencySymbol
  orderId: number
}

interface PaginatedResult<TData> {
  data: TData[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
    nextPage: number | null
  }
}

interface ProductRow {
  id: number
  serial_number: number
  is_new: number
  in_stock: number
  quality: string
  seller: string
  photo: string
  title: string
  type: string
  guarantee_start: string
  guarantee_end: string
  order_id: number
  order_title: string
  date: string
}

const DB_DIR = path.join(process.cwd(), "data")
const DB_PATH = path.join(DB_DIR, "app.db")

const formatDateInput = (date: string): string => `${date} 00:00:00`

let database: Database.Database | null = null

const mapUser = (user: {
  id: number
  email: string
  name: string
  password_hash: string
  created_at: string
}): UserRecord => ({
  id: user.id,
  email: user.email,
  name: user.name,
  passwordHash: user.password_hash,
  createdAt: user.created_at
})

const mapPriceRows = (
  rows: Array<{ value: number; symbol: CurrencySymbol; is_default: number }>
): ProductPrice[] => {
  return rows.map((row) => ({
    value: row.value,
    symbol: row.symbol,
    isDefault: Boolean(row.is_default)
  }))
}

const mapProductRow = (row: ProductRow, prices: ProductPrice[]): ProductEntity => ({
  id: row.id,
  serialNumber: row.serial_number,
  isNew: Boolean(row.is_new),
  inStock: Boolean(row.in_stock),
  quality: row.quality === "used" ? "used" : "new",
  seller: row.seller,
  photo: row.photo,
  title: row.title,
  type: row.type,
  guarantee: {
    start: row.guarantee_start,
    end: row.guarantee_end
  },
  order: row.order_id,
  orderTitle: row.order_title,
  date: row.date,
  price: prices
})

const createTables = (db: Database.Database): void => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      serial_number INTEGER NOT NULL,
      is_new INTEGER NOT NULL,
      in_stock INTEGER NOT NULL DEFAULT 1,
      quality TEXT NOT NULL DEFAULT 'new',
      seller TEXT NOT NULL DEFAULT 'Unknown seller',
      photo TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      guarantee_start TEXT NOT NULL,
      guarantee_end TEXT NOT NULL,
      order_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      value INTEGER NOT NULL,
      symbol TEXT NOT NULL CHECK(symbol IN ('USD', 'UAH')),
      is_default INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE (product_id, symbol)
    );
  `)
}

const initDatabase = (): Database.Database => {
  if (database) {
    return database
  }

  fs.mkdirSync(DB_DIR, { recursive: true })

  database = new Database(DB_PATH)
  database.pragma("journal_mode = WAL")
  database.pragma("foreign_keys = ON")

  createTables(database)

  return database
}

const db = initDatabase()

const normalizePagination = ({ page, limit }: PaginationParams) => {
  const safePage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1
  const safeLimit = Number.isFinite(limit) ? Math.min(100, Math.max(1, Math.floor(limit))) : 20

  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit
  }
}

const buildProductsWhere = ({ type, orderId }: { type?: string; orderId?: number }) => {
  const conditions: string[] = []
  const params: Array<string | number> = []

  if (type) {
    conditions.push("p.type = ?")
    params.push(type)
  }

  if (orderId) {
    conditions.push("p.order_id = ?")
    params.push(orderId)
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
    params
  }
}

const createPaginationMeta = ({
  page,
  limit,
  total
}: {
  page: number
  limit: number
  total: number
}) => {
  const hasMore = page * limit < total

  return {
    page,
    limit,
    total,
    hasMore,
    nextPage: hasMore ? page + 1 : null
  }
}

export const toPublicUser = (user: UserRecord): PublicUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  createdAt: user.createdAt
})

export const findUserByEmail = (email: string): UserRecord | null => {
  const user = db
    .prepare("SELECT id, email, name, password_hash, created_at FROM users WHERE email = ?")
    .get(email) as
    | {
        id: number
        email: string
        name: string
        password_hash: string
        created_at: string
      }
    | undefined

  return user ? mapUser(user) : null
}

export const findUserById = (id: number): UserRecord | null => {
  const user = db
    .prepare("SELECT id, email, name, password_hash, created_at FROM users WHERE id = ?")
    .get(id) as
    | {
        id: number
        email: string
        name: string
        password_hash: string
        created_at: string
      }
    | undefined

  return user ? mapUser(user) : null
}

export const createUser = (params: {
  email: string
  name: string
  passwordHash: string
}): UserRecord => {
  const createdAt = new Date().toISOString()
  const result = db
    .prepare("INSERT INTO users(email, name, password_hash, created_at) VALUES (?, ?, ?, ?)")
    .run(params.email, params.name, params.passwordHash, createdAt)

  const id = Number(result.lastInsertRowid)
  const user = findUserById(id)

  if (!user) {
    throw new Error("Failed to create user")
  }

  return user
}

export const getPaginatedOrders = ({
  page,
  limit
}: PaginationParams): PaginatedResult<OrderEntity> => {
  const { page: safePage, limit: safeLimit, offset } = normalizePagination({ page, limit })

  const totalRow = db.prepare("SELECT COUNT(*) AS total FROM orders").get() as { total: number }
  const total = totalRow.total

  const data = db
    .prepare(
      `SELECT
        o.id,
        o.title,
        o.description,
        o.date,
        COUNT(DISTINCT p.id) AS productsCount,
        COALESCE(SUM(CASE WHEN pp.symbol = 'USD' THEN pp.value END), 0) AS totalUSD,
        COALESCE(SUM(CASE WHEN pp.symbol = 'UAH' THEN pp.value END), 0) AS totalUAH
      FROM orders o
      LEFT JOIN products p ON p.order_id = o.id
      LEFT JOIN product_prices pp ON pp.product_id = p.id
      GROUP BY o.id
      ORDER BY o.date DESC, o.id DESC
      LIMIT ? OFFSET ?`
    )
    .all(safeLimit, offset) as Array<{
    id: number
    title: string
    description: string
    date: string
    productsCount: number
    totalUSD: number
    totalUAH: number
  }>

  return {
    data,
    pagination: createPaginationMeta({
      page: safePage,
      limit: safeLimit,
      total
    })
  }
}

export const getOrderDetails = (orderId: number): OrderDetails | null => {
  const order = db
    .prepare(
      `SELECT
        o.id,
        o.title,
        o.description,
        o.date,
        COUNT(DISTINCT p.id) AS productsCount,
        COALESCE(SUM(CASE WHEN pp.symbol = 'USD' THEN pp.value END), 0) AS totalUSD,
        COALESCE(SUM(CASE WHEN pp.symbol = 'UAH' THEN pp.value END), 0) AS totalUAH
      FROM orders o
      LEFT JOIN products p ON p.order_id = o.id
      LEFT JOIN product_prices pp ON pp.product_id = p.id
      WHERE o.id = ?
      GROUP BY o.id`
    )
    .get(orderId) as OrderEntity | undefined

  if (!order) {
    return null
  }

  const productRows = db
    .prepare(
      `SELECT
        p.id,
        p.serial_number,
        p.is_new,
        p.in_stock,
        p.quality,
        p.seller,
        p.photo,
        p.title,
        p.type,
        p.guarantee_start,
        p.guarantee_end,
        p.order_id,
        o.title AS order_title,
        p.date
      FROM products p
      JOIN orders o ON o.id = p.order_id
      WHERE p.order_id = ?
      ORDER BY p.date DESC, p.id DESC
      LIMIT ?`
    )
    .all(orderId, PAGE_LIMIT) as ProductRow[]

  const getPrices = db.prepare(
    "SELECT value, symbol, is_default FROM product_prices WHERE product_id = ? ORDER BY is_default DESC, id ASC"
  )

  const products = productRows.map((row) => {
    const prices = getPrices.all(row.id) as Array<{
      value: number
      symbol: CurrencySymbol
      is_default: number
    }>

    return mapProductRow(row, mapPriceRows(prices))
  })

  return {
    ...order,
    products
  }
}

export const orderExistsById = (orderId: number): boolean => {
  const row = db.prepare("SELECT id FROM orders WHERE id = ?").get(orderId) as
    | { id: number }
    | undefined

  return Boolean(row)
}

export const createOrder = ({ title, description, date }: CreateOrderParams): number => {
  const nextIdRow = db.prepare("SELECT COALESCE(MAX(id), 0) + 1 AS id FROM orders").get() as {
    id: number
  }

  db.prepare("INSERT INTO orders(id, title, date, description) VALUES (?, ?, ?, ?)").run(
    nextIdRow.id,
    title,
    formatDateInput(date),
    description
  )

  return nextIdRow.id
}

export const createProduct = ({
  imageUrl,
  title,
  type,
  quality,
  stock,
  guaranteeStart,
  guaranteeEnd,
  seller,
  date,
  price,
  currency,
  orderId
}: CreateProductParams): number | null => {
  const UAH_RATE = 42
  const toCents = (amount: number) => Math.round(amount * 100)
  const targetOrderId = orderExistsById(orderId) ? orderId : null

  if (!targetOrderId) {
    return null
  }

  const nextIdRow = db.prepare("SELECT COALESCE(MAX(id), 0) + 1 AS id FROM products").get() as {
    id: number
  }
  const productId = nextIdRow.id
  const serialNumber = Number(`${Date.now()}${productId}`.slice(-7))
  const normalizedSeller = seller.trim() || "Unknown seller"
  const normalizedPriceCents = toCents(price)
  const normalizedPriceUSD =
    currency === "USD" ? normalizedPriceCents : Math.round(normalizedPriceCents / UAH_RATE)
  const normalizedPriceUAH =
    currency === "UAH" ? normalizedPriceCents : normalizedPriceCents * UAH_RATE

  const insertTx = db.transaction(() => {
    db.prepare(
      `INSERT INTO products(
        id,
        serial_number,
        is_new,
        in_stock,
        quality,
        seller,
        photo,
        title,
        type,
        guarantee_start,
        guarantee_end,
        order_id,
        date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      productId,
      serialNumber,
      quality === "new" ? 1 : 0,
      stock ? 1 : 0,
      quality,
      normalizedSeller,
      imageUrl,
      title,
      type,
      formatDateInput(guaranteeStart),
      formatDateInput(guaranteeEnd),
      targetOrderId,
      formatDateInput(date)
    )

    const insertPrice = db.prepare(
      "INSERT INTO product_prices(product_id, value, symbol, is_default) VALUES (?, ?, ?, ?)"
    )

    insertPrice.run(productId, normalizedPriceUSD, "USD", 1)
    insertPrice.run(productId, normalizedPriceUAH, "UAH", 0)
  })

  insertTx()

  return productId
}

export const deleteOrderById = (orderId: number): boolean => {
  const result = db.prepare("DELETE FROM orders WHERE id = ?").run(orderId)
  return result.changes > 0
}

export const deleteProductById = (productId: number): boolean => {
  const result = db.prepare("DELETE FROM products WHERE id = ?").run(productId)
  return result.changes > 0
}

export const getPaginatedProducts = ({
  type,
  orderId,
  page,
  limit
}: ListProductsParams): PaginatedResult<ProductEntity> => {
  const { page: safePage, limit: safeLimit, offset } = normalizePagination({ page, limit })
  const { whereClause, params } = buildProductsWhere({ type, orderId })
  const totalRow = db
    .prepare(`SELECT COUNT(*) AS total FROM products p ${whereClause}`)
    .get(...params) as {
    total: number
  }
  const total = totalRow.total

  const productRows = db
    .prepare(
      `SELECT
        p.id,
        p.serial_number,
        p.is_new,
        p.in_stock,
        p.quality,
        p.seller,
        p.photo,
        p.title,
        p.type,
        p.guarantee_start,
        p.guarantee_end,
        p.order_id,
        o.title AS order_title,
        p.date
      FROM products p
      JOIN orders o ON o.id = p.order_id
      ${whereClause}
      ORDER BY p.date DESC, p.id DESC
      LIMIT ? OFFSET ?`
    )
    .all(...params, safeLimit, offset) as ProductRow[]

  const getPrices = db.prepare(
    "SELECT value, symbol, is_default FROM product_prices WHERE product_id = ? ORDER BY is_default DESC, id ASC"
  )

  const data = productRows.map((row) => {
    const prices = getPrices.all(row.id) as Array<{
      value: number
      symbol: CurrencySymbol
      is_default: number
    }>

    return mapProductRow(row, mapPriceRows(prices))
  })

  return {
    data,
    pagination: createPaginationMeta({
      page: safePage,
      limit: safeLimit,
      total
    })
  }
}

export const getProductTypes = (): string[] => {
  const rows = db.prepare("SELECT DISTINCT type FROM products ORDER BY type ASC").all() as Array<{
    type: string
  }>

  return rows.map((row) => row.type)
}

export const getOrdersTrend = (limit = 14): OrdersTrendPoint[] => {
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.floor(limit)) : 14
  const rows = db
    .prepare(
      `SELECT
        substr(o.date, 1, 10) AS date,
        COUNT(*) AS count
      FROM orders o
      GROUP BY substr(o.date, 1, 10)
      ORDER BY date DESC
      LIMIT ?`
    )
    .all(safeLimit) as OrdersTrendPoint[]

  return rows.reverse()
}

export const getProductTypeDistribution = (limit = 8): ProductTypeDistributionPoint[] => {
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.floor(limit)) : 8

  return db
    .prepare(
      `SELECT
        p.type AS type,
        COUNT(*) AS count
      FROM products p
      GROUP BY p.type
      ORDER BY count DESC, type ASC
      LIMIT ?`
    )
    .all(safeLimit) as ProductTypeDistributionPoint[]
}

export const getSellerActivity = (limit = 12): SellerActivityPoint[] => {
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.floor(limit)) : 12

  return db
    .prepare(
      `SELECT
        p.seller AS seller,
        COUNT(*) AS count
      FROM products p
      GROUP BY p.seller
      ORDER BY count DESC, seller ASC
      LIMIT ?`
    )
    .all(safeLimit) as SellerActivityPoint[]
}
