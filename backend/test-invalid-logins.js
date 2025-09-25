const axios = require('axios');

async function testInvalidLogins() {
  const invalidTests = [
    { desc: 'Wrong password', data: { username: 'citizen1', password: 'wrongpassword', role: 'citizen' } },
    { desc: 'Wrong username', data: { username: 'wronguser', password: 'password123', role: 'citizen' } },
    { desc: 'Wrong role', data: { username: 'citizen1', password: 'password123', role: 'wrongrole' } },
    { desc: 'Missing password', data: { username: 'citizen1', role: 'citizen' } },
    { desc: 'Missing username', data: { password: 'password123', role: 'citizen' } },
    { desc: 'Missing role', data: { username: 'citizen1', password: 'password123' } }
  ];

  console.log('🧪 Testing invalid login scenarios...\n');

  for (const test of invalidTests) {
    try {
      console.log(`Testing: ${test.desc}`);
      const response = await axios.post('http://localhost:5000/api/users/login', test.data);
      console.log(`❌ Unexpected success for "${test.desc}": ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.log(`✅ Correctly rejected "${test.desc}": ${error.response?.data?.error || error.message}`);
    }
    console.log();
  }
  
  console.log('🎯 Invalid login testing completed!');
}

testInvalidLogins();