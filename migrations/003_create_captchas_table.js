const mysql = require('mysql2/promise');
require('dotenv').config();

const createCaptchasTable = {
  name: 'create_captchas_table',
  up: `
    CREATE TABLE captchas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      token VARCHAR(255) UNIQUE NOT NULL,
      captcha VARCHAR(6) NOT NULL,
      browser_info TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  down: `DROP TABLE IF EXISTS captchas`
};

module.exports = createCaptchasTable;
