const mysql = require('mysql2/promise');
require('dotenv').config();

const createUsersTable = {
  name: 'create_users_table',
  up: `
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  down: `DROP TABLE IF EXISTS users`
};

module.exports = createUsersTable;
