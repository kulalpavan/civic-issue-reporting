const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔍 Testing login with:');
    console.log('URL: http://localhost:5000/api/users/login');
    console.log('Data: { username: "citizen1", password: "password123", role: "citizen" }');
    
    const response = await axios.post('http://localhost:5000/api/users/login', {
      username: 'citizen1',
      password: 'password123',
      role: 'citizen'
    });
    
    console.log('✅ Login test successful!');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Login test failed:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    console.error('Full error:', error.code);
    throw error;
  }
}

// Run the test
testLogin()
  .then(() => {
    console.log('✅ All tests passed!');
    process.exit(0);
  })
  .catch(() => {
    console.log('❌ Tests failed!');
    process.exit(1);
  });