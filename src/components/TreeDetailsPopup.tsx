/**
 * TreeDetailsPopup Component
 *
 * Displays detailed information about a specific tree when clicked on the map
 *
 * This component is used in the BerkeleyDataMap component to show the details
 * of a tree when it is clicked on the map.
 */
import React from 'react';
import { Box, Typography, Paper, Chip, Divider, Button } from '@mui/material';
import { TreeIcon } from './Icons';

// Define the props interface for the TreeDetailsPopup component
interface TreeDetailsPopupProps {
  tree: {
    id: string;
    species?: string;
    healthCondition?: string;
    dbh?: string | number;
    height?: number;
    observationDate?: string;
    lat: number;
    lng: number;
    [key: string]: any; // Allow for additional properties
  };
  onClose: () => void;
  onViewMore?: () => void;
}

/**
 * TreeDetailsPopup Component
 *
 * Displays detailed information about a specific tree when clicked on the map
 */
const TreeDetailsPopup: React.FC<TreeDetailsPopupProps> = ({
  tree,
  onClose,
  onViewMore,
}) => {
  // Helper function to get health condition color
  const getHealthColor = (health?: string): string => {
    if (!health) return '#9e9e9e'; // Default gray

    const healthLower = health.toLowerCase();
    if (healthLower.includes('good')) return '#4caf50'; // Green
    if (healthLower.includes('fair')) return '#ff9800'; // Orange
    if (healthLower.includes('poor')) return '#f44336'; // Red
    return '#9e9e9e'; // Default gray
  };

  // Format coordinates to be more readable
  const formatCoordinate = (coord: number): string => {
    return coord.toFixed(6);
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
          <TreeIcon size={24} color="#4caf50" />
          <Typography variant="h6" fontWeight={600}>
            Tree Details
          </Typography>
        </Box>
        <Button variant="text" color="primary" size="small" onClick={onClose}>
          Close
        </Button>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Species
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {tree.species || 'Unknown Species'}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Health Condition
        </Typography>
        <Chip
          label={tree.healthCondition || 'Unknown'}
          size="small"
          sx={{
            backgroundColor: getHealthColor(tree.healthCondition),
            color: 'white',
            fontWeight: 500,
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Height
          </Typography>
          <Typography variant="body1">
            {tree.height ? `${tree.height} ft` : 'Unknown'}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Diameter
          </Typography>
          <Typography variant="body1">
            {tree.dbh ? `${tree.dbh} in` : 'Unknown'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Location
        </Typography>
        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
          Lat: {formatCoordinate(tree.lat)}, Lng: {formatCoordinate(tree.lng)}
        </Typography>
      </Box>

      {tree.observationDate && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Observation Date
          </Typography>
          <Typography variant="body2">
            {new Date(tree.observationDate).toLocaleDateString()}
          </Typography>
        </Box>
      )}

      {onViewMore && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onViewMore}
          sx={{ mt: 1 }}
        >
          View More Details
        </Button>
      )}
    </Paper>
  );
};

export default TreeDetailsPopup;
