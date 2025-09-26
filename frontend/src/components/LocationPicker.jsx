import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
  Map as MapIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon for issue location
const issueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map clicks
function LocationMarker({ position, setPosition, onLocationSelect }) {
  useMapEvents({
    click(e) {
      const newPosition = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      onLocationSelect(newPosition);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={issueIcon}>
      <Popup>
        <div>
          <strong>Issue Location</strong><br />
          Latitude: {position[0].toFixed(6)}<br />
          Longitude: {position[1].toFixed(6)}
        </div>
      </Popup>
    </Marker>
  );
}

const LocationPicker = ({ onLocationSelect, initialLocation, isCompact = false }) => {
  const [position, setPosition] = useState(initialLocation || null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(!isCompact);
  const [permissionStatus, setPermissionStatus] = useState('prompt');
  const mapRef = useRef();

  // Default center (New Delhi, India - you can change this to your city)
  const defaultCenter = [28.6139, 77.2090];

  useEffect(() => {
    if (initialLocation) {
      setPosition(initialLocation);
      reverseGeocode(initialLocation);
    }
    
    // Check geolocation permission status
    checkPermissionStatus();
  }, [initialLocation]);

  // Check current permission status
  const checkPermissionStatus = async () => {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(permission.state);
        
        // Listen for permission changes
        permission.onchange = () => {
          setPermissionStatus(permission.state);
        };
      } catch (error) {
        console.log('Permission API not supported');
      }
    }
  };

  // Check if geolocation is available and secure context
  const checkGeolocationSupport = () => {
    if (!navigator.geolocation) {
      return { supported: false, message: 'Geolocation is not supported by this browser' };
    }
    
    // Check if we're in a secure context (HTTPS or localhost)
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.startsWith('192.168.') ||
                       window.location.hostname.startsWith('10.') ||
                       window.location.hostname.startsWith('172.');
                       
    if (!window.isSecureContext && !isLocalhost) {
      return { 
        supported: false, 
        message: 'Location access requires a secure connection (HTTPS). Please use HTTPS or localhost.' 
      };
    }
    
    return { supported: true };
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    setError('');

    const geolocationCheck = checkGeolocationSupport();
    if (!geolocationCheck.supported) {
      setError(geolocationCheck.message);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const newPosition = [location.coords.latitude, location.coords.longitude];
        setPosition(newPosition);
        onLocationSelect(newPosition);
        reverseGeocode(newPosition);
        setLoading(false);
        
        // Center map on current location
        if (mapRef.current) {
          mapRef.current.setView(newPosition, 16);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        let errorMessage = 'Unable to get your location. ';
        
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions in your browser and try again.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please try again or select location manually on the map.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again or select location manually on the map.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting your location. Please try again or select location manually on the map.';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Convert coordinates to address
  const reverseGeocode = async (coords) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    }
  };

  const handleLocationSelect = (newPosition) => {
    setPosition(newPosition);
    onLocationSelect(newPosition);
    reverseGeocode(newPosition);
  };

  if (isCompact && !showMap) {
    return (
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
          <Typography variant="subtitle2" fontWeight={600}>
            Location
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Tooltip title="Click to automatically detect your current location. You may need to allow location permissions.">
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <MyLocationIcon />}
              onClick={getCurrentLocation}
              disabled={loading}
              size="small"
              color="primary"
            >
              {loading ? 'Getting Location...' : 'Use Current Location'}
            </Button>
          </Tooltip>
          
          <Button
            variant="outlined"
            startIcon={<MapIcon />}
            onClick={() => setShowMap(true)}
            size="small"
          >
            Select on Map
          </Button>
        </Box>

        {position && (
          <Box sx={{ mb: 2 }}>
            <Chip
              icon={<LocationIcon />}
              label={`Location: ${position[0].toFixed(4)}, ${position[1].toFixed(4)}`}
              color="primary"
              variant="outlined"
              size="small"
            />
            {address && (
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                {address}
              </Typography>
            )}
          </Box>
        )}

        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
          <Typography variant="subtitle2" fontWeight={600}>
            Issue Location
          </Typography>
        </Box>
        {isCompact && (
          <IconButton onClick={() => setShowMap(false)} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <MyLocationIcon />}
            onClick={getCurrentLocation}
            disabled={loading}
            size="small"
          >
            {loading ? 'Getting Location...' : 'Use Current Location'}
          </Button>
          
          <Tooltip title="Click on the map to select a location">
            <Button variant="outlined" size="small">
              Click Map to Select
            </Button>
          </Tooltip>
        </Box>

        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ height: 300, borderRadius: 1, overflow: 'hidden', border: '1px solid #ddd' }}>
          <MapContainer
            center={position || defaultCenter}
            zoom={position ? 16 : 12}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
              position={position}
              setPosition={setPosition}
              onLocationSelect={handleLocationSelect}
            />
          </MapContainer>
        </Box>

        {position && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="primary" fontWeight={600}>
              Selected Location:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              📍 Latitude: {position[0].toFixed(6)}, Longitude: {position[1].toFixed(6)}
            </Typography>
            {address && (
              <Typography variant="body2" color="text.secondary">
                📍 {address}
              </Typography>
            )}
          </Box>
        )}

        {!position && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>How to select location:</strong>
            <br />
            1. Click "Use Current Location" to auto-detect your location
            {permissionStatus === 'denied' && (
              <>
                <br />
                <strong>Note:</strong> Location permission is currently blocked. To enable:
                <br />
                • Chrome: Click the location icon in the address bar
                <br />
                • Firefox: Click the shield icon and allow location access
                <br />
                • Safari: Go to Safari → Settings → Websites → Location
              </>
            )}
            <br />
            2. Or click anywhere on the map to manually select the issue location
            <br />
            3. The red marker will show your selected location
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default LocationPicker;