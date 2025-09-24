const axios = require('axios');

async function debugFrontendIssue() {
  const API_URL = 'http://localhost:5000/api';
  
  try {
    console.log('🔍 Starting comprehensive debugging...');
    
    // Step 1: Test login
    console.log('\n1️⃣ Testing login...');
    const loginResponse = await axios.post(`${API_URL}/users/login`, {
      username: 'citizen1',
      password: 'password123',
      role: 'citizen'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, token length:', token.length);
    
    // Step 2: Test FormData submission (like frontend)
    console.log('\n2️⃣ Testing FormData submission...');
    const FormData = require('form-data');
    const form = new FormData();
    form.append('title', 'Frontend Debug Test');
    form.append('description', 'Testing FormData submission like frontend');
    form.append('location', 'Debug Location');
    form.append('priority', 'high');
    
    const formDataResponse = await axios.post(`${API_URL}/issues`, form, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...form.getHeaders()
      }
    });
    
    console.log('✅ FormData submission successful!');
    console.log('📋 Response:', formDataResponse.data);
    
    // Step 3: Test JSON submission
    console.log('\n3️⃣ Testing JSON submission...');
    const jsonResponse = await axios.post(`${API_URL}/issues`, {
      title: 'JSON Debug Test',
      description: 'Testing JSON submission',
      location: 'JSON Location',
      priority: 'medium'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ JSON submission successful!');
    console.log('📋 Response:', jsonResponse.data);
    
    // Step 4: Test with empty FormData (edge case)
    console.log('\n4️⃣ Testing empty FormData...');
    const emptyForm = new FormData();
    emptyForm.append('title', '');
    emptyForm.append('description', '');
    emptyForm.append('location', '');
    emptyForm.append('priority', 'medium');
    
    try {
      const emptyResponse = await axios.post(`${API_URL}/issues`, emptyForm, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...emptyForm.getHeaders()
        }
      });
      console.log('✅ Empty form accepted:', emptyResponse.data);
    } catch (emptyError) {
      console.log('❌ Empty form rejected (expected):', emptyError.response?.data);
    }
    
  } catch (error) {
    console.error('\n❌ Debug test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received');
      console.error('Request config:', error.config);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

debugFrontendIssue();