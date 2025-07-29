#!/usr/bin/env node

/**
 * Setup script for CRUD with Login application
 * This script helps you set up the database and test the API
 */

const readline = require('readline');
const { runMigrations } = require('./migrations/migrate');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupApplication() {
  console.log('🚀 Welcome to CRUD with Login Setup\n');
  
  console.log('📋 Setup Checklist:');
  console.log('1. ✅ Node.js dependencies installed');
  console.log('2. ⏳ Database configuration');
  console.log('3. ⏳ Run migrations');
  console.log('4. ⏳ Start server\n');

  try {
    // Check if user has configured database
    const dbConfigured = await question('Have you configured your database credentials in .env file? (y/n): ');
    
    if (dbConfigured.toLowerCase() !== 'y') {
      console.log('\n📝 Please configure your database credentials in .env file:');
      console.log('   DB_HOST=localhost');
      console.log('   DB_USER=root');
      console.log('   DB_PASSWORD=your_password');
      console.log('   DB_NAME=crud_app');
      console.log('   JWT_SECRET=your_jwt_secret_key_here\n');
      
      const proceed = await question('Continue with setup after configuring .env? (y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        console.log('Setup cancelled. Please configure .env and run again.');
        rl.close();
        return;
      }
    }

    console.log('\n🗄️ Running database migrations...');
    await runMigrations();
    console.log('✅ Database migrations completed successfully!\n');

    console.log('🎉 Setup completed! Your CRUD API is ready.\n');
    console.log('📖 Next steps:');
    console.log('   1. Start the server: npm run dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('   3. Test API endpoints using the README guide\n');

    const startServer = await question('Would you like to start the server now? (y/n): ');
    
    if (startServer.toLowerCase() === 'y') {
      console.log('\n🚀 Starting development server...\n');
      rl.close();
      
      // Start the server
      require('./server');
    } else {
      console.log('\n✨ Setup complete! Run "npm run dev" to start the server.');
      rl.close();
    }

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your database credentials in .env');
    console.log('   2. Ensure MySQL server is running');
    console.log('   3. Verify database user has necessary permissions\n');
    rl.close();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupApplication();
}

module.exports = { setupApplication };
