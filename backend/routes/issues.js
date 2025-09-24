const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { authMiddleware, roleCheck } = require('../middleware/auth');
const emailService = require('../services/emailService');

const ISSUES_FILE = path.join(__dirname, '../issues.json');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Helper functions
async function getIssues() {
  try {
    const data = await fs.readFile(ISSUES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveIssues(issues) {
  await fs.writeFile(ISSUES_FILE, JSON.stringify(issues, null, 2));
}

// User helper functions
const USERS_FILE = path.join(__dirname, '../users.json');

async function getUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function getUserById(userId) {
  const users = await getUsers();
  return users.find(user => user.id === userId);
}

async function getUsersByRole(role) {
  const users = await getUsers();
  return users.filter(user => user.role === role);
}

// Create new issue (Citizen only)
router.post('/', authMiddleware, roleCheck(['citizen']), upload.single('image'), async (req, res) => {
  try {
    const { title, description, location, priority } = req.body;
    const issues = await getIssues();
    
    const newIssue = {
      id: Date.now().toString(),
      title,
      description,
      location,
      priority: priority || 'medium',
      image: req.file ? `/uploads/${req.file.filename}` : null,
      status: 'pending',
      citizenId: req.user.id,
      reportedBy: req.user.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    issues.push(newIssue);
    await saveIssues(issues);

    // Send email notifications
    try {
      // Get citizen info for email
      const citizenInfo = await getUserById(req.user.id);
      if (citizenInfo && citizenInfo.email) {
        // Send confirmation email to citizen
        await emailService.sendIssueReportedEmail(newIssue, citizenInfo.email);
        console.log(`✅ Confirmation email sent to citizen: ${citizenInfo.email}`);
      }

      // Send notification to officers if enabled
      if (process.env.NOTIFY_OFFICERS === 'true') {
        const officers = await getUsersByRole('officer');
        const admins = await getUsersByRole('admin');
        const notificationRecipients = [...officers, ...admins];

        for (const recipient of notificationRecipients) {
          if (recipient.email) {
            await emailService.sendOfficerNotificationEmail(newIssue, citizenInfo, recipient.email);
            console.log(`✅ Notification email sent to ${recipient.role}: ${recipient.email}`);
          }
        }
      }
    } catch (emailError) {
      console.error('❌ Email notification error:', emailError);
      // Don't fail the issue creation if email fails
    }

    res.status(201).json(newIssue);
  } catch (error) {
    console.error('Issue creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all issues (Officer and Admin)
router.get('/', authMiddleware, roleCheck(['officer', 'admin']), async (req, res) => {
  try {
    const issues = await getIssues();
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get citizen's issues (Citizen only)
router.get('/my-issues', authMiddleware, roleCheck(['citizen']), async (req, res) => {
  try {
    const issues = await getIssues();
    const userIssues = issues.filter(issue => issue.citizenId === req.user.id);
    res.json(userIssues);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update issue status (Officer/Admin only)
router.patch('/:id/status', authMiddleware, roleCheck(['officer', 'admin']), async (req, res) => {
  try {
    const { status, comments } = req.body;
    const issues = await getIssues();
    const issueIndex = issues.findIndex(i => i.id === req.params.id);
    
    if (issueIndex === -1) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const issue = issues[issueIndex];
    const oldStatus = issue.status;

    // Update issue
    issues[issueIndex].status = status;
    issues[issueIndex].updatedAt = new Date().toISOString();
    if (comments) {
      issues[issueIndex].comments = comments;
    }
    
    await saveIssues(issues);

    // Send email notification to citizen about status update
    try {
      const citizenInfo = await getUserById(issue.citizenId);
      if (citizenInfo && citizenInfo.email && oldStatus !== status) {
        await emailService.sendStatusUpdateEmail(
          issues[issueIndex], 
          citizenInfo.email, 
          oldStatus, 
          status, 
          comments
        );
        console.log(`✅ Status update email sent to citizen: ${citizenInfo.email}`);
      }
    } catch (emailError) {
      console.error('❌ Status update email error:', emailError);
      // Don't fail the status update if email fails
    }

    res.json(issues[issueIndex]);
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete resolved issue (Admin only)
router.delete('/:id', authMiddleware, roleCheck(['admin']), async (req, res) => {
  try {
    const issues = await getIssues();
    const issueIndex = issues.findIndex(i => i.id === req.params.id);
    
    if (issueIndex === -1) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    const issue = issues[issueIndex];
    if (issue.status !== 'resolved') {
      return res.status(400).json({ error: 'Only resolved issues can be deleted' });
    }

    // Remove the image file if it exists
    if (issue.image) {
      const imagePath = path.join(__dirname, '..', issue.image);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    issues.splice(issueIndex, 1);
    await saveIssues(issues);
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;