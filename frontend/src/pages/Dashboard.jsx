import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography,
  Box,
  Divider
} from '@mui/material';
import NavBar from '../components/NavBar';
import ResolvedIssuesList from '../components/ResolvedIssuesList';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext';
import ReportIssue from '../components/ReportIssue';
import EnhancedIssueList from '../components/EnhancedIssueList';
import * as api from '../api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const { auth } = useAuth();
  const [issues, setIssues] = useState([]);
  const [statsData, setStatsData] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0
  });

  const fetchIssues = async () => {
    try {
      let fetchedIssues;
      if (auth.user.role === 'citizen') {
        fetchedIssues = await api.getMyIssues();
      } else {
        fetchedIssues = await api.getAllIssues();
      }
      setIssues(fetchedIssues);
      
      // Calculate statistics
      setStatsData({
        total: fetchedIssues.length,
        resolved: fetchedIssues.filter(i => i.status === 'resolved').length,
        pending: fetchedIssues.filter(i => i.status === 'pending').length,
        inProgress: fetchedIssues.filter(i => i.status === 'in-progress').length
      });
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [auth.user.role]);

  const barChartData = {
    labels: ['Total', 'Resolved', 'Pending', 'In Progress'],
    datasets: [
      {
        label: 'Issues Count',
        data: [statsData.total, statsData.resolved, statsData.pending, statsData.inProgress],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Resolved', 'Pending', 'In Progress'],
    datasets: [
      {
        data: [statsData.resolved, statsData.pending, statsData.inProgress],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
      
      <Grid container spacing={3}>
        {/* Statistics Section */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {/* Charts */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Issues Overview
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar 
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  Quick Stats
                </Typography>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                  <Typography variant="body1">
                    Total Issues: {statsData.total}
                  </Typography>
                  <Typography variant="body1">
                    Resolved: {statsData.resolved}
                  </Typography>
                  <Typography variant="body1">
                    Pending: {statsData.pending}
                  </Typography>
                  <Typography variant="body1">
                    In Progress: {statsData.inProgress}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ height: 200 }}>
                  <Pie 
                    data={pieChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Issue Management Section */}
        <Grid item xs={12}>
          {/* Report Issue Form for Citizens */}
          {auth.user.role === 'citizen' && (
            <ReportIssue onIssueSubmitted={fetchIssues} />
          )}

          {/* Resolved Issues List for Admin */}
          {auth.user.role === 'admin' && (
            <ResolvedIssuesList 
              issues={issues}
              onIssueDeleted={fetchIssues}
            />
          )}

          {/* Enhanced Issue List for All Roles */}
          <EnhancedIssueList 
            issues={issues} 
            onIssueUpdated={fetchIssues}
            onIssueDeleted={fetchIssues}
          />
        </Grid>
      </Grid>
    </Container>
    </>
  );
}