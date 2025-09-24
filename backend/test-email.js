const emailService = require('./services/emailService');
require('dotenv').config();

async function testEmailFeatures() {
  console.log('🧪 Testing Email Notification System...\n');

  // Test email service connection
  console.log('1️⃣ Testing email service connection...');
  try {
    await emailService.testConnection();
    console.log('✅ Email service connection successful');
  } catch (error) {
    console.log('📧 Running in demo mode (emails will be simulated)');
  }

  // Test data
  const testIssue = {
    id: 'TEST' + Date.now(),
    title: 'Test Issue - Broken Streetlight',
    description: 'This is a test issue for email notifications',
    location: 'Test Street, Test City',
    priority: 'high',
    status: 'pending',
    citizenId: '1',
    reportedBy: 'citizen1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const testCitizenEmail = 'citizen@test.com';
  const testOfficerEmail = 'officer@test.com';

  console.log('\n2️⃣ Testing issue reported email...');
  try {
    const result1 = await emailService.sendIssueReportedEmail(testIssue, testCitizenEmail);
    if (result1.success) {
      console.log('✅ Issue reported email sent successfully');
    } else {
      console.log('❌ Failed to send issue reported email:', result1.error);
    }
  } catch (error) {
    console.log('❌ Error testing issue reported email:', error.message);
  }

  console.log('\n3️⃣ Testing status update email...');
  try {
    const result2 = await emailService.sendStatusUpdateEmail(
      testIssue,
      testCitizenEmail,
      'pending',
      'in_progress',
      'Our team is now working on this issue. We expect to have it resolved within 24 hours.'
    );
    if (result2.success) {
      console.log('✅ Status update email sent successfully');
    } else {
      console.log('❌ Failed to send status update email:', result2.error);
    }
  } catch (error) {
    console.log('❌ Error testing status update email:', error.message);
  }

  console.log('\n4️⃣ Testing officer notification email...');
  try {
    const citizenInfo = { username: 'citizen1', email: testCitizenEmail };
    const result3 = await emailService.sendOfficerNotificationEmail(
      testIssue,
      citizenInfo,
      testOfficerEmail
    );
    if (result3.success) {
      console.log('✅ Officer notification email sent successfully');
    } else {
      console.log('❌ Failed to send officer notification email:', result3.error);
    }
  } catch (error) {
    console.log('❌ Error testing officer notification email:', error.message);
  }

  console.log('\n5️⃣ Testing resolved issue email...');
  try {
    const resolvedIssue = { ...testIssue, status: 'resolved' };
    const result4 = await emailService.sendStatusUpdateEmail(
      resolvedIssue,
      testCitizenEmail,
      'in_progress',
      'resolved',
      'The streetlight has been repaired and is now working properly. Thank you for reporting this issue!'
    );
    if (result4.success) {
      console.log('✅ Resolved issue email sent successfully');
    } else {
      console.log('❌ Failed to send resolved issue email:', result4.error);
    }
  } catch (error) {
    console.log('❌ Error testing resolved issue email:', error.message);
  }

  console.log('\n🎉 Email testing completed!');
  console.log('\n📝 Next Steps:');
  console.log('1. Update .env file with your actual email credentials');
  console.log('2. Set EMAIL_USER to your Gmail address');
  console.log('3. Set EMAIL_PASS to your Gmail App Password');
  console.log('4. Set DEMO_MODE=false to send real emails');
  console.log('5. Update user emails in users.json with real addresses');
  
  console.log('\n📧 Current Configuration:');
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER || 'Not set'}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? 'Set' : 'Not set'}`);
  console.log(`DEMO_MODE: ${process.env.DEMO_MODE || 'true'}`);
  console.log(`NOTIFY_OFFICERS: ${process.env.NOTIFY_OFFICERS || 'true'}`);
}

// Run the test
testEmailFeatures().catch(console.error);