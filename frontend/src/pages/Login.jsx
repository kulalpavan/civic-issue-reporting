import { useState, useEffect } from 'react';
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
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  AdminPanelSettings as AdminIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  // Test connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        await api.testConnection();
        setConnectionStatus('connected');
      } catch (error) {
        setConnectionStatus('disconnected');
        console.error('❌ Connection test failed:', error);
      }
    };
    
    testConnection();
  }, []);

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
    
    // Clear previous errors
    setError('');
    
    // Validate form
    if (!formData.username.trim()) {
      setError('Please enter a username');
      return;
    }
    if (!formData.password.trim()) {
      setError('Please enter a password');
      return;
    }
    if (!formData.role) {
      setError('Please select a role');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('🔐 Attempting login with:', {
        username: formData.username,
        role: formData.role,
        passwordLength: formData.password.length
      });
      
      const result = await api.login(
        formData.username.trim(), 
        formData.password, 
        formData.role
      );
      
      console.log('✅ Login successful:', result);
      
      login(result.token, result.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Login failed:', error);
      
      // Enhanced error handling
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid username, password, or role. Please check your credentials.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Please fill in all required fields.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #e2e8f0 75%, #f8fafc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 1, sm: 2, md: 3 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15), transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.12), transparent 50%), radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.08), transparent 50%)',
          zIndex: 1
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.3) 20%, rgba(148, 163, 184, 0.8) 50%, rgba(148, 163, 184, 0.3) 80%, transparent 100%)',
          zIndex: 1
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 2 }}>
        <Box className="fade-in login-container">
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 5 } }}>
            <Avatar
              sx={{
                width: { xs: 70, sm: 80, md: 90, lg: 100 },
                height: { xs: 70, sm: 80, md: 90, lg: 100 },
                margin: '0 auto 20px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%)',
                fontSize: { xs: '1.8rem', sm: '2rem', md: '2.2rem', lg: '2.5rem' },
                boxShadow: '0 15px 35px rgba(245, 158, 11, 0.4), 0 8px 20px rgba(217, 119, 6, 0.3)',
                border: '3px solid rgba(255, 255, 255, 0.95)',
                color: '#ffffff'
              }}
            >
              <AccountBalanceIcon fontSize="large" />
            </Avatar>
            <Typography 
              variant="h1"
              component="h1" 
              className="gradient-text"
              sx={{ 
                fontWeight: { xs: 700, sm: 800, md: 900 },
                fontSize: { 
                  xs: '1.4rem',    // 22px - smaller for single line
                  sm: '1.8rem',    // 29px  
                  md: '2.2rem',    // 35px
                  lg: '2.6rem',    // 42px
                  xl: '3rem'       // 48px
                },
                lineHeight: 1,
                background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 30%, #1e293b 70%, #0f172a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: { xs: 1, sm: 1.5 },
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                px: { xs: 1, sm: 2 },
                maxWidth: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                letterSpacing: { xs: '-0.5px', sm: '-0.8px', md: '-1px' }
              }}
            >
              Civic Issue Reporting
            </Typography>
            <Typography 
              variant={isMobile ? "body2" : isTablet ? "body1" : "h6"} 
              sx={{ 
                color: '#e2e8f0',
                fontWeight: { xs: 500, sm: 600 },
                fontSize: { 
                  xs: '0.85rem',   // 14px
                  sm: '0.95rem',   // 15px
                  md: '1.05rem',   // 17px
                  lg: '1.15rem'    // 18px
                },
                lineHeight: 1.3,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                px: { xs: 2, sm: 3, md: 4 },
                maxWidth: { xs: '95%', sm: '85%', md: '75%' },
                mx: 'auto',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(226, 232, 240, 0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Building Better Communities Together
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}
          >
            {/* Login Form */}
            <Paper 
              elevation={24}
              className="slide-up"
              sx={{ 
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: { xs: 3, sm: 4, md: 5 },
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 50%, rgba(51, 65, 85, 0.90) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(148, 163, 184, 0.2)',
                width: '100%',
                maxWidth: { xs: '100%', sm: 450, md: 520, lg: 550 },
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 15px 35px rgba(15, 23, 42, 0.3), 0 5px 15px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 35px 60px rgba(0, 0, 0, 0.3), 0 20px 40px rgba(15, 23, 42, 0.4), 0 8px 25px rgba(0, 0, 0, 0.15)',
                  border: '2px solid rgba(248, 250, 252, 0.3)'
                }
              }}
            >
              <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
                <SecurityIcon 
                  sx={{ 
                    fontSize: { xs: 45, sm: 52, md: 60 }, 
                    color: '#10b981',
                    mb: 1.5,
                    filter: 'drop-shadow(0 4px 8px rgba(16, 185, 129, 0.4))'
                  }} 
                />
                <Typography 
                  variant={isMobile ? "h4" : "h3"} 
                  component="h2" 
                  gutterBottom
                  sx={{
                    fontWeight: { xs: 600, sm: 700 },
                    color: '#f8fafc',
                    fontSize: { 
                      xs: '1.5rem',   // 24px
                      sm: '1.75rem',  // 28px
                      md: '2rem',     // 32px
                      lg: '2.25rem'   // 36px
                    },
                    lineHeight: 1.2,
                    mb: 1,
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Secure Login
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    color: '#cbd5e1',
                    fontWeight: 400,
                    lineHeight: 1.4,
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  Access your civic portal
                </Typography>
              </Box>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 3,
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    borderLeft: '4px solid #dc2626',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    '& .MuiAlert-icon': {
                      fontSize: '1.3rem',
                      color: '#f87171'
                    },
                    '& .MuiAlert-message': {
                      color: '#fecaca',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 500,
                      lineHeight: 1.4
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              {connectionStatus && (
                <Alert 
                  severity={connectionStatus === 'connected' ? 'success' : 'warning'} 
                  sx={{ 
                    mb: 3,
                    borderRadius: 3,
                    backgroundColor: connectionStatus === 'connected' 
                      ? 'rgba(16, 185, 129, 0.1)' 
                      : 'rgba(245, 158, 11, 0.1)',
                    borderLeft: connectionStatus === 'connected'
                      ? '4px solid #10b981'
                      : '4px solid #f59e0b',
                    border: connectionStatus === 'connected'
                      ? '1px solid rgba(16, 185, 129, 0.2)'
                      : '1px solid rgba(245, 158, 11, 0.2)',
                    '& .MuiAlert-icon': {
                      fontSize: '1.3rem',
                      color: connectionStatus === 'connected' ? '#34d399' : '#fbbf24'
                    },
                    '& .MuiAlert-message': {
                      color: connectionStatus === 'connected' ? '#a7f3d0' : '#fde68a',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 500,
                      lineHeight: 1.4
                    }
                  }}
                >
                  {connectionStatus === 'connected' 
                    ? '✅ Connected to server' 
                    : '⚠️ Server connection issue - check if backend is running'
                  }
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
                  sx={{ 
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(248, 250, 252, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(203, 213, 225, 0.3)',
                        borderWidth: '2px'
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.6)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                        borderWidth: '2px'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#cbd5e1',
                      fontWeight: 500
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#10b981',
                      fontWeight: 600
                    },
                    '& .MuiInputBase-input': {
                      color: '#f1f5f9',
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 500,
                      '&::placeholder': {
                        color: 'rgba(203, 213, 225, 0.6)'
                      }
                    }
                  }}
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
                  sx={{ 
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(248, 250, 252, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(203, 213, 225, 0.3)',
                        borderWidth: '2px'
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.6)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                        borderWidth: '2px'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#cbd5e1',
                      fontWeight: 500
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#10b981',
                      fontWeight: 600
                    },
                    '& .MuiInputBase-input': {
                      color: '#f1f5f9',
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 500,
                      '&::placeholder': {
                        color: 'rgba(203, 213, 225, 0.6)'
                      }
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                          sx={{ color: '#94a3b8', '&:hover': { color: '#10b981' } }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <FormControl 
                  fullWidth 
                  margin="normal" 
                  required 
                  sx={{ 
                    mb: 3.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(248, 250, 252, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(203, 213, 225, 0.3)',
                        borderWidth: '2px'
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.6)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                        borderWidth: '2px'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#cbd5e1',
                      fontWeight: 500
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#10b981',
                      fontWeight: 600
                    },
                    '& .MuiSelect-select': {
                      color: '#f1f5f9',
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 500
                    },
                    '& .MuiSelect-icon': {
                      color: '#cbd5e1'
                    }
                  }}
                >
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    label="Role"
                  >
                    <MenuItem 
                      value="citizen"
                      sx={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        color: '#f1f5f9',
                        '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.1)' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PersonIcon fontSize="small" sx={{ color: '#10b981' }} />
                        <Typography sx={{ color: '#f1f5f9', fontWeight: 500 }}>Citizen</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem 
                      value="officer"
                      sx={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        color: '#f1f5f9',
                        '&:hover': { backgroundColor: 'rgba(236, 72, 153, 0.1)' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <BadgeIcon fontSize="small" sx={{ color: '#ec4899' }} />
                        <Typography sx={{ color: '#f1f5f9', fontWeight: 500 }}>Officer</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem 
                      value="admin"
                      sx={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        color: '#f1f5f9',
                        '&:hover': { backgroundColor: 'rgba(245, 158, 11, 0.1)' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <AdminIcon fontSize="small" sx={{ color: '#f59e0b' }} />
                        <Typography sx={{ color: '#f1f5f9', fontWeight: 500 }}>Admin</Typography>
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
                  className="ripple-button"
                  sx={{ 
                    py: { xs: 1.4, sm: 1.6, md: 1.8 },
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                    fontWeight: 600,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                    color: '#ffffff',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4), 0 3px 12px rgba(5, 150, 105, 0.3)',
                    transition: 'all 0.3s ease',
                    textTransform: 'none',
                    letterSpacing: '0.5px',
                    border: '2px solid transparent',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.5), 0 4px 15px rgba(5, 150, 105, 0.4)',
                      transform: 'translateY(-2px)',
                      border: '2px solid rgba(16, 185, 129, 0.3)'
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, rgba(100, 116, 139, 0.6) 0%, rgba(71, 85, 105, 0.6) 100%)',
                      color: 'rgba(203, 213, 225, 0.6)',
                      boxShadow: 'none',
                      transform: 'none',
                      border: '2px solid transparent'
                    }
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}