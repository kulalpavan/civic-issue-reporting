import { useState } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  PendingOutlined as PendingIcon,
  ScheduleOutlined as InProgressIcon,
  CheckCircleOutline as ResolvedIcon,
  MoreVert as MoreIcon,
  DeleteOutline as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api';

const statusColors = {
  pending: 'warning',
  'in-progress': 'info',
  resolved: 'success'
};

const statusIcons = {
  pending: <PendingIcon />,
  'in-progress': <InProgressIcon />,
  resolved: <ResolvedIcon />
};

export default function EnhancedIssueList({ issues, onIssueUpdated, onIssueDeleted }) {
  const { auth } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const handleMenuClick = (event, issue) => {
    setAnchorEl(event.currentTarget);
    setSelectedIssue(issue);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedIssue(null);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.updateIssueStatus(selectedIssue.id, newStatus);
      if (onIssueUpdated) {
        onIssueUpdated();
      }
    } catch (error) {
      setError('Failed to update status');
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.deleteIssue(selectedIssue.id);
      if (onIssueDeleted) {
        onIssueDeleted();
      }
    } catch (error) {
      setError('Failed to delete issue');
    }
    setDeleteDialogOpen(false);
  };

  if (!issues || issues.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1">No issues found.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        {auth.user.role === 'citizen' ? 'My Reported Issues' : 'All Issues'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <List>
        {issues.map((issue) => (
          <ListItem
            key={issue.id}
            alignItems="flex-start"
            divider
            sx={{ flexDirection: 'column' }}
          >
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                {issue.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  icon={statusIcons[issue.status]}
                  label={issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                  color={statusColors[issue.status]}
                  size="small"
                />
                {(auth.user.role === 'officer' || auth.user.role === 'admin') && (
                  <IconButton size="small" onClick={(e) => handleMenuClick(e, issue)}>
                    <MoreIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
            
            <ListItemText
              primary={
                <Typography variant="body2" color="text.secondary" paragraph>
                  {issue.description}
                </Typography>
              }
              secondary={
                <Box sx={{ mt: 1 }}>
                  {issue.image && (
                    <Box sx={{ mt: 1, mb: 1 }}>
                      <img
                        src={`http://localhost:5000${issue.image}`}
                        alt="Issue"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          borderRadius: '4px'
                        }}
                      />
                    </Box>
                  )}
                  <Typography variant="caption" color="text.secondary" display="block">
                    Reported on: {new Date(issue.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Last updated: {new Date(issue.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>

      {/* Status Update Menu for Officers */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {auth.user.role === 'officer' && (
          <>
            <MenuItem onClick={() => handleStatusChange('pending')}>
              <PendingIcon sx={{ mr: 1 }} /> Mark as Pending
            </MenuItem>
            <MenuItem onClick={() => handleStatusChange('in-progress')}>
              <InProgressIcon sx={{ mr: 1 }} /> Mark as In Progress
            </MenuItem>
            <MenuItem onClick={() => handleStatusChange('resolved')}>
              <ResolvedIcon sx={{ mr: 1 }} /> Mark as Resolved
            </MenuItem>
          </>
        )}
        {auth.user.role === 'admin' && selectedIssue?.status === 'resolved' && (
          <MenuItem onClick={handleDeleteClick}>
            <DeleteIcon sx={{ mr: 1 }} /> Delete Issue
          </MenuItem>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Issue</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this resolved issue? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}