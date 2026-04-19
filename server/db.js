import mysql from 'mysql2/promise';

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'niscahya_indonesia_cerdas',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database and create tables
export const initializeDatabase = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Create products table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price INT NOT NULL,
        category VARCHAR(100) NOT NULL,
        image VARCHAR(255),
        images JSON DEFAULT '[]',
        description TEXT,
        specs JSON DEFAULT '[]',
        slug VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('[DB] Products table ready');
    connection.release();
  } catch (error) {
    console.error('[DB] Initialization error:', error);
    throw error;
  }
};

export default pool;
