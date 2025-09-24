const axios = require('axios');

async function testLogin() {
  try {
    console.log('🧪 Testing login...');
    
    const response = await axios.post('http://localhost:5000/api/users/login', {
      username: 'citizen1',
      password: 'password123',
      role: 'citizen'
    });
    
    console.log('✅ Login successful!');
    console.log('Token received:', response.data.token ? 'Yes' : 'No');
    
  } catch (error) {
    console.error('❌ Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();