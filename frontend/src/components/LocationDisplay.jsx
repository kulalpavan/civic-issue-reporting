import React, { useState } from 'react';
import {
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Tooltip
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Map as MapIcon,
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom marker icon for issue location
const issueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationDisplay = ({ location, title, compact = true }) => {
  const [showMap, setShowMap] = useState(false);

  if (!location || !location.latitude || !location.longitude) {
    return (
      <Chip
        icon={<LocationIcon />}
        label="Location not provided"
        size="small"
        variant="outlined"
        color="default"
      />
    );
  }

  const { latitude, longitude } = location;
  const position = [latitude, longitude];

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  if (compact) {
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            icon={<LocationIcon />}
            label={`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => setShowMap(true)}
            clickable
          />
          <Tooltip title="View on Map">
            <IconButton size="small" onClick={() => setShowMap(true)}>
              <MapIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open in Google Maps">
            <IconButton size="small" onClick={openInGoogleMaps}>
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Dialog open={showMap} onClose={() => setShowMap(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Issue Location</Typography>
            <IconButton onClick={() => setShowMap(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>{title}</strong>
              </Typography>
              <Typography variant="body2">
                📍 Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </Typography>
            </Box>
            <Box sx={{ height: 400, borderRadius: 1, overflow: 'hidden' }}>
              <MapContainer
                center={position}
                zoom={16}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={issueIcon}>
                  <Popup>
                    <div>
                      <strong>{title}</strong><br />
                      Latitude: {latitude.toFixed(6)}<br />
                      Longitude: {longitude.toFixed(6)}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<OpenInNewIcon />}
                onClick={openInGoogleMaps}
              >
                Open in Google Maps
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        📍 Issue Location
      </Typography>
      <Box sx={{ height: 200, borderRadius: 1, overflow: 'hidden', border: '1px solid #ddd' }}>
        <MapContainer
          center={position}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={issueIcon}>
            <Popup>
              <div>
                <strong>{title}</strong><br />
                Latitude: {latitude.toFixed(6)}<br />
                Longitude: {longitude.toFixed(6)}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </Box>
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          📍 {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<OpenInNewIcon />}
          onClick={openInGoogleMaps}
        >
          Google Maps
        </Button>
      </Box>
    </Box>
  );
};

export default LocationDisplay;