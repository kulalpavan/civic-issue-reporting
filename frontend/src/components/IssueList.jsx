import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  Avatar
} from '@mui/material';
import {
  PendingOutlined as PendingIcon,
  ScheduleOutlined as InProgressIcon,
  CheckCircleOutline as ResolvedIcon
} from '@mui/icons-material';

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

export default function IssueList({ issues }) {
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
        My Reported Issues
      </Typography>
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
              <Chip
                icon={statusIcons[issue.status]}
                label={issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                color={statusColors[issue.status]}
                size="small"
              />
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
                  <Typography variant="caption" color="text.secondary">
                    Reported on: {new Date(issue.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}