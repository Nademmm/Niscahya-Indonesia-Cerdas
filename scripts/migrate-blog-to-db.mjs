import pool from '../server/db.js';
import { blogPosts, slugify } from '../src/data/blog.js';

async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        date VARCHAR(100),
        category VARCHAR(100),
        image VARCHAR(255),
        excerpt TEXT,
        content LONGTEXT,
        author VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('[MIGRATE] Blogs table created');
  } catch (err) {
    console.error('[MIGRATE] Table creation error:', err.message);
    throw err;
  }
}

async function migrate() {
  try {
    console.log('[MIGRATE] Starting blog migration...');
    await createTable();

    for (const post of blogPosts) {
      const slug = post.slug || slugify(post.title);
      try {
        await pool.query(
          `INSERT INTO blogs (title, slug, date, category, image, excerpt, content, author)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title = VALUES(title)`,
          [post.title, slug, post.date, post.category, post.image, post.excerpt, post.content, post.author]
        );
        console.log(`[MIGRATE] Upserted: ${slug}`);
      } catch (err) {
        console.error('[MIGRATE] Insert failed for', post.title, err.message);
      }
    }

    console.log('[MIGRATE] Done');
    process.exit(0);
  } catch (err) {
    console.error('[MIGRATE] Error', err);
    process.exit(1);
  }
}

migrate();

migrate();
