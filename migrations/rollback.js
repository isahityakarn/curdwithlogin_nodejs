const createUsersTable = require('./001_create_users_table');
const mysql = require('mysql2/promise');
require('dotenv').config();

const migrations = [
  createUsersTable
];

const rollbackMigrations = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'crud_app'
  });

  try {
    // Get executed migrations in reverse order
    const [rows] = await connection.execute(
      'SELECT * FROM migrations ORDER BY id DESC'
    );

    for (const row of rows) {
      const migration = migrations.find(m => m.name === row.migration_name);
      if (migration) {
        console.log(`Rolling back migration: ${migration.name}`);
        await connection.execute(migration.down);
        
        // Remove migration record
        await connection.execute(
          'DELETE FROM migrations WHERE migration_name = ?',
          [migration.name]
        );
        
        console.log(`Rollback ${migration.name} completed successfully`);
      }
    }
  } catch (error) {
    console.error('Rollback error:', error);
  } finally {
    await connection.end();
  }
};

// Run rollback if called directly
if (require.main === module) {
  rollbackMigrations().then(() => {
    console.log('All rollbacks completed');
    process.exit(0);
  }).catch(error => {
    console.error('Rollback failed:', error);
    process.exit(1);
  });
}

module.exports = { rollbackMigrations };
