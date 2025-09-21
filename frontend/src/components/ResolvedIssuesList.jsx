import { useState } from 'react';
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Fade,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  DeleteOutline as DeleteIcon,
  CheckCircleOutline as ResolvedIcon,
  CalendarToday as CalendarIcon,
  PhotoOutlined as PhotoIcon,
  CleaningServices as CleanupIcon
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (resolvedIssues.length === 0) {
    return (
      <Fade in timeout={600}>
        <Card 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            mb: 4
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'success.main',
              margin: '0 auto 16px'
            }}
          >
            <ResolvedIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" gutterBottom>
            No Resolved Issues
          </Typography>
          <Typography variant="body1" color="text.secondary">
            No resolved issues available for cleanup. Issues will appear here once they are marked as resolved.
          </Typography>
        </Card>
      </Fade>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
          <CleanupIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Resolved Issues Cleanup
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {resolvedIssues.length} resolved issue{resolvedIssues.length !== 1 ? 's' : ''} ready for cleanup
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            border: '1px solid rgba(239, 83, 80, 0.3)'
          }}
        >
          {error}
        </Alert>
      )}

      {/* Resolved Issues Grid */}
      <Grid container spacing={3}>
        {resolvedIssues.map((issue, index) => (
          <Grid item xs={12} md={6} lg={4} key={issue.id}>
            <Fade in timeout={600 + index * 100}>
              <Card 
                className="card-hover"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)',
                  border: '1px solid rgba(102, 187, 106, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Success Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 2
                  }}
                >
                  <Chip
                    icon={<ResolvedIcon />}
                    label="Resolved"
                    sx={{
                      bgcolor: '#66BB6A',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      '& .MuiChip-icon': {
                        color: 'white'
                      }
                    }}
                  />
                </Box>

                {/* Issue Image */}
                {issue.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:5000${issue.image}`}
                    alt={issue.title}
                    sx={{
                      objectFit: 'cover',
                      filter: 'brightness(0.9) saturate(0.8)',
                      background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                  />
                )}

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Title and Delete Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        lineHeight: 1.3,
                        flex: 1,
                        mr: 1
                      }}
                    >
                      {issue.title}
                    </Typography>
                    
                    <Tooltip title="Remove from system">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteClick(issue)}
                        sx={{
                          bgcolor: 'rgba(239, 83, 80, 0.1)',
                          color: 'error.main',
                          '&:hover': {
                            bgcolor: 'rgba(239, 83, 80, 0.2)'
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Description */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 3,
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {issue.description}
                  </Typography>

                  {/* Metadata */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        Resolved: {formatDate(issue.updatedAt)}
                      </Typography>
                    </Box>

                    {issue.image && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhotoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          Includes photo evidence
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>

                {/* Action Area */}
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(issue)}
                    fullWidth
                    sx={{
                      borderRadius: 2,
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: 'rgba(239, 83, 80, 0.05)'
                      }
                    }}
                  >
                    Remove Issue
                  </Button>
                </Box>

                {/* Success Indicator Bar */}
                <Box
                  sx={{
                    height: 4,
                    background: 'linear-gradient(90deg, #66BB6A 0%, #81C784 100%)'
                  }}
                />
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600} color="error.main">
            Permanently Delete Resolved Issue
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Are you sure you want to permanently delete this resolved issue? This action cannot be undone and will remove all associated data.
          </Typography>
          {selectedIssue && (
            <Card 
              sx={{ 
                bgcolor: 'error.lighter',
                border: '1px solid',
                borderColor: 'error.light',
                borderRadius: 2
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} color="error.dark">
                  {selectedIssue.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {selectedIssue.description}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    Resolved on {formatDate(selectedIssue.updatedAt)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}