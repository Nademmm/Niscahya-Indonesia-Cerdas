import mysql from 'mysql2/promise';

const setupDatabase = async () => {
  let connection;
  try {
    // First connection without database to create the database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('[SETUP] Connected to MySQL server');

    // Create database
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'niscahya_indonesia_cerdas'} 
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`[SETUP] Database '${process.env.DB_NAME || 'niscahya_indonesia_cerdas'}' created or already exists`);

    await connection.end();
    console.log('[SETUP] Setup completed successfully!');
  } catch (error) {
    console.error('[SETUP ERROR]', error.message);
    process.exit(1);
  }
};

setupDatabase();
