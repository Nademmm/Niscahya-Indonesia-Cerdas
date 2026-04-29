import pool from '../server/db.js';

async function count() {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as cnt FROM blogs');
    console.log('Blogs count:', rows[0].cnt);
    process.exit(0);
  } catch (err) {
    console.error('Count error:', err);
    process.exit(1);
  }
}

count();
