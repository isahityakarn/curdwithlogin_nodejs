/**
 * API Test Examples
 * This file contains example API calls for testing the CRUD application
 */

const API_BASE_URL = 'http://localhost:5050/api';

// Example API calls using fetch (for browser console or Node.js with node-fetch)

// 1. Register a new user
const registerUser = async () => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123'
    })
  });
  
  const data = await response.json();
  console.log('Register Response:', data);
  return data.token; // Return token for next calls
};

// 2. Login user
const loginUser = async () => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'john@example.com',
      password: 'Password123'
    })
  });
  
  const data = await response.json();
  console.log('Login Response:', data);
  return data.token;
};

// 3. Get all users (requires token)
const getAllUsers = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  
  const data = await response.json();
  console.log('All Users:', data);
  return data;
};

// 4. Get user profile (requires token)
const getUserProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  
  const data = await response.json();
  console.log('User Profile:', data);
  return data;
};

// 5. Update user (requires token)
const updateUser = async (token, userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'John Updated',
      email: 'john.updated@example.com'
    })
  });
  
  const data = await response.json();
  console.log('Update User Response:', data);
  return data;
};

// 6. Update password (requires token)
const updatePassword = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users/password`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currentPassword: 'Password123',
      newPassword: 'NewPassword123'
    })
  });
  
  const data = await response.json();
  console.log('Update Password Response:', data);
  return data;
};

// 7. Delete user (requires token)
const deleteUser = async (token, userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  
  const data = await response.json();
  console.log('Delete User Response:', data);
  return data;
};

// Example test sequence
const runAPITests = async () => {
  try {
    console.log('🧪 Starting API Tests...\n');
    
    // Test registration
    console.log('1. Testing user registration...');
    const registerToken = await registerUser();
    
    // Test login
    console.log('\n2. Testing user login...');
    const loginToken = await loginUser();
    
    // Test get profile
    console.log('\n3. Testing get user profile...');
    await getUserProfile(loginToken);
    
    // Test get all users
    console.log('\n4. Testing get all users...');
    const usersData = await getAllUsers(loginToken);
    
    // Test update user (using first user from the list)
    if (usersData.users && usersData.users.length > 0) {
      const userId = usersData.users[0].id;
      console.log(`\n5. Testing update user (ID: ${userId})...`);
      await updateUser(loginToken, userId);
    }
    
    // Test update password
    console.log('\n6. Testing password update...');
    await updatePassword(loginToken);
    
    console.log('\n✅ All API tests completed!');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// CURL Examples for terminal testing
const curlExamples = {
  register: `curl -X POST http://localhost:5050/api/users/register \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Doe","email":"john@example.com","password":"Password123"}'`,
  
  login: `curl -X POST http://localhost:5050/api/users/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"john@example.com","password":"Password123"}'`,
  
  getAllUsers: `curl -X GET http://localhost:5050/api/users \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
  
  getProfile: `curl -X GET http://localhost:5050/api/users/profile \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
  
  updateUser: `curl -X PUT http://localhost:5050/api/users/1 \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Updated","email":"john.updated@example.com"}'`,
  
  updatePassword: `curl -X PUT http://localhost:5050/api/users/password \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"currentPassword":"Password123","newPassword":"NewPassword123"}'`,
  
  deleteUser: `curl -X DELETE http://localhost:5050/api/users/1 \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`
};

// Export for use in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserProfile,
    updateUser,
    updatePassword,
    deleteUser,
    runAPITests,
    curlExamples
  };
}
