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
    console.log('Creating trades table...');
    
    // Create trades table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS trades (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trade_name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Trades table created successfully');
    
    // Insert demo data
    console.log('Inserting demo data...');
    
    const demoTrades = [
      'Electrician',
      'Plumber',
      'Carpenter',
      'Mason',
      'Welder',
      'HVAC Technician',
      'Painter',
      'Roofer',
      'Flooring Installer',
      'Tile Setter',
      'Drywall Installer',
      'Insulation Worker',
      'Glazier',
      'Heavy Equipment Operator',
      'Construction Laborer',
      'Concrete Finisher',
      'Ironworker',
      'Sheet Metal Worker',
      'Pipefitter',
      'Boilermaker',
      'Millwright',
      'Automotive Mechanic',
      'Diesel Mechanic',
      'Aircraft Mechanic',
      'Marine Mechanic',
      'Industrial Mechanic',
      'Locksmith',
      'Appliance Repair Technician',
      'Computer Repair Technician',
      'Electronics Technician',
      'Telecommunications Technician',
      'Solar Panel Installer',
      'Wind Turbine Technician',
      'Elevator Technician',
      'Crane Operator',
      'Forklift Operator',
      'Machinist',
      'Tool and Die Maker',
      'CNC Operator',
      'Quality Control Inspector'
    ];
    
    for (const tradeName of demoTrades) {
      await connection.execute(
        'INSERT IGNORE INTO trades (trade_name) VALUES (?)',
        [tradeName]
      );
    }
    
    console.log(`Inserted ${demoTrades.length} demo trades successfully`);
    
    // Show inserted data
    const [rows] = await connection.execute('SELECT * FROM trades ORDER BY trade_name');
    console.log(`Total trades in database: ${rows.length}`);
    
  } catch (error) {
    console.error('Error in trades table migration:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function down() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    console.log('Dropping trades table...');
    await connection.execute('DROP TABLE IF EXISTS trades');
    console.log('Trades table dropped successfully');
  } catch (error) {
    console.error('Error dropping trades table:', error);
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
