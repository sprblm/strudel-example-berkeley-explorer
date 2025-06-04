import React from 'react';
import { Box, Typography, Paper, Chip, Divider, Button } from '@mui/material';

// Define the props interface for the AirQualityDetailsPopup component
interface AirQualityDetailsPopupProps {
  sensor: {
    id: string;
    value?: number;
    unit?: string;
    pollutant?: string;
    timestamp?: string;
    source?: string;
    lat: number;
    lng: number;
    [key: string]: any; // Allow for additional properties
  };
  onClose: () => void;
  onViewMore?: () => void;
}

/**
 * AirQualityDetailsPopup Component
 *
 * Displays detailed information about a specific air quality sensor when clicked on the map
 */
const AirQualityDetailsPopup: React.FC<AirQualityDetailsPopupProps> = ({
  sensor,
  onClose,
  onViewMore,
}) => {
  // Helper function to get AQI color based on value
  const getAqiColor = (aqi?: number): string => {
    if (!aqi) return '#9e9e9e'; // Default gray

    if (aqi <= 50) return '#00e400'; // Good
    if (aqi <= 100) return '#ffff00'; // Moderate
    if (aqi <= 150) return '#ff7e00'; // Unhealthy for Sensitive Groups
    if (aqi <= 200) return '#ff0000'; // Unhealthy
    if (aqi <= 300) return '#99004c'; // Very Unhealthy
    return '#7e0023'; // Hazardous
  };

  // Helper function to get AQI category based on value
  const getAqiCategory = (aqi?: number): string => {
    if (!aqi) return 'Unknown';

    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  // Format coordinates to be more readable
  const formatCoordinate = (coord: number): string => {
    return coord.toFixed(6);
  };

  // Format timestamp to be more readable
  const formatTimestamp = (timestamp?: string): string => {
    if (!timestamp) return 'Unknown';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        width: '300px',
        p: 2,
        borderRadius: 2,
        zIndex: 1000,
        maxHeight: '80vh',
        overflow: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: getAqiColor(sensor.value),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <Typography variant="h6" fontWeight={600}>
            Air Quality Sensor
          </Typography>
        </Box>
        <Button variant="text" color="primary" size="small" onClick={onClose}>
          Close
        </Button>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Air Quality Index
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={`${sensor.value || 'N/A'} ${sensor.unit || 'AQI'}`}
            size="small"
            sx={{
              bgcolor: getAqiColor(sensor.value),
              color: sensor.value && sensor.value > 100 ? '#fff' : '#000',
              fontWeight: 500,
            }}
          />
          <Typography variant="body2">
            {getAqiCategory(sensor.value)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Pollutant
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {sensor.pollutant || 'Not specified'}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Last Updated
        </Typography>
        <Typography variant="body1">
          {formatTimestamp(sensor.timestamp)}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Source
        </Typography>
        <Typography variant="body1">{sensor.source || 'Unknown'}</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Location
        </Typography>
        <Typography variant="body1">
          {formatCoordinate(sensor.lat)}, {formatCoordinate(sensor.lng)}
        </Typography>
      </Box>

      {onViewMore && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={onViewMore}
          >
            View More Details
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default AirQualityDetailsPopup;
