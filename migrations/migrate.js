const { createDatabase } = require('./database-setup');
const createUsersTable = require('./001_create_users_table');
const addPasswordResetFields = require('./002_add_password_reset_fields');
const createCaptchasTable = require('./003_create_captchas_table');
const mysql = require('mysql2/promise');
require('dotenv').config();

const migrations = [
  createUsersTable,
  addPasswordResetFields,
  createCaptchasTable
];

const runMigrations = async () => {
  try {
    // First create database and migrations table
    await createDatabase();
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'crud_app'
    });

    try {
      for (const migration of migrations) {
        // Check if migration already executed
        const [rows] = await connection.execute(
          'SELECT * FROM migrations WHERE migration_name = ?',
          [migration.name]
        );

        if (rows.length === 0) {
          console.log(`Running migration: ${migration.name}`);
          await connection.execute(migration.up);
          
          // Record migration
          await connection.execute(
            'INSERT INTO migrations (migration_name) VALUES (?)',
            [migration.name]
          );
          
          console.log(`Migration ${migration.name} completed successfully`);
        } else {
          console.log(`Migration ${migration.name} already executed`);
        }
      }
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

// Run migrations if called directly
if (require.main === module) {
  runMigrations().then(() => {
    console.log('All migrations completed');
    process.exit(0);
  }).catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}

module.exports = { runMigrations };
