const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection for migrations
const createConnection = async () => {
  return await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });
};

// Create database if not exists
const createDatabase = async () => {
  const connection = await createConnection();
  
  try {
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'crud_app'}`);
    console.log(`Database ${process.env.DB_NAME || 'crud_app'} created or already exists`);
    
    // Close connection and create new one with database selected
    await connection.end();
    
    const dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'crud_app'
    });
    
    // Create migrations table
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Migrations table created or already exists');
    await dbConnection.end();
  } catch (error) {
    console.error('Error creating database:', error);
  }
};

module.exports = { createConnection, createDatabase };
