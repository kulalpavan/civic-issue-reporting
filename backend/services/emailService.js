const nodemailer = require('nodemailer');
require('dotenv').config();

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Use app-specific password for Gmail
  }
});

// Test email configuration
const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error);
    return false;
  }
};

// Email templates
const emailTemplates = {
  // When a citizen reports a new issue
  issueReported: (issueData, citizenEmail) => ({
    to: citizenEmail,
    subject: `Issue Reported Successfully - #${issueData.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #1565C0; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Civic Issue Reporting System</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #1565C0; margin-top: 0;">Issue Reported Successfully! 🎯</h2>
          
          <p>Dear Citizen,</p>
          
          <p>Thank you for reporting an issue in your community. Your report has been received and assigned the following details:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Issue Details:</h3>
            <p><strong>Issue ID:</strong> #${issueData.id}</p>
            <p><strong>Title:</strong> ${issueData.title}</p>
            <p><strong>Description:</strong> ${issueData.description}</p>
            <p><strong>Location:</strong> ${issueData.location || 'Not specified'}</p>
            <p><strong>Priority:</strong> ${issueData.priority || 'Medium'}</p>
            <p><strong>Status:</strong> <span style="color: #FF9800; font-weight: bold;">Pending Review</span></p>
            <p><strong>Reported On:</strong> ${new Date(issueData.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 6px; border-left: 4px solid #1565C0;">
            <h4 style="margin: 0 0 10px 0; color: #1565C0;">What happens next?</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Your issue will be reviewed by our team within 24-48 hours</li>
              <li>You'll receive email updates when the status changes</li>
              <li>You can track your issue using ID: #${issueData.id}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              Thank you for helping make our community better! 🏘️
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>This is an automated message from the Civic Issue Reporting System</p>
        </div>
      </div>
    `
  }),

  // When an officer/admin updates the issue status
  statusUpdate: (issueData, citizenEmail, oldStatus, newStatus, comments) => ({
    to: citizenEmail,
    subject: `Issue Update - #${issueData.id} Status Changed to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #1565C0; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Civic Issue Reporting System</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #1565C0; margin-top: 0;">Issue Status Updated! 📋</h2>
          
          <p>Dear Citizen,</p>
          
          <p>We have an update regarding your reported issue:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Issue Details:</h3>
            <p><strong>Issue ID:</strong> #${issueData.id}</p>
            <p><strong>Title:</strong> ${issueData.title}</p>
            <p><strong>Location:</strong> ${issueData.location || 'Not specified'}</p>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <h3 style="margin: 0 0 15px 0; color: #2E7D32;">Status Update:</h3>
            <p><strong>Previous Status:</strong> <span style="color: #FF9800;">${oldStatus.charAt(0).toUpperCase() + oldStatus.slice(1)}</span></p>
            <p><strong>New Status:</strong> <span style="color: ${newStatus === 'resolved' ? '#4CAF50' : newStatus === 'in_progress' ? '#2196F3' : '#FF9800'}; font-weight: bold;">${newStatus.charAt(0).toUpperCase() + newStatus.slice(1).replace('_', ' ')}</span></p>
            <p><strong>Updated On:</strong> ${new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          
          ${comments ? `
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #FFC107;">
            <h3 style="margin: 0 0 15px 0; color: #856404;">Official Comments:</h3>
            <p style="margin: 0; font-style: italic;">"${comments}"</p>
          </div>
          ` : ''}
          
          ${newStatus === 'resolved' ? `
          <div style="background-color: #d4edda; padding: 15px; border-radius: 6px; border-left: 4px solid #28a745;">
            <h4 style="margin: 0 0 10px 0; color: #155724;">✅ Issue Resolved!</h4>
            <p style="margin: 0;">Thank you for your patience. The issue has been successfully resolved. If you notice any remaining problems, please don't hesitate to report a new issue.</p>
          </div>
          ` : newStatus === 'in_progress' ? `
          <div style="background-color: #cce5ff; padding: 15px; border-radius: 6px; border-left: 4px solid #007bff;">
            <h4 style="margin: 0 0 10px 0; color: #004085;">🚧 Work in Progress</h4>
            <p style="margin: 0;">Our team is actively working on resolving this issue. We'll keep you updated on the progress.</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              Thank you for your patience and for helping improve our community! 🏘️
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>This is an automated message from the Civic Issue Reporting System</p>
        </div>
      </div>
    `
  }),

  // When an officer receives notification about a new issue
  officerNotification: (issueData, citizenInfo, officerEmail) => ({
    to: officerEmail,
    subject: `New Issue Reported - #${issueData.id} - ${issueData.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #d32f2f; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🚨 New Issue Reported</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #d32f2f; margin-top: 0;">Action Required - New Community Issue</h2>
          
          <p>Dear Officer,</p>
          
          <p>A new issue has been reported by a community member and requires your attention:</p>
          
          <div style="background-color: #ffebee; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #d32f2f;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Issue Details:</h3>
            <p><strong>Issue ID:</strong> #${issueData.id}</p>
            <p><strong>Title:</strong> ${issueData.title}</p>
            <p><strong>Description:</strong> ${issueData.description}</p>
            <p><strong>Location:</strong> ${issueData.location || 'Not specified'}</p>
            <p><strong>Priority:</strong> ${issueData.priority || 'Medium'}</p>
            <p><strong>Reported By:</strong> ${citizenInfo.username} (${citizenInfo.email})</p>
            <p><strong>Reported On:</strong> ${new Date(issueData.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
          
          <div style="background-color: #e3f2fd; padding: 15px; border-radius: 6px; border-left: 4px solid #1976d2;">
            <h4 style="margin: 0 0 10px 0; color: #1976d2;">Next Steps:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Review the issue details and assess the situation</li>
              <li>Update the status to "In Progress" once work begins</li>
              <li>Add comments to communicate progress to the citizen</li>
              <li>Mark as "Resolved" once the issue is fixed</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              Please log into the system to manage this issue 🔧
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>This is an automated notification from the Civic Issue Reporting System</p>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (emailOptions) => {
  try {
    console.log(`📧 Sending email to: ${emailOptions.to}`);
    console.log(`📧 Subject: ${emailOptions.subject}`);
    
    // Check if we're in demo mode
    const isDemoMode = process.env.DEMO_MODE === 'true' || (process.env.NODE_ENV === 'development' && (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com'));
    
    if (isDemoMode) {
      console.log('🎭 DEMO MODE - Email would be sent:');
      console.log('To:', emailOptions.to);
      console.log('Subject:', emailOptions.subject);
      console.log('✅ Email simulated successfully');
      return { success: true, messageId: 'demo-' + Date.now() };
    }
    
    const result = await transporter.sendMail({
      from: `"Civic Issue System" <${process.env.EMAIL_USER}>`,
      ...emailOptions
    });
    
    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return { success: false, error: error.message };
  }
};

// Main email service functions
const emailService = {
  // Test email connection
  testConnection: testEmailConnection,
  
  // Send issue reported confirmation to citizen
  sendIssueReportedEmail: async (issueData, citizenEmail) => {
    const template = emailTemplates.issueReported(issueData, citizenEmail);
    return await sendEmail(template);
  },
  
  // Send status update email to citizen
  sendStatusUpdateEmail: async (issueData, citizenEmail, oldStatus, newStatus, comments = '') => {
    const template = emailTemplates.statusUpdate(issueData, citizenEmail, oldStatus, newStatus, comments);
    return await sendEmail(template);
  },
  
  // Send new issue notification to officers/admins
  sendOfficerNotificationEmail: async (issueData, citizenInfo, officerEmail) => {
    const template = emailTemplates.officerNotification(issueData, citizenInfo, officerEmail);
    return await sendEmail(template);
  },
  
  // Send custom email
  sendCustomEmail: async (to, subject, html) => {
    return await sendEmail({ to, subject, html });
  }
};

module.exports = emailService;