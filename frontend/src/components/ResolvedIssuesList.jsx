import { useState } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip
} from '@mui/material';
import {
  DeleteOutline as DeleteIcon,
  CheckCircleOutline as ResolvedIcon
} from '@mui/icons-material';
import * as api from '../api';

export default function ResolvedIssuesList({ issues, onIssueDeleted }) {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState('');

  const resolvedIssues = issues.filter(issue => issue.status === 'resolved');

  const handleDeleteClick = (issue) => {
    setSelectedIssue(issue);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.deleteIssue(selectedIssue.id);
      if (onIssueDeleted) {
        onIssueDeleted();
      }
      setError('');
    } catch (error) {
      setError('Failed to delete issue');
    }
    setDeleteDialogOpen(false);
    setSelectedIssue(null);
  };

  if (resolvedIssues.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1">No resolved issues found.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ResolvedIcon color="success" />
        Resolved Issues Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <List>
        {resolvedIssues.map((issue) => (
          <ListItem
            key={issue.id}
            divider
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' }
            }}
          >
            <ListItemText
              primary={issue.title}
              secondary={
                <>
                  <Typography variant="body2" color="text.secondary">
                    {issue.description}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      icon={<ResolvedIcon />}
                      label="Resolved"
                      color="success"
                      size="small"
                    />
                  </Box>
                  {issue.image && (
                    <Box sx={{ mt: 1 }}>
                      <img
                        src={`http://localhost:5000${issue.image}`}
                        alt="Issue"
                        style={{
                          maxWidth: '150px',
                          maxHeight: '150px',
                          borderRadius: '4px'
                        }}
                      />
                    </Box>
                  )}
                </>
              }
              sx={{ flex: 1, mr: 2 }}
            />
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mt: { xs: 2, sm: 0 },
              width: { xs: '100%', sm: 'auto' }
            }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteClick(issue)}
                fullWidth={false}
              >
                Remove
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Resolved Issue</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete this resolved issue? This action cannot be undone.
          </Typography>
          {selectedIssue && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Issue Title: {selectedIssue.title}
              </Typography>
            </Box>
          )}
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