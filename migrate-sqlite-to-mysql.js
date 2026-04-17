import sqlite3 from 'sqlite3';
import mysql from 'mysql2/promise';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlitePath = join(__dirname, 'database.sqlite');

const migrateData = async () => {
  let connection;
  try {
    // Open SQLite database
    const db = new sqlite3.Database(sqlitePath, (err) => {
      if (err) {
        console.error('[MIGRATE] Error opening SQLite:', err.message);
        process.exit(1);
      }
    });

    // Read all products from SQLite
    db.all('SELECT * FROM products', async (err, rows) => {
      if (err) {
        console.error('[MIGRATE] Error reading SQLite:', err.message);
        process.exit(1);
      }

      console.log(`[MIGRATE] Found ${rows.length} products in SQLite`);

      try {
        // Connect to MySQL
        connection = await mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'niscahya_indonesia_cerdas',
          port: process.env.DB_PORT || 3306
        });

        console.log('[MIGRATE] Connected to MySQL');

        // Insert each product
        let count = 0;
        for (const product of rows) {
          try {
            await connection.execute(
              `INSERT INTO products (id, name, price, category, image, images, description, specs, slug, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
              [
                product.id,
                product.name,
                product.price,
                product.category,
                product.image,
                product.images || '[]',
                product.description,
                product.specs,
                product.slug
              ]
            );
            count++;
          } catch (insertErr) {
            if (insertErr.code === 'ER_DUP_ENTRY') {
              console.log(`[MIGRATE] Product ID ${product.id} already exists, skipping...`);
            } else {
              console.error(`[MIGRATE] Error inserting product ${product.id}:`, insertErr.message);
            }
          }
        }

        console.log(`[MIGRATE] Successfully migrated ${count} products from SQLite to MySQL`);
        
        await connection.end();
        db.close();
        
        console.log('[MIGRATE] Migration completed!');
        process.exit(0);
      } catch (mysqlErr) {
        console.error('[MIGRATE] MySQL error:', mysqlErr.message);
        db.close();
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('[MIGRATE] Error:', error.message);
    process.exit(1);
  }
};

migrateData();
