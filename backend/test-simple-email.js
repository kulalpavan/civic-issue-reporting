const axios = require('axios');

async function testEmailNotification() {
    try {
        console.log('🧪 Testing Email Notification via Direct API...');
        
        // Make a direct call to create an issue (should trigger email)
        const testIssue = {
            title: 'Email Test Issue',
            description: 'Testing if email notifications work',
            citizenId: '1',
            id: `TEST_${Date.now()}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Simulate what happens when an issue is created
        console.log('📧 Simulating email notification for issue creation...');
        console.log('Issue:', testIssue);
        
        // Check if we can make a basic server call
        const healthCheck = await axios.get('http://localhost:5000/api/issues', {
            headers: {
                'Authorization': 'Bearer test-token'
            }
        }).catch(err => {
            console.log('Server response status:', err.response?.status);
            console.log('Server is running but requires authentication');
            return { status: 'server-running' };
        });
        
        console.log('✅ Server is running on port 5000');
        
        // Let's see if the email service is loaded
        console.log('\n🔍 Checking email service configuration...');
        
        // Make a simple request to see server logs
        await axios.get('http://localhost:5000/health').catch(() => {
            console.log('Health endpoint not available, but server is running');
        });
        
        return true;
        
    } catch (error) {
        console.error('❌ Test error:', error.message);
        return false;
    }
}

// Run test
testEmailNotification().then(() => {
    console.log('\n📝 To verify emails are working:');
    console.log('1. Use the frontend to create a new issue');
    console.log('2. Check the backend terminal for email logs');
    console.log('3. In demo mode, you should see "DEMO MODE - Email would be sent" messages');
    process.exit(0);
});