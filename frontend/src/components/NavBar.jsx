import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Badge
} from '@mui/material';
import { 
  LogoutOutlined as LogoutIcon,
  AccountBalance as AccountBalanceIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  AdminPanelSettings as AdminIcon,
  NotificationsOutlined as NotificationsIcon,
  MenuOutlined as MenuIcon,
  DashboardOutlined as DashboardIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClick = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'citizen':
        return <PersonIcon />;
      case 'officer':
        return <BadgeIcon />;
      case 'admin':
        return <AdminIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'citizen':
        return '#42A5F5';
      case 'officer':
        return '#66BB6A';
      case 'admin':
        return '#FFA726';
      default:
        return '#42A5F5';
    }
  };

  const formatRoleDisplay = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 4px 20px rgba(21, 101, 192, 0.15)'
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Avatar
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              mr: 2,
              width: 40,
              height: 40
            }}
          >
            <AccountBalanceIcon />
          </Avatar>
          
          {!isMobile && (
            <Box>
              <Typography 
                variant="h6" 
                component="div"
                sx={{ 
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: 'white'
                }}
              >
                Civic Reporter
              </Typography>
              <Typography 
                variant="caption"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.75rem',
                  lineHeight: 1
                }}
              >
                Building Better Communities
              </Typography>
            </Box>
          )}
        </Box>

        {/* Desktop Navigation */}
        {!isMobile ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Dashboard Button */}
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              Dashboard
            </Button>

            {/* Notifications */}
            <IconButton
              color="inherit"
              sx={{
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* User Profile Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  {auth?.user?.username}
                </Typography>
                <Chip
                  icon={getRoleIcon(auth?.user?.role)}
                  label={formatRoleDisplay(auth?.user?.role)}
                  size="small"
                  sx={{
                    bgcolor: getRoleColor(auth?.user?.role),
                    color: 'white',
                    fontSize: '0.75rem',
                    height: 20,
                    '& .MuiChip-icon': {
                      color: 'white',
                      fontSize: '0.875rem'
                    }
                  }}
                />
              </Box>
              
              <IconButton
                onClick={handleProfileClick}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                  }
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: getRoleColor(auth?.user?.role),
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                >
                  {auth?.user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Box>
          </Box>
        ) : (
          /* Mobile Navigation */
          <IconButton
            color="inherit"
            onClick={handleMobileMenuClick}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Desktop Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{
            '& .MuiPaper-root': {
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              mt: 1,
              minWidth: 200
            }
          }}
        >
          <Box sx={{ p: 2, pb: 0 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Signed in as
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {auth?.user?.username}
            </Typography>
            <Chip
              icon={getRoleIcon(auth?.user?.role)}
              label={formatRoleDisplay(auth?.user?.role)}
              size="small"
              sx={{
                bgcolor: getRoleColor(auth?.user?.role),
                color: 'white',
                mt: 1,
                mb: 1
              }}
            />
          </Box>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main', py: 1.5 }}>
            <LogoutIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
            Sign Out
          </MenuItem>
        </Menu>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleClose}
          sx={{
            '& .MuiPaper-root': {
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              mt: 1,
              minWidth: 250
            }
          }}
        >
          <Box sx={{ p: 2, pb: 0 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Signed in as
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {auth?.user?.username}
            </Typography>
            <Chip
              icon={getRoleIcon(auth?.user?.role)}
              label={formatRoleDisplay(auth?.user?.role)}
              size="small"
              sx={{
                bgcolor: getRoleColor(auth?.user?.role),
                color: 'white',
                mt: 1,
                mb: 1
              }}
            />
          </Box>
          <Divider />
          <MenuItem onClick={handleClose}>
            <DashboardIcon sx={{ mr: 1 }} />
            Dashboard
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <NotificationsIcon sx={{ mr: 1 }} />
            Notifications
            <Badge badgeContent={0} color="error" sx={{ ml: 'auto' }} />
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutIcon sx={{ mr: 1 }} />
            Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}