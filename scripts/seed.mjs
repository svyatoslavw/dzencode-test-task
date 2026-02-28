import fs from "node:fs"
import path from "node:path"

import { faker } from "@faker-js/faker"
import Database from "better-sqlite3"

const args = process.argv.slice(2)

const readNumberFlag = (flag, fallback) => {
  const index = args.findIndex((item) => item === flag)

  if (index === -1) {
    return fallback
  }

  const value = Number(args[index + 1])

  if (!Number.isFinite(value) || value <= 0) {
    return fallback
  }

  return Math.floor(value)
}

const ORDERS_COUNT = readNumberFlag("--orders", 200)
const MIN_PRODUCTS = readNumberFlag("--min-products", 2)
const MAX_PRODUCTS = readNumberFlag("--max-products", 10)
const SEED = readNumberFlag("--seed", 2026)

if (MIN_PRODUCTS > MAX_PRODUCTS) {
  throw new Error("--min-products cannot be greater than --max-products")
}

faker.seed(SEED)

const DB_DIR = path.join(process.cwd(), "data")
const DB_PATH = path.join(DB_DIR, "app.db")

fs.mkdirSync(DB_DIR, { recursive: true })

const db = new Database(DB_PATH)
db.pragma("journal_mode = WAL")
db.pragma("foreign_keys = ON")

const createTables = () => {
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
      value REAL NOT NULL,
      symbol TEXT NOT NULL CHECK(symbol IN ('USD', 'UAH')),
      is_default INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE (product_id, symbol)
    );
  `)
}

const formatDbDate = (date) => {
  return date.toISOString().slice(0, 19).replace("T", " ")
}

const PRODUCT_TYPES = [
  "Monitors",
  "Phones",
  "Laptops",
  "Accessories",
  "Tablets",
  "Printers",
  "Scanners",
  "Audio"
]

const seedDatabase = () => {
  createTables()

  const deleteTx = db.transaction(() => {
    db.prepare("DELETE FROM product_prices").run()
    db.prepare("DELETE FROM products").run()
    db.prepare("DELETE FROM orders").run()
  })

  deleteTx()

  const insertOrder = db.prepare(
    "INSERT INTO orders(id, title, date, description) VALUES (?, ?, ?, ?)"
  )

  const insertProduct = db.prepare(
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
  )

  const insertPrice = db.prepare(
    "INSERT INTO product_prices(product_id, value, symbol, is_default) VALUES (?, ?, ?, ?)"
  )

  let productId = 1
  let totalProducts = 0

  const insertTx = db.transaction(() => {
    for (let orderId = 1; orderId <= ORDERS_COUNT; orderId += 1) {
      const orderDate = faker.date.between({
        from: "2017-01-01T00:00:00.000Z",
        to: "2026-02-26T23:59:59.000Z"
      })

      const orderTitle = `Order ${orderId}: ${faker.commerce.productName()}`
      const orderDescription = faker.commerce.productDescription()

      insertOrder.run(orderId, orderTitle, formatDbDate(orderDate), orderDescription)

      const productsInOrder = faker.number.int({ min: MIN_PRODUCTS, max: MAX_PRODUCTS })

      for (let index = 0; index < productsInOrder; index += 1) {
        const productType = faker.helpers.arrayElement(PRODUCT_TYPES)
        const purchaseDate = faker.date.between({
          from: orderDate,
          to: "2026-02-26T23:59:59.000Z"
        })

        const guaranteeStart = faker.date.between({
          from: purchaseDate,
          to: "2026-02-26T23:59:59.000Z"
        })
        const guaranteeEnd = faker.date.future({ years: 3, refDate: guaranteeStart })

        const usdPrice = Number(faker.commerce.price({ min: 60, max: 5000, dec: 2 }))
        const uahPrice = usdPrice * 42
        const defaultSymbol = faker.helpers.arrayElement(["USD", "UAH"])
        const inStock = faker.number.int({ min: 1, max: 10 }) <= 8 ? 1 : 0
        const quality = faker.helpers.arrayElement(["new", "used"])

        insertProduct.run(
          productId,
          faker.number.int({ min: 100000, max: 9999999 }),
          quality === "new" ? 1 : 0,
          inStock,
          quality,
          faker.person.fullName(),
          faker.image.url(),
          faker.commerce.productName(),
          productType,
          formatDbDate(guaranteeStart),
          formatDbDate(guaranteeEnd),
          orderId,
          formatDbDate(purchaseDate)
        )

        insertPrice.run(productId, usdPrice, "USD", defaultSymbol === "USD" ? 1 : 0)
        insertPrice.run(productId, uahPrice, "UAH", defaultSymbol === "UAH" ? 1 : 0)

        productId += 1
        totalProducts += 1
      }
    }
  })

  insertTx()

  return {
    ordersCount: ORDERS_COUNT,
    productsCount: totalProducts,
    seed: SEED
  }
}

const result = seedDatabase()

console.log(
  `Seed completed: ${result.ordersCount} orders, ${result.productsCount} products (seed=${result.seed}).`
)
