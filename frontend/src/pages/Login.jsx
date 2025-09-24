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
      const result = await api.login(
        formData.username.trim(), 
        formData.password, 
        formData.role
      );
      
      login(result.token, result.user);
      navigate('/dashboard');
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid username, password, or role. Please check your credentials.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Please fill in all required fields.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
      {/* Government Header */}
      <Box sx={{ background: '#1e3a8a', color: 'white', py: 2, borderBottom: '4px solid #dc2626' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AccountBalanceIcon sx={{ fontSize: '2rem' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  Government of India
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Official Government Portal
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon sx={{ fontSize: '1.2rem' }} />
              <Typography variant="caption">Secure Login</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, background: 'white', border: '1px solid #e5e7eb', borderTop: '4px solid #1e3a8a' }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar sx={{ width: 80, height: 80, margin: '0 auto 16px', background: '#1e3a8a', color: 'white' }}>
                <AccountBalanceIcon sx={{ fontSize: '2.5rem' }} />
              </Avatar>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#1f2937', mb: 1, fontFamily: '"Times New Roman", serif' }}>
                Civic Issue Reporting System
              </Typography>
              <Typography variant="h6" sx={{ color: '#374151', fontWeight: 500, mb: 1 }}>Login</Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 400 }}>
                Enter your credentials to access the system
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 1, backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
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
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    backgroundColor: '#f9fafb',
                    '&:hover fieldset': { borderColor: '#1e3a8a' },
                    '&.Mui-focused fieldset': { borderColor: '#1e3a8a' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#1e3a8a' }
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
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    backgroundColor: '#f9fafb',
                    '&:hover fieldset': { borderColor: '#1e3a8a' },
                    '&.Mui-focused fieldset': { borderColor: '#1e3a8a' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#1e3a8a' }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <FormControl fullWidth margin="normal" required sx={{ mb: 3 }}>
                <InputLabel sx={{ '&.Mui-focused': { color: '#1e3a8a' } }}>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                  sx={{
                    borderRadius: 1,
                    backgroundColor: '#f9fafb',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1e3a8a' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1e3a8a' }
                  }}
                >
                  <MenuItem value="citizen">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ fontSize: '1.2rem', color: '#6b7280' }} />
                      Citizen
                    </Box>
                  </MenuItem>
                  <MenuItem value="officer">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BadgeIcon sx={{ fontSize: '1.2rem', color: '#6b7280' }} />
                      Officer
                    </Box>
                  </MenuItem>
                  <MenuItem value="admin">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AdminIcon sx={{ fontSize: '1.2rem', color: '#6b7280' }} />
                      Administrator
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 1,
                  background: '#1e3a8a',
                  boxShadow: '0 2px 4px rgba(30, 58, 138, 0.2)',
                  '&:hover': { background: '#1e40af', boxShadow: '0 4px 8px rgba(30, 58, 138, 0.3)' },
                  '&:disabled': { background: '#9ca3af' }
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 3, pt: 3, borderTop: '1px solid #e5e7eb' }}>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>© 2025 Government Portal. All rights reserved.</Typography>
              <br />
              <Typography variant="caption" sx={{ color: '#6b7280' }}>For technical support, contact IT Department</Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}