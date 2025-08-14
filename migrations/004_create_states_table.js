const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'curdwithlogin_db'
};

async function up() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('Creating states table...');
    
    // Create states table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS states (
        id INT AUTO_INCREMENT PRIMARY KEY,
        state_name VARCHAR(100) NOT NULL UNIQUE,
        logo VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('States table created successfully');
    
    // Insert demo data
    console.log('Inserting demo data...');
    
    const demoStates = [
      ['California', 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'],
      ['Texas', 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'],
      ['Florida', 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'],
      ['New York', 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_New_York.svg'],
      ['Pennsylvania', 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Pennsylvania.svg'],
      ['Illinois', 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_Illinois.svg'],
      ['Ohio', 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Flag_of_Ohio.svg'],
      ['Georgia', 'https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Georgia_%28U.S._state%29.svg'],
      ['North Carolina', 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Flag_of_North_Carolina.svg'],
      ['Michigan', 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Flag_of_Michigan.svg'],
      ['New Jersey', 'https://upload.wikimedia.org/wikipedia/commons/9/92/Flag_of_New_Jersey.svg'],
      ['Virginia', 'https://upload.wikimedia.org/wikipedia/commons/4/47/Flag_of_Virginia.svg'],
      ['Washington', 'https://upload.wikimedia.org/wikipedia/commons/5/54/Flag_of_Washington.svg'],
      ['Arizona', 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arizona.svg'],
      ['Massachusetts', 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Flag_of_Massachusetts.svg'],
      ['Tennessee', 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Tennessee.svg'],
      ['Indiana', 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Flag_of_Indiana.svg'],
      ['Missouri', 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Flag_of_Missouri.svg'],
      ['Maryland', 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Flag_of_Maryland.svg'],
      ['Wisconsin', 'https://upload.wikimedia.org/wikipedia/commons/2/22/Flag_of_Wisconsin.svg']
    ];
    
    for (const [stateName, logo] of demoStates) {
      await connection.execute(
        'INSERT IGNORE INTO states (state_name, logo) VALUES (?, ?)',
        [stateName, logo]
      );
    }
    
    console.log(`Inserted ${demoStates.length} demo states successfully`);
    
    // Show inserted data
    const [rows] = await connection.execute('SELECT * FROM states ORDER BY state_name');
    console.log(`Total states in database: ${rows.length}`);
    
  } catch (error) {
    console.error('Error in states table migration:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function down() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('Dropping states table...');
    await connection.execute('DROP TABLE IF EXISTS states');
    console.log('States table dropped successfully');
  } catch (error) {
    console.error('Error dropping states table:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

module.exports = { up, down };

// Run migration if this file is executed directly
if (require.main === module) {
  up().catch(console.error);
}
