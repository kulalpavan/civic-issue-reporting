const axios = require('axios');

async function testIssueSubmission() {
  const API_URL = 'http://localhost:5000/api';
  
  try {
    console.log('🔐 Testing user login...');
    
    // First, login as citizen1
    const loginResponse = await axios.post(`${API_URL}/users/login`, {
      username: 'citizen1',
      password: 'password123',
      role: 'citizen'
    });
    
    console.log('✅ Login successful');
    const token = loginResponse.data.token;
    
    console.log('📝 Testing issue submission...');
    
    // Try to submit an issue
    const issueData = {
      title: 'Test Issue Submission',
      description: 'Testing if issue submission is working',
      location: 'Test Location',
      priority: 'medium'
    };
    
    const issueResponse = await axios.post(`${API_URL}/issues`, issueData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Issue submitted successfully!');
    console.log('📋 Issue details:', issueResponse.data);
    
  } catch (error) {
    console.error('❌ Error occurred:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

testIssueSubmission();