import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Avatar,
  Divider,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Badge as BadgeIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { token, user } = await api.login(
        formData.username, 
        formData.password, 
        formData.role
      );
      
      login(token, user);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const roleInfo = [
    {
      role: 'citizen',
      icon: <PersonIcon />,
      title: 'Citizen Portal',
      description: 'Report issues and track their progress',
      color: '#42A5F5',
      credentials: { username: 'citizen1', password: 'citizen123' }
    },
    {
      role: 'officer',
      icon: <BadgeIcon />,
      title: 'Officer Dashboard',
      description: 'Manage and resolve reported issues',
      color: '#66BB6A',
      credentials: { username: 'officer1', password: 'officer123' }
    },
    {
      role: 'admin',
      icon: <AdminIcon />,
      title: 'Admin Panel',
      description: 'Full system administration and oversight',
      color: '#FFA726',
      credentials: { username: 'admin1', password: 'admin123' }
    }
  ];

  const fillDemoCredentials = (role, username, password) => {
    setFormData({ role, username, password });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box className="fade-in">
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                fontSize: '2rem'
              }}
            >
              <AccountBalanceIcon fontSize="large" />
            </Avatar>
            <Typography 
              variant="h3" 
              component="h1" 
              className="gradient-text"
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Civic Issue Reporting
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white',
                opacity: 0.9,
                fontWeight: 300
              }}
            >
              Building Better Communities Together
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: 4,
              alignItems: 'start'
            }}
          >
            {/* Login Form */}
            <Paper 
              elevation={24}
              className="slide-up"
              sx={{ 
                p: 4,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                order: isMobile ? 2 : 1
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <SecurityIcon 
                  sx={{ 
                    fontSize: 48, 
                    color: theme.palette.primary.main,
                    mb: 1 
                  }} 
                />
                <Typography variant="h4" component="h2" gutterBottom>
                  Secure Login
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Access your civic portal
                </Typography>
              </Box>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      fontSize: '1.2rem'
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  margin="normal"
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <FormControl fullWidth margin="normal" required sx={{ mb: 3 }}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    label="Role"
                  >
                    <MenuItem value="citizen">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" />
                        Citizen
                      </Box>
                    </MenuItem>
                    <MenuItem value="officer">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BadgeIcon fontSize="small" />
                        Officer
                      </Box>
                    </MenuItem>
                    <MenuItem value="admin">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AdminIcon fontSize="small" />
                        Admin
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
                    }
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </Paper>

            {/* Demo Credentials */}
            <Box className="slide-up" sx={{ order: isMobile ? 1 : 2 }}>
              <Paper
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  mb: 3
                }}
              >
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 600,
                    mb: 2,
                    textAlign: 'center'
                  }}
                >
                  Demo Credentials
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    mb: 3
                  }}
                >
                  Click on any role below to auto-fill login credentials
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {roleInfo.map((info) => (
                    <Card
                      key={info.role}
                      className="card-hover"
                      onClick={() => fillDemoCredentials(info.role, info.credentials.username, info.credentials.password)}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.25)',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: info.color,
                              width: 40,
                              height: 40
                            }}
                          >
                            {info.icon}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '1rem',
                                mb: 0.5
                              }}
                            >
                              {info.title}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.875rem'
                              }}
                            >
                              {info.description}
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                              <Chip 
                                label={info.credentials.username}
                                size="small"
                                sx={{ 
                                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                                  color: 'white',
                                  fontSize: '0.75rem'
                                }}
                              />
                              <Chip 
                                label={info.credentials.password}
                                size="small"
                                sx={{ 
                                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                                  color: 'white',
                                  fontSize: '0.75rem'
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>

              {/* Features List */}
              <Paper
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'white',
                    fontWeight: 600,
                    mb: 2,
                    textAlign: 'center'
                  }}
                >
                  Platform Features
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    'Report civic issues with photos',
                    'Track issue status and progress',
                    'Real-time dashboard analytics',
                    'Role-based access control',
                    'Community collaboration tools'
                  ].map((feature, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: '#66BB6A'
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ color: 'rgba(255, 255, 255, 0.9)' }}
                      >
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}