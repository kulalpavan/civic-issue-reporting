const axios = require('axios');

async function testAllLogins() {
  const testUsers = [
    { username: 'citizen1', password: 'password123', role: 'citizen' },
    { username: 'officer1', password: 'officer123', role: 'officer' },
    { username: 'admin1', password: 'admin123', role: 'admin' }
  ];

  for (const user of testUsers) {
    try {
      console.log(`\n🔍 Testing login for ${user.role}: ${user.username}`);
      
      const response = await axios.post('http://localhost:5000/api/users/login', user);
      
      console.log(`✅ Login successful for ${user.username}!`);
      console.log(`Token received: ${response.data.token.substring(0, 50)}...`);
      console.log(`User data:`, response.data.user);
      
    } catch (error) {
      console.error(`❌ Login failed for ${user.username}:`);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
    }
  }
  
  console.log('\n🎉 All login tests completed!');
}

// Run the tests
testAllLogins();