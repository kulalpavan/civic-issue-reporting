const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🔧 Testing Gmail Authentication...');
console.log('Email User:', process.env.EMAIL_USER);
console.log('Password Set:', !!process.env.EMAIL_PASS);
console.log('Demo Mode:', process.env.DEMO_MODE);

// Test different password formats
async function testEmailAuth() {
    const passwords = [
        process.env.EMAIL_PASS,
        process.env.EMAIL_PASS.replace(/\s/g, ''), // Remove spaces
        'yduq jrhx sjvu yyf', // With spaces
        'yduqjrhxsjvuyyf'     // Without spaces
    ];
    
    for (let i = 0; i < passwords.length; i++) {
        const password = passwords[i];
        console.log(`\n${i + 1}️⃣ Testing password format ${i + 1}...`);
        
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: password
                }
            });
            
            // Verify the connection
            await transporter.verify();
            console.log('✅ Authentication successful with format', i + 1);
            
            // Try sending a test email
            const info = await transporter.sendMail({
                from: `"Civic Issue Portal" <${process.env.EMAIL_USER}>`,
                to: 'nishchalbhandari18@gmail.com',
                subject: 'Test Email - Civic Issue Portal',
                html: `
                    <h2>🎉 Email Test Successful!</h2>
                    <p>Your email notification system is working correctly.</p>
                    <p>Format ${i + 1} worked: <code>${password}</code></p>
                    <p>Time: ${new Date().toLocaleString()}</p>
                `
            });
            
            console.log('📧 Test email sent successfully!');
            console.log('Message ID:', info.messageId);
            return true;
            
        } catch (error) {
            console.log('❌ Failed with format', i + 1, ':', error.message);
        }
    }
    
    console.log('\n❌ All password formats failed. Please check:');
    console.log('1. Gmail 2-factor authentication is enabled');
    console.log('2. App password is correctly generated');
    console.log('3. "Less secure app access" is not needed for app passwords');
    return false;
}

testEmailAuth().then(() => {
    process.exit(0);
}).catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
});