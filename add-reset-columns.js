const { pool } = require('./config/database');

async function addResetColumns() {
  try {
    console.log('Adding reset_token and reset_token_expires columns...');
    
    // Add reset_token column
    await pool.execute(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) NULL
    `);
    
    // Add reset_token_expires column
    await pool.execute(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP NULL
    `);
    
    console.log('✅ Reset columns added successfully');
    
    // Verify the columns exist
    const [rows] = await pool.execute('DESCRIBE users');
    console.log('Current table structure:');
    rows.forEach(row => {
      console.log(`- ${row.Field}: ${row.Type}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding reset columns:', error.message);
    process.exit(1);
  }
}

addResetColumns();
