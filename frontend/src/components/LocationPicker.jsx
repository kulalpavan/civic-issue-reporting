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
  const mapRef = useRef();

  // Default center (New Delhi, India - you can change this to your city)
  const defaultCenter = [28.6139, 77.2090];

  useEffect(() => {
    if (initialLocation) {
      setPosition(initialLocation);
      reverseGeocode(initialLocation);
    }
  }, [initialLocation]);

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
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
        setError('Unable to get your location. Please click on the map to select location.');
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
          <Button
            variant="outlined"
            startIcon={<MyLocationIcon />}
            onClick={getCurrentLocation}
            disabled={loading}
            size="small"
          >
            {loading ? <CircularProgress size={16} /> : 'Use Current Location'}
          </Button>
          
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
            <br />
            2. Or click anywhere on the map to manually select the issue location
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default LocationPicker;