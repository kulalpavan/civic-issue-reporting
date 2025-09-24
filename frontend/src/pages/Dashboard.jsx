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
  Grow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Badge,
  Tooltip,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Backdrop
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Pending as PendingIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  ViewList as ViewListIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  GetApp as ExportIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import NavBar from '../components/NavBar';
import ResolvedIssuesList from '../components/ResolvedIssuesList';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext';
import ReportIssue from '../components/ReportIssue';
import EnhancedIssueList from '../components/EnhancedIssueList';
import * as api from '../api';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('overview');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [notificationCount, setNotificationCount] = useState(3);
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
      setFilteredIssues(fetchedIssues);
      
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

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Handle speed dial actions
  const speedDialActions = [
    { 
      icon: <AddIcon />, 
      name: 'Report Issue', 
      onClick: () => setReportDialogOpen(true),
      disabled: auth.user.role !== 'citizen'
    },
    { 
      icon: <ViewListIcon />, 
      name: 'View All Issues', 
      onClick: () => setSelectedView('issues') 
    },
    { 
      icon: <ExportIcon />, 
      name: 'Export Data', 
      onClick: () => handleExportData() 
    },
    { 
      icon: <SettingsIcon />, 
      name: 'Settings', 
      onClick: () => setSettingsDialogOpen(true) 
    }
  ];

  // Handle export data
  const handleExportData = () => {
    const dataStr = JSON.stringify(issues, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'civic-issues-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Handle refresh with visual feedback
  const handleRefresh = async () => {
    setLoading(true);
    await fetchIssues();
    // Show success notification
    setNotificationCount(prev => prev + 1);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle search functionality
  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredIssues(issues);
      return;
    }

    const searchResults = issues.filter(issue => 
      issue.title?.toLowerCase().includes(query.toLowerCase()) ||
      issue.description?.toLowerCase().includes(query.toLowerCase()) ||
      issue.category?.toLowerCase().includes(query.toLowerCase()) ||
      issue.status?.toLowerCase().includes(query.toLowerCase()) ||
      issue.location?.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredIssues(searchResults);
  };

  const handleSearchSubmit = () => {
    handleSearch(searchQuery);
    if (selectedView !== 'issues') {
      setSelectedView('issues');
    }
    setSearchDialogOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredIssues(issues);
  };

  // Update filtered issues when main issues array changes
  useEffect(() => {
    if (!searchQuery) {
      setFilteredIssues(issues);
    } else {
      handleSearch(searchQuery);
    }
  }, [issues]);

  // Navigation menu items
  const menuItems = [
    { text: 'Overview', icon: <DashboardIcon />, view: 'overview' },
    { text: 'All Issues', icon: <AssignmentIcon />, view: 'issues' },
    { text: 'Analytics', icon: <AnalyticsIcon />, view: 'analytics' },
    { text: 'Resolved Issues', icon: <CheckCircleIcon />, view: 'resolved', role: 'admin' }
  ];

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
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #e2e8f0 75%, #f8fafc 100%)',
      position: 'relative'
    }}>
      {/* Full-Screen App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#f8fafc' }}>
              Civic Dashboard
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Search Issues">
              <IconButton color="inherit" onClick={() => setSearchDialogOpen(true)}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={notificationCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Refresh Data">
              <IconButton 
                color="inherit" 
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshIcon sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Logout">
              <IconButton 
                color="inherit" 
                onClick={handleLogout}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    color: '#ef4444'
                  }
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
            
            <Avatar 
              sx={{ 
                bgcolor: '#10b981',
                width: 40,
                height: 40,
                cursor: 'pointer'
              }}
              onClick={() => setSettingsDialogOpen(true)}
            >
              {auth?.user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Interactive Side Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            borderRight: '1px solid rgba(148, 163, 184, 0.1)',
            pt: 8
          }
        }}
      >
        <List sx={{ px: 2, pt: 2 }}>
          {menuItems.map((item) => {
            if (item.role && item.role !== auth.user.role) return null;
            
            return (
              <ListItem
                button
                key={item.text}
                onClick={() => setSelectedView(item.view)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: selectedView === item.view ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  border: selectedView === item.view ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid transparent',
                  '&:hover': {
                    bgcolor: 'rgba(248, 250, 252, 0.05)',
                    border: '1px solid rgba(148, 163, 184, 0.1)'
                  }
                }}
              >
                <ListItemIcon sx={{ color: selectedView === item.view ? '#10b981' : '#cbd5e1' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      color: selectedView === item.view ? '#10b981' : '#f1f5f9',
                      fontWeight: selectedView === item.view ? 600 : 400
                    }
                  }}
                />
              </ListItem>
            );
          })}
        </List>
        
        {/* User Info Section */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: 20, 
          left: 16, 
          right: 16,
          p: 2,
          borderRadius: 2,
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1 }}>
            Logged in as
          </Typography>
          <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 600 }}>
            {auth?.user?.username}
          </Typography>
          <Chip 
            label={auth?.user?.role?.toUpperCase()} 
            size="small" 
            sx={{ 
              mt: 1,
              bgcolor: '#10b981',
              color: 'white',
              fontSize: '0.75rem'
            }} 
          />
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              mt: 2,
              borderColor: 'rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              '&:hover': {
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444'
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 11,
          ml: isMobile ? 0 : '280px',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh'
        }}
      >
        {/* Dynamic Content Based on Selected View */}
        <Container maxWidth="xl">
          {selectedView === 'overview' && (
            <>
              {/* Welcome Header */}
              <Fade in timeout={600}>
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h4" 
                    component="h1"
                    sx={{ 
                      fontWeight: 700,
                      color: '#f8fafc',
                      mb: 1,
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    Welcome back, {auth?.user?.username}!
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#cbd5e1',
                      fontWeight: 400,
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    Here's what's happening in your community
                  </Typography>
                </Box>
              </Fade>

              {/* Interactive Statistics Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((stat, index) => (
                  <Grid item xs={12} sm={6} md={3} key={stat.title}>
                    <Grow in timeout={600 + index * 200}>
                      <Card 
                        className="enhanced-card"
                        sx={{
                          background: stat.bgGradient,
                          color: 'white',
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-8px) scale(1.02)',
                            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)'
                          },
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
                        onClick={() => setSelectedView('issues')}
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
                                height: 56,
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                  transform: 'rotate(10deg)'
                                }
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

              {/* Enhanced Charts Section */}
              <Grid container spacing={4} sx={{ mb: 4 }}>
                {/* Bar Chart */}
                <Grid item xs={12} lg={8}>
                  <Fade in timeout={1000}>
                    <Card 
                      className="enhanced-card"
                      sx={{ 
                        height: 450,
                        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: '#3b82f6', mr: 2 }}>
                              <AnalyticsIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b' }}>
                                Issues Overview
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Comprehensive breakdown of issue statistics
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Filter Data">
                              <IconButton size="small">
                                <FilterListIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Export Chart">
                              <IconButton size="small" onClick={handleExportData}>
                                <ExportIcon />
                              </IconButton>
                            </Tooltip>
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
                      className="enhanced-card"
                      sx={{ 
                        height: 450,
                        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)'
                      }}
                    >
                      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Avatar sx={{ bgcolor: '#10b981', mr: 2 }}>
                            <TrendingUpIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b' }}>
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
            </>
          )}

          {/* Issues View */}
          {selectedView === 'issues' && (
            <Fade in timeout={600}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h4" sx={{ color: '#f8fafc', fontWeight: 700 }}>
                    {filteredIssues.length > 0 && filteredIssues.length !== issues.length 
                      ? `Search Results (${filteredIssues.length} of ${issues.length})` 
                      : 'All Issues'}
                  </Typography>
                  {filteredIssues.length !== issues.length && (
                    <Button 
                      variant="outlined" 
                      onClick={clearSearch}
                      sx={{ color: '#f8fafc', borderColor: '#f8fafc' }}
                    >
                      Clear Search
                    </Button>
                  )}
                </Box>
                <EnhancedIssueList 
                  issues={filteredIssues.length > 0 || searchQuery ? filteredIssues : issues} 
                  onIssueUpdated={fetchIssues}
                  onIssueDeleted={fetchIssues}
                />
              </Box>
            </Fade>
          )}

          {/* Analytics View */}
          {selectedView === 'analytics' && (
            <Fade in timeout={600}>
              <Box>
                <Typography variant="h4" sx={{ color: '#f8fafc', mb: 3, fontWeight: 700 }}>
                  Analytics Dashboard
                </Typography>
                {/* Add more detailed analytics here */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, background: 'rgba(255, 255, 255, 0.9)' }}>
                      <Bar data={barChartData} options={chartOptions} />
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, background: 'rgba(255, 255, 255, 0.9)' }}>
                      <Pie data={pieChartData} options={pieOptions} />
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          )}

          {/* Resolved Issues View (Admin Only) */}
          {selectedView === 'resolved' && auth.user.role === 'admin' && (
            <Fade in timeout={600}>
              <Box>
                <Typography variant="h4" sx={{ color: '#f8fafc', mb: 3, fontWeight: 700 }}>
                  Resolved Issues
                </Typography>
                <ResolvedIssuesList 
                  issues={issues}
                  onIssueDeleted={fetchIssues}
                />
              </Box>
            </Fade>
          )}
        </Container>
      </Box>

      {/* Interactive Speed Dial */}
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{ 
          position: 'fixed', 
          bottom: 24, 
          right: 24,
          '& .MuiSpeedDial-fab': {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
            }
          }
        }}
        icon={<SpeedDialIcon />}
        open={speedDialOpen}
        onClose={() => setSpeedDialOpen(false)}
        onOpen={() => setSpeedDialOpen(true)}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
            disabled={action.disabled}
          />
        ))}
      </SpeedDial>

      {/* Report Issue Dialog */}
      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>Report New Issue</Typography>
          <IconButton onClick={() => setReportDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ReportIssue onIssueSubmitted={() => {
            fetchIssues();
            setReportDialogOpen(false);
          }} />
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Dashboard preferences and account settings will be available here.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<NotificationsIcon />}>
              Notification Settings
            </Button>
            <Button variant="outlined" startIcon={<ViewIcon />}>
              Display Options
            </Button>
            <Button variant="outlined" startIcon={<ExportIcon />} onClick={handleExportData}>
              Export Data
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Search Dialog */}
      <Dialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SearchIcon sx={{ color: '#1e3a8a' }} />
            <Typography variant="h6" fontWeight={600}>Search Issues</Typography>
          </Box>
          <IconButton onClick={() => setSearchDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: '#6b7280' }}>
            Search by title, description, category, status, or location
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: '#6b7280', mr: 1 }} />
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#1e3a8a' },
                '&.Mui-focused fieldset': { borderColor: '#1e3a8a' }
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#1e3a8a' }
            }}
          />
          {searchQuery && (
            <Typography variant="caption" sx={{ color: '#6b7280', mt: 1, display: 'block' }}>
              Press Enter or click Search to find issues
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => {
              setSearchQuery('');
              setSearchDialogOpen(false);
            }}
            sx={{ color: '#6b7280' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSearchSubmit}
            variant="contained"
            disabled={!searchQuery.trim()}
            sx={{
              background: '#1e3a8a',
              '&:hover': { background: '#1e40af' }
            }}
          >
            Search
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <Box sx={{ textAlign: 'center' }}>
          <LinearProgress sx={{ width: 200, mb: 2 }} />
          <Typography>Loading dashboard data...</Typography>
        </Box>
      </Backdrop>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
}