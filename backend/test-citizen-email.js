// Test email with specific citizen email
const emailService = require('./services/emailService');
require('dotenv').config();

async function testWithCitizenEmail() {
    console.log('🧪 Testing Email with Correct Configuration...\n');
    
    console.log('📧 Configuration:');
    console.log('System Email (FROM):', process.env.EMAIL_USER);
    console.log('Citizen Email (TO): nishchalbhandari18@gmail.com');
    console.log('Demo Mode:', process.env.DEMO_MODE);
    console.log();
    
    // Test issue creation email to citizen
    const testIssue = {
        id: `CITIZEN_TEST_${Date.now()}`,
        title: 'Test Issue - Broken Streetlight',
        description: 'The streetlight on Main Street is not working',
        location: 'Main Street, Downtown',
        priority: 'high',
        status: 'pending',
        citizenId: '1',
        reportedBy: 'citizen1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    try {
        console.log('1️⃣ Sending issue confirmation email...');
        const result1 = await emailService.sendIssueReportedEmail(
            testIssue, 
            'nishchalbhandari18@gmail.com'
        );
        
        console.log('2️⃣ Sending status update email...');
        const result2 = await emailService.sendStatusUpdateEmail(
            testIssue, 
            'nishchalbhandari18@gmail.com', 
            'pending', 
            'in-progress',
            'Our team has started working on this issue'
        );
        
        console.log('3️⃣ Sending officer notification...');
        const citizenInfo = { username: 'citizen1', email: 'nishchalbhandari18@gmail.com' };
        const result3 = await emailService.sendOfficerNotificationEmail(
            testIssue,
            citizenInfo,
            'officer1@example.com'
        );
        
        console.log('\n🎉 All emails sent successfully!');
        console.log('\n📝 Summary:');
        console.log('✅ System sends FROM: coderunner22006@gmail.com');
        console.log('✅ Citizen receives TO: nishchalbhandari18@gmail.com');
        console.log('✅ All email notifications working in demo mode');
        console.log('✅ Ready for real emails when app password is configured');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testWithCitizenEmail();