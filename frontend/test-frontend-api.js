// Test script to check frontend API connectivity
console.log('🧪 Testing Frontend API...');

// Check if user is logged in
const token = localStorage.getItem('token');
console.log('🔑 Token exists:', !!token);

if (token) {
  console.log('🔑 Token preview:', token.substring(0, 20) + '...');
}

// Test API connectivity
fetch('http://localhost:5000/api/issues', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('📡 API Response Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('📊 API Response Data:', data);
})
.catch(error => {
  console.error('❌ API Error:', error);
});

// Test issue creation
if (token) {
  const testIssueData = {
    title: 'Frontend Test Issue',
    description: 'Testing from frontend console',
    location: 'Test Location',
    priority: 'medium'
  };

  fetch('http://localhost:5000/api/issues', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(testIssueData)
  })
  .then(response => {
    console.log('📝 Issue Creation Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('✅ Issue Created:', data);
  })
  .catch(error => {
    console.error('❌ Issue Creation Error:', error);
  });
}