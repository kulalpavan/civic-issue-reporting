import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  Grow
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Pending as PendingIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0
  });

  const fetchIssues = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [auth.user.role]);

  const statCards = [
    {
      title: 'Total Issues',
      value: statsData.total,
      icon: <AssignmentIcon />,
      color: '#1565C0',
      bgGradient: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
    },
    {
      title: 'Resolved',
      value: statsData.resolved,
      icon: <CheckCircleIcon />,
      color: '#66BB6A',
      bgGradient: 'linear-gradient(135deg, #66BB6A 0%, #81C784 100%)',
      percentage: statsData.total > 0 ? (statsData.resolved / statsData.total * 100).toFixed(1) : 0
    },
    {
      title: 'In Progress',
      value: statsData.inProgress,
      icon: <ScheduleIcon />,
      color: '#FFA726',
      bgGradient: 'linear-gradient(135deg, #FFA726 0%, #FFB74D 100%)',
      percentage: statsData.total > 0 ? (statsData.inProgress / statsData.total * 100).toFixed(1) : 0
    },
    {
      title: 'Pending',
      value: statsData.pending,
      icon: <PendingIcon />,
      color: '#EF5350',
      bgGradient: 'linear-gradient(135deg, #EF5350 0%, #E57373 100%)',
      percentage: statsData.total > 0 ? (statsData.pending / statsData.total * 100).toFixed(1) : 0
    }
  ];

  const barChartData = {
    labels: ['Total', 'Resolved', 'Pending', 'In Progress'],
    datasets: [
      {
        label: 'Issues Count',
        data: [statsData.total, statsData.resolved, statsData.pending, statsData.inProgress],
        backgroundColor: [
          'rgba(21, 101, 192, 0.8)',
          'rgba(102, 187, 106, 0.8)',
          'rgba(239, 83, 80, 0.8)',
          'rgba(255, 167, 38, 0.8)',
        ],
        borderColor: [
          '#1565C0',
          '#66BB6A',
          '#EF5350',
          '#FFA726',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const pieChartData = {
    labels: ['Resolved', 'Pending', 'In Progress'],
    datasets: [
      {
        data: [statsData.resolved, statsData.pending, statsData.inProgress],
        backgroundColor: [
          'rgba(102, 187, 106, 0.8)',
          'rgba(239, 83, 80, 0.8)',
          'rgba(255, 167, 38, 0.8)',
        ],
        borderColor: [
          '#66BB6A',
          '#EF5350',
          '#FFA726',
        ],
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: 'Inter'
        },
        bodyFont: {
          family: 'Inter'
        },
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            family: 'Inter'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        ticks: {
          font: {
            family: 'Inter'
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: 'Inter'
        },
        bodyFont: {
          family: 'Inter'
        },
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <Box sx={{ bgcolor: '#F5F7FA', minHeight: '100vh' }}>
      <NavBar />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Fade in timeout={600}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography 
                  variant="h4" 
                  component="h1"
                  sx={{ 
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 1
                  }}
                >
                  Dashboard Overview
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ fontSize: '1.1rem' }}
                >
                  Welcome back, {auth?.user?.username}! Here's what's happening in your community.
                </Typography>
              </Box>
              
              <IconButton
                onClick={fetchIssues}
                disabled={loading}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '&:disabled': { bgcolor: 'grey.300' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>
        </Fade>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <Grow in timeout={600 + index * 200}>
                <Card 
                  className="card-hover"
                  sx={{
                    background: stat.bgGradient,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                    }
                  }}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, fontSize: '2.5rem' }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          width: 56,
                          height: 56
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                    </Box>
                    
                    {stat.percentage !== undefined && (
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Progress
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {stat.percentage}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={parseFloat(stat.percentage)}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: 'rgba(255, 255, 255, 0.9)',
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Bar Chart */}
          <Grid item xs={12} lg={8}>
            <Fade in timeout={1000}>
              <Card 
                className="card-hover"
                sx={{ 
                  height: 400,
                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.18)'
                }}
              >
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <AnalyticsIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Issues Overview
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Comprehensive breakdown of issue statistics
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ flex: 1, position: 'relative' }}>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <LinearProgress sx={{ width: '50%' }} />
                      </Box>
                    ) : (
                      <Bar data={barChartData} options={chartOptions} />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Pie Chart */}
          <Grid item xs={12} lg={4}>
            <Fade in timeout={1200}>
              <Card 
                className="card-hover"
                sx={{ 
                  height: 400,
                  background: 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.18)'
                }}
              >
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                      <TrendingUpIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        Status Distribution
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Current issue status breakdown
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ flex: 1, position: 'relative' }}>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <LinearProgress sx={{ width: '50%' }} />
                      </Box>
                    ) : (
                      <Pie data={pieChartData} options={pieOptions} />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* Issue Management Section */}
        <Fade in timeout={1400}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              {/* Report Issue Form for Citizens */}
              {auth.user.role === 'citizen' && (
                <Box sx={{ mb: 4 }}>
                  <ReportIssue onIssueSubmitted={fetchIssues} />
                </Box>
              )}

              {/* Resolved Issues List for Admin */}
              {auth.user.role === 'admin' && (
                <Box sx={{ mb: 4 }}>
                  <ResolvedIssuesList 
                    issues={issues}
                    onIssueDeleted={fetchIssues}
                  />
                </Box>
              )}

              {/* Enhanced Issue List for All Roles */}
              <EnhancedIssueList 
                issues={issues} 
                onIssueUpdated={fetchIssues}
                onIssueDeleted={fetchIssues}
              />
            </Grid>
          </Grid>
        </Fade>
      </Container>
    </Box>
  );
}