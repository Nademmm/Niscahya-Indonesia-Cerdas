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
    specs TEXT,
    slug TEXT UNIQUE
  )
`);

// Add slug column if it doesn't exist (migration)
try {
  db.exec("ALTER TABLE products ADD COLUMN slug TEXT");
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products (slug)");
} catch (e) {
  // Column might already exist
}

// Data Migration: Clean image paths and fill missing slugs
const migrateData = () => {
  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // 1. Fix missing slugs
  const productsWithoutSlugs = db.prepare("SELECT id, name FROM products WHERE slug IS NULL OR slug = ''").all();
  if (productsWithoutSlugs.length > 0) {
    const updateSlugStmt = db.prepare('UPDATE products SET slug = ? WHERE id = ?');
    const updateSlugs = db.transaction((items) => {
      for (const item of items) {
        // Append ID to ensure uniqueness during migration
        const baseSlug = generateSlug(item.name);
        updateSlugStmt.run(`${baseSlug}-${item.id}`, item.id);
      }
    });
    updateSlugs(productsWithoutSlugs);
    console.log(`[DB] Migrated ${productsWithoutSlugs.length} products with new unique slugs.`);
  }

  // 2. Clean /public/ from image paths
  const productsWithPublicPaths = db.prepare("SELECT id, image FROM products WHERE image LIKE '/public/%'").all();
  if (productsWithPublicPaths.length > 0) {
    const updatePathStmt = db.prepare('UPDATE products SET image = ? WHERE id = ?');
    const updatePaths = db.transaction((items) => {
      for (const item of items) {
        const newPath = item.image.replace('/public/', '/');
        updatePathStmt.run(newPath, item.id);
      }
    });
    updatePaths(productsWithPublicPaths);
    console.log(`[DB] Cleaned /public/ from ${productsWithPublicPaths.length} image paths.`);
  }
};

migrateData();

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

  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (count === 0) {
    const insertStmt = db.prepare(`
      INSERT INTO products (name, price, category, image, images, description, specs, slug)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
          JSON.stringify(product.specs),
          generateSlug(product.name)
        );
      }
    });

    insertMany(initialProducts);
    console.log('Database seeded with initial products.');
  }
};

export default db;
