// States API Test Examples
// Make sure your server is running on http://localhost:5050

const testStatesAPI = async () => {
  const baseURL = 'http://localhost:5050/api';
  
  console.log('🧪 Testing States API...\n');

  try {
    // Test 1: Get all states
    console.log('1. Testing GET /api/states');
    const allStatesResponse = await fetch(`${baseURL}/states`);
    const allStates = await allStatesResponse.json();
    console.log(`✅ Found ${allStates.total} states`);
    console.log(`   First state: ${allStates.states[0]?.state_name}\n`);

    // Test 2: Get states with pagination
    console.log('2. Testing GET /api/states?page=1&limit=3');
    const paginatedResponse = await fetch(`${baseURL}/states?page=1&limit=3`);
    const paginatedStates = await paginatedResponse.json();
    console.log(`✅ Page 1 with limit 3: ${paginatedStates.states.length} states`);
    console.log(`   Total pages: ${paginatedStates.pagination?.totalPages}\n`);

    // Test 3: Search states
    console.log('3. Testing GET /api/states/search?q=New');
    const searchResponse = await fetch(`${baseURL}/states/search?q=New`);
    const searchResults = await searchResponse.json();
    console.log(`✅ Search results for "New": ${searchResults.total} states`);
    searchResults.states.forEach(state => {
      console.log(`   - ${state.state_name}`);
    });
    console.log('');

    // Test 4: Get state by ID
    console.log('4. Testing GET /api/states/1');
    const stateByIdResponse = await fetch(`${baseURL}/states/1`);
    const stateById = await stateByIdResponse.json();
    console.log(`✅ State ID 1: ${stateById.state?.state_name}\n`);

    // Test 5: Get stats
    console.log('5. Testing GET /api/states/stats');
    const statsResponse = await fetch(`${baseURL}/states/stats`);
    const stats = await statsResponse.json();
    console.log(`✅ States Statistics:`);
    console.log(`   Total: ${stats.stats.total}`);
    console.log(`   With Logo: ${stats.stats.withLogo}`);
    console.log(`   Logo Percentage: ${stats.stats.logoPercentage}%\n`);

    console.log('🎉 All tests completed successfully!');
    console.log('\n📝 Try these cURL commands:');
    console.log(`curl -X GET ${baseURL}/states`);
    console.log(`curl -X GET "${baseURL}/states/search?q=California"`);
    console.log(`curl -X GET ${baseURL}/states/stats`);

  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('\n🔧 Make sure your server is running:');
    console.log('   npm start  or  npm run dev');
  }
};

// For Node.js environment
if (typeof require !== 'undefined' && require.main === module) {
  // Install node-fetch if not available
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  testStatesAPI();
}

// For browser environment
if (typeof window !== 'undefined') {
  // Call the function when page loads
  window.addEventListener('load', testStatesAPI);
}

module.exports = { testStatesAPI };
