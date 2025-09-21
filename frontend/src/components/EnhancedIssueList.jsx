import { useState } from 'react';
import {
  Paper,
  Typography,
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
  Alert,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Fade,
  Grid,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  PendingOutlined as PendingIcon,
  ScheduleOutlined as InProgressIcon,
  CheckCircleOutline as ResolvedIcon,
  MoreVert as MoreIcon,
  DeleteOutline as DeleteIcon,
  CalendarToday as CalendarIcon,
  Update as UpdateIcon,
  Person as PersonIcon,
  PhotoOutlined as PhotoIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api';

const statusColors = {
  pending: { color: '#FFA726', bg: 'rgba(255, 167, 38, 0.1)' },
  'in-progress': { color: '#42A5F5', bg: 'rgba(66, 165, 245, 0.1)' },
  resolved: { color: '#66BB6A', bg: 'rgba(102, 187, 106, 0.1)' }
};

const statusIcons = {
  pending: <PendingIcon />,
  'in-progress': <InProgressIcon />,
  resolved: <ResolvedIcon />
};

export default function EnhancedIssueList({ issues, onIssueUpdated, onIssueDeleted }) {
  const { auth } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!issues || issues.length === 0) {
    return (
      <Fade in timeout={600}>
        <Card 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              margin: '0 auto 16px'
            }}
          >
            <AssignmentIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" gutterBottom>
            No Issues Found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {auth.user.role === 'citizen' 
              ? "You haven't reported any issues yet. Start by reporting your first issue!"
              : "No issues have been reported in the system yet."
            }
          </Typography>
        </Card>
      </Fade>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
          <AssignmentIcon />
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={600}>
            {auth.user.role === 'citizen' ? 'My Reported Issues' : 'All Issues'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {issues.length} issue{issues.length !== 1 ? 's' : ''} found
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

      {/* Issues Grid */}
      <Grid container spacing={3}>
        {issues.map((issue, index) => (
          <Grid item xs={12} md={6} lg={4} key={issue.id}>
            <Fade in timeout={600 + index * 100}>
              <Card 
                className="card-hover"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Status Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 2
                  }}
                >
                  <Chip
                    icon={statusIcons[issue.status]}
                    label={issue.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    sx={{
                      bgcolor: statusColors[issue.status].color,
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
                      background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                  />
                )}

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Title and Menu */}
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
                    
                    {(auth.user.role === 'officer' || auth.user.role === 'admin') && (
                      <Tooltip title="Actions">
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleMenuClick(e, issue)}
                          sx={{
                            bgcolor: 'rgba(0, 0, 0, 0.04)',
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.08)'
                            }
                          }}
                        >
                          <MoreIcon />
                        </IconButton>
                      </Tooltip>
                    )}
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
                        Reported: {formatDate(issue.createdAt)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <UpdateIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        Updated: {formatDate(issue.updatedAt)}
                      </Typography>
                    </Box>

                    {issue.image && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhotoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          Includes photo attachment
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>

                {/* Status Indicator Bar */}
                <Box
                  sx={{
                    height: 4,
                    background: `linear-gradient(90deg, ${statusColors[issue.status].color} 0%, ${statusColors[issue.status].color}80 100%)`
                  }}
                />
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Status Update Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            minWidth: 200
          }
        }}
      >
        {auth.user.role === 'officer' && (
          <>
            <MenuItem 
              onClick={() => handleStatusChange('pending')}
              sx={{ py: 1.5 }}
            >
              <PendingIcon sx={{ mr: 2, color: statusColors.pending.color }} />
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Mark as Pending
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Issue needs attention
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem 
              onClick={() => handleStatusChange('in-progress')}
              sx={{ py: 1.5 }}
            >
              <InProgressIcon sx={{ mr: 2, color: statusColors['in-progress'].color }} />
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Mark as In Progress
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Currently being worked on
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem 
              onClick={() => handleStatusChange('resolved')}
              sx={{ py: 1.5 }}
            >
              <ResolvedIcon sx={{ mr: 2, color: statusColors.resolved.color }} />
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Mark as Resolved
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Issue has been fixed
                </Typography>
              </Box>
            </MenuItem>
          </>
        )}
        {auth.user.role === 'admin' && selectedIssue?.status === 'resolved' && (
          <MenuItem 
            onClick={handleDeleteClick}
            sx={{ py: 1.5, color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 2 }} />
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Delete Issue
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Permanently remove this issue
              </Typography>
            </Box>
          </MenuItem>
        )}
      </Menu>

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
          <Typography variant="h6" fontWeight={600}>
            Delete Issue
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Are you sure you want to delete this resolved issue? This action cannot be undone.
          </Typography>
          {selectedIssue && (
            <Box 
              sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: 'error.lighter',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'error.light'
              }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                {selectedIssue.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedIssue.description}
              </Typography>
            </Box>
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
            Delete Issue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}