const axios = require('axios');

async function testIssueCreation() {
    try {
        console.log('🧪 Testing issue creation with email notification...');
        
        // Login first to get token
        const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
            username: 'citizen1',
            password: 'password123',
            role: 'citizen'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful, token received');
        
        // Create a new issue
        const issueResponse = await axios.post('http://localhost:5000/api/issues', {
            title: 'Test Email Issue',
            description: 'This is a test issue to verify email notifications are working',
            location: 'Test Location',
            priority: 'medium'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Issue created successfully:', issueResponse.data.message);
        console.log('📧 Check backend logs for email notification...');
        
        return issueResponse.data;
        
    } catch (error) {
        console.error('❌ Test failed:', error.response ? error.response.data : error.message);
    }
}

async function testStatusUpdate() {
    try {
        console.log('\n🧪 Testing status update with email notification...');
        
        // Login as officer
        const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
            username: 'officer1',
            password: 'officer123',
            role: 'officer'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Officer login successful');
        
        // Get the first issue to update
        const issuesResponse = await axios.get('http://localhost:5000/api/issues', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (issuesResponse.data && issuesResponse.data.length > 0) {
            const issueId = issuesResponse.data[0].id;
            
            // Update status
            const updateResponse = await axios.put(`http://localhost:5000/api/issues/${issueId}/status`, {
                status: 'in-progress'
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ Status updated successfully:', updateResponse.data.message);
            console.log('📧 Check backend logs for status update email...');
        } else {
            console.log('❌ No issues found to update');
        }
        
    } catch (error) {
        console.error('❌ Status update test failed:', error.response ? error.response.data : error.message);
    }
}

// Run tests
(async () => {
    await testIssueCreation();
    await testStatusUpdate();
    process.exit(0);
})();