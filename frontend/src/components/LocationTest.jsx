import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  MyLocation as MyLocationIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const LocationTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const testGeolocation = () => {
    setTesting(true);
    setError('');
    setResult(null);

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setTesting(false);
      return;
    }

    // Check secure context
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      setError('Geolocation requires HTTPS or localhost');
      setTesting(false);
      return;
    }

    console.log('Starting geolocation test...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Geolocation success:', position);
        setResult({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp).toLocaleString()
        });
        setTesting(false);
      },
      (err) => {
        console.error('Geolocation error:', err);
        let errorMessage = '';
        
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'Unknown geolocation error';
            break;
        }
        
        setError(`${errorMessage} (Code: ${err.code})`);
        setTesting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <Paper sx={{ p: 3, m: 2, maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        🧪 Location Test
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Test if your browser can access location services
      </Typography>

      <Button
        variant="contained"
        startIcon={testing ? <CircularProgress size={16} color="inherit" /> : <MyLocationIcon />}
        onClick={testGeolocation}
        disabled={testing}
        sx={{ mb: 2 }}
      >
        {testing ? 'Testing Location...' : 'Test Current Location'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} icon={<ErrorIcon />}>
          <strong>Error:</strong> {error}
          <br />
          <strong>Solutions:</strong>
          <br />
          • Allow location permissions when prompted
          <br />
          • Check browser settings for location access
          <br />
          • Ensure you're on HTTPS or localhost
        </Alert>
      )}

      {result && (
        <Alert severity="success" sx={{ mb: 2 }} icon={<SuccessIcon />}>
          <strong>Location detected successfully!</strong>
          <Box sx={{ mt: 1 }}>
            <Chip label={`Lat: ${result.latitude.toFixed(6)}`} size="small" sx={{ mr: 1, mb: 1 }} />
            <Chip label={`Lng: ${result.longitude.toFixed(6)}`} size="small" sx={{ mr: 1, mb: 1 }} />
            <Chip label={`Accuracy: ±${Math.round(result.accuracy)}m`} size="small" sx={{ mb: 1 }} />
          </Box>
          <Typography variant="caption" display="block">
            Detected at: {result.timestamp}
          </Typography>
        </Alert>
      )}

      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          <strong>Browser Info:</strong><br />
          Geolocation supported: {navigator.geolocation ? '✅ Yes' : '❌ No'}<br />
          Secure context: {window.isSecureContext ? '✅ Yes' : '❌ No'}<br />
          Hostname: {window.location.hostname}<br />
          Protocol: {window.location.protocol}
        </Typography>
      </Box>
    </Paper>
  );
};

export default LocationTest;