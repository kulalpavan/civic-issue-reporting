const axios = require('axios');

async function testConnection() {
  try {
    console.log('🔍 Testing server connection...');
    
    // Test backend health
    const response = await axios.get('http://localhost:5000');
    console.log('✅ Backend is accessible');
    
    // Test login API
    const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
      username: 'citizen1',
      password: 'password123',
      role: 'citizen'
    });
    
    console.log('✅ Login API working');
    console.log('🎯 Connection test successful!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
  }
}

testConnection();