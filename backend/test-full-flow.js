const axios = require('axios');

async function testIssueCreation() {
    console.log('🧪 Testing Issue Creation and Email Notifications...\n');
    
    try {
        // Step 1: Login as citizen
        console.log('1️⃣ Logging in as citizen...');
        const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
            username: 'citizen1',
            password: 'password123',
            role: 'citizen'
        });
        
        if (loginResponse.data.token) {
            console.log('✅ Login successful');
            const token = loginResponse.data.token;
            
            // Step 2: Create a new issue
            console.log('\n2️⃣ Creating a new issue...');
            const formData = new FormData();
            formData.append('title', 'Test Issue - Email Notification');
            formData.append('description', 'Testing issue creation and email notifications');
            formData.append('location', 'Test Location, Main Street');
            formData.append('priority', 'high');
            
            const issueResponse = await axios.post('http://localhost:5000/api/issues', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            console.log('✅ Issue created successfully:', issueResponse.data.id);
            console.log('📧 Check your email at: nishchalbhandari18@gmail.com');
            
        } else {
            console.log('❌ Login failed');
        }
        
    } catch (error) {
        console.error('❌ Error occurred:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Message:', error.message);
        }
    }
}

async function testStatusUpdate() {
    console.log('\n🧪 Testing Status Update Email...\n');
    
    try {
        // Step 1: Login as officer
        console.log('1️⃣ Logging in as officer...');
        const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
            username: 'officer1',
            password: 'officer123',
            role: 'officer'
        });
        
        if (loginResponse.data.token) {
            console.log('✅ Officer login successful');
            const token = loginResponse.data.token;
            
            // Step 2: Get all issues
            console.log('\n2️⃣ Getting all issues...');
            const issuesResponse = await axios.get('http://localhost:5000/api/issues', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (issuesResponse.data && issuesResponse.data.length > 0) {
                const firstIssue = issuesResponse.data[0];
                console.log('✅ Found issue to update:', firstIssue.id);
                
                // Step 3: Update issue status
                console.log('\n3️⃣ Updating issue status...');
                const updateResponse = await axios.patch(`http://localhost:5000/api/issues/${firstIssue.id}/status`, {
                    status: 'in-progress',
                    comments: 'Our team has started working on this issue. We will resolve it soon.'
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log('✅ Status updated successfully');
                console.log('📧 Status update email should be sent to: nishchalbhandari18@gmail.com');
                
            } else {
                console.log('❌ No issues found to update');
            }
            
        } else {
            console.log('❌ Officer login failed');
        }
        
    } catch (error) {
        console.error('❌ Status update error:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Message:', error.message);
        }
    }
}

// Run tests
(async () => {
    await testIssueCreation();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    await testStatusUpdate();
    
    console.log('\n📝 Summary:');
    console.log('✅ Both tests completed');
    console.log('📧 Check your email: nishchalbhandari18@gmail.com');
    console.log('🌐 Website: http://localhost:5173');
})();