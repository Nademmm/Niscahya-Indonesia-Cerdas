import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Create products table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    images TEXT,
    description TEXT,
    specs TEXT
  )
`);

// Add images column if it doesn't exist (migration)
try {
  db.exec("ALTER TABLE products ADD COLUMN images TEXT DEFAULT '[]'");
} catch (e) {
  // Column already exists
}

// Function to seed initial data
export const seedDatabase = (initialProducts) => {
  const checkStmt = db.prepare('SELECT COUNT(*) as count FROM products');
  const { count } = checkStmt.get();

  if (count === 0) {
    const insertStmt = db.prepare(`
      INSERT INTO products (name, price, category, image, images, description, specs)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((products) => {
      for (const product of products) {
        insertStmt.run(
          product.name,
          product.price,
          product.category,
          product.image,
          JSON.stringify(product.images || []),
          product.description,
          JSON.stringify(product.specs)
        );
      }
    });

    insertMany(initialProducts);
    console.log('Database seeded with initial products.');
  }
};

export default db;
