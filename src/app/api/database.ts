import fs from "node:fs"
import path from "node:path"

import Database from "better-sqlite3"

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
  photo: string
  title: string
  type: string
  specification: string
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

interface ProductRow {
  id: number
  serial_number: number
  is_new: number
  photo: string
  title: string
  type: string
  specification: string
  guarantee_start: string
  guarantee_end: string
  order_id: number
  order_title: string
  date: string
}

const DB_DIR = path.join(process.cwd(), "data")
const DB_PATH = path.join(DB_DIR, "app.db")

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
  photo: row.photo,
  title: row.title,
  type: row.type,
  specification: row.specification,
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
      photo TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      specification TEXT NOT NULL,
      guarantee_start TEXT NOT NULL,
      guarantee_end TEXT NOT NULL,
      order_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      value REAL NOT NULL,
      symbol TEXT NOT NULL CHECK(symbol IN ('USD', 'UAH')),
      is_default INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE (product_id, symbol)
    );
  `)
}

const seedInitialData = (db: Database.Database): void => {
  const hasOrders = db.prepare("SELECT COUNT(*) AS count FROM orders").get() as {
    count: number
  }

  if (hasOrders.count > 0) {
    return
  }

  const now = "2017-06-29 12:09:33"

  const insertOrder = db.prepare(
    "INSERT INTO orders(id, title, date, description) VALUES (?, ?, ?, ?)"
  )
  const insertProduct = db.prepare(
    `INSERT INTO products(
      id,
      serial_number,
      is_new,
      photo,
      title,
      type,
      specification,
      guarantee_start,
      guarantee_end,
      order_id,
      date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
  const insertPrice = db.prepare(
    "INSERT INTO product_prices(product_id, value, symbol, is_default) VALUES (?, ?, ?, ?)"
  )

  const seedTx = db.transaction(() => {
    insertOrder.run(1, "Order 1", now, "desc")
    insertOrder.run(2, "Order 2", now, "desc")
    insertOrder.run(3, "Order 3", now, "desc")

    insertProduct.run(
      1,
      1234,
      1,
      "pathToFile.jpg",
      "Product 1",
      "Monitors",
      "Specification 1",
      now,
      now,
      1,
      now
    )
    insertProduct.run(
      2,
      2567,
      1,
      "pathToFile.jpg",
      "Product 2",
      "Phones",
      "Specification 2",
      now,
      now,
      2,
      now
    )
    insertProduct.run(
      3,
      3333,
      0,
      "pathToFile.jpg",
      "Product 3",
      "Monitors",
      "Specification 3",
      now,
      now,
      1,
      now
    )
    insertProduct.run(
      4,
      4455,
      1,
      "pathToFile.jpg",
      "Product 4",
      "Accessories",
      "Specification 4",
      now,
      now,
      3,
      now
    )

    insertPrice.run(1, 100, "USD", 0)
    insertPrice.run(1, 2600, "UAH", 1)
    insertPrice.run(2, 150, "USD", 1)
    insertPrice.run(2, 3900, "UAH", 0)
    insertPrice.run(3, 120, "USD", 1)
    insertPrice.run(3, 3120, "UAH", 0)
    insertPrice.run(4, 80, "USD", 1)
    insertPrice.run(4, 2080, "UAH", 0)
  })

  seedTx()
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
  seedInitialData(database)

  return database
}

const db = initDatabase()

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

export const listOrders = (): OrderEntity[] => {
  const rows = db
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
      ORDER BY o.id`
    )
    .all() as Array<{
    id: number
    title: string
    description: string
    date: string
    productsCount: number
    totalUSD: number
    totalUAH: number
  }>

  return rows
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
        p.photo,
        p.title,
        p.type,
        p.specification,
        p.guarantee_start,
        p.guarantee_end,
        p.order_id,
        o.title AS order_title,
        p.date
      FROM products p
      JOIN orders o ON o.id = p.order_id
      WHERE p.order_id = ?
      ORDER BY p.id`
    )
    .all(orderId) as ProductRow[]

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

export const deleteOrderById = (orderId: number): boolean => {
  const result = db.prepare("DELETE FROM orders WHERE id = ?").run(orderId)
  return result.changes > 0
}

export const deleteProductById = (productId: number): boolean => {
  const result = db.prepare("DELETE FROM products WHERE id = ?").run(productId)
  return result.changes > 0
}

export const listProducts = (type?: string): ProductEntity[] => {
  const productRows = (
    type
      ? db
          .prepare(
            `SELECT
            p.id,
            p.serial_number,
            p.is_new,
            p.photo,
            p.title,
            p.type,
            p.specification,
            p.guarantee_start,
            p.guarantee_end,
            p.order_id,
            o.title AS order_title,
            p.date
          FROM products p
          JOIN orders o ON o.id = p.order_id
          WHERE p.type = ?
          ORDER BY p.id`
          )
          .all(type)
      : db
          .prepare(
            `SELECT
            p.id,
            p.serial_number,
            p.is_new,
            p.photo,
            p.title,
            p.type,
            p.specification,
            p.guarantee_start,
            p.guarantee_end,
            p.order_id,
            o.title AS order_title,
            p.date
          FROM products p
          JOIN orders o ON o.id = p.order_id
          ORDER BY p.id`
          )
          .all()
  ) as ProductRow[]

  const getPrices = db.prepare(
    "SELECT value, symbol, is_default FROM product_prices WHERE product_id = ? ORDER BY is_default DESC, id ASC"
  )

  return productRows.map((row) => {
    const prices = getPrices.all(row.id) as Array<{
      value: number
      symbol: CurrencySymbol
      is_default: number
    }>

    return mapProductRow(row, mapPriceRows(prices))
  })
}

export const listProductTypes = (): string[] => {
  const rows = db.prepare("SELECT DISTINCT type FROM products ORDER BY type ASC").all() as Array<{
    type: string
  }>

  return rows.map((row) => row.type)
}
