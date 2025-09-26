const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { authMiddleware, roleCheck } = require('../middleware/auth');

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

// Create new issue (Citizen only)
router.post('/', authMiddleware, roleCheck(['citizen']), upload.single('image'), async (req, res) => {
  try {
    const { title, description, latitude, longitude } = req.body;
    const issues = await getIssues();
    
    const newIssue = {
      id: Date.now().toString(),
      title,
      description,
      location: {
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null
      },
      image: req.file ? `/uploads/${req.file.filename}` : null,
      status: 'pending',
      citizenId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    issues.push(newIssue);
    await saveIssues(issues);
    res.status(201).json(newIssue);
  } catch (error) {
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

// Update issue status (Officer only)
router.patch('/:id/status', authMiddleware, roleCheck(['officer']), async (req, res) => {
  try {
    const { status } = req.body;
    const issues = await getIssues();
    const issueIndex = issues.findIndex(i => i.id === req.params.id);
    
    if (issueIndex === -1) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    issues[issueIndex].status = status;
    issues[issueIndex].updatedAt = new Date().toISOString();
    
    await saveIssues(issues);
    res.json(issues[issueIndex]);
  } catch (error) {
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