import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider
} from '@mui/material';
import { TreeIcon, SensorIcon, InfoCircleIcon } from '../../../components/Icons';

interface ControlsPanelProps {
  activeChart: 'timeSeries' | 'map' | 'histogram' | 'distribution';
  setActiveChart: React.Dispatch<React.SetStateAction<'timeSeries' | 'map' | 'histogram' | 'distribution'>>;
}

/**
 * Controls panel for the explore data page
 * Displays data layers, campus overview, and how-to instructions
 */
export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  activeChart,
  setActiveChart
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [treesLayerEnabled, setTreesLayerEnabled] = useState(true);
  const [sensorsLayerEnabled, setSensorsLayerEnabled] = useState(true);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        width: 320, 
        height: '100%',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header with Title and Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={600} sx={{ px: 3, pt: 3, pb: 2 }}>
          Data Exploration
        </Typography>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ px: 2 }}
        >
          <Tab label="Overview" />
          <Tab label="Visualizations" />
          <Tab label="Details" />
        </Tabs>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ p: 3, flex: 1 }}>
        {/* Data Layers Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Data Layers
          </Typography>
          
          <Box sx={{ 
            bgcolor: '#FFF9C4', // Light yellow background
            borderRadius: 2,
            mb: 1,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TreeIcon size={20} color="#4CAF50" />
              <Typography sx={{ ml: 1 }}>Trees (7)</Typography>
            </Box>
            <Switch 
              checked={treesLayerEnabled}
              onChange={() => setTreesLayerEnabled(!treesLayerEnabled)}
              size="small"
            />
          </Box>
          
          <Box sx={{ 
            bgcolor: '#FFF9C4', // Light yellow background
            borderRadius: 2,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SensorIcon size={20} color="#2196F3" />
              <Typography sx={{ ml: 1 }}>Air Quality Sensors (5)</Typography>
            </Box>
            <Switch 
              checked={sensorsLayerEnabled}
              onChange={() => setSensorsLayerEnabled(!sensorsLayerEnabled)}
              size="small"
            />
          </Box>
        </Box>

        {/* Campus Overview Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Campus Overview
          </Typography>
          
          <Box sx={{ pl: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Total Trees:
            </Typography>
            <Typography variant="body1" sx={{ mb: 1.5 }}>
              7
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Species Diversity:
            </Typography>
            <Typography variant="body1" sx={{ mb: 1.5 }}>
              6 different species
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Air Quality Sensors:
            </Typography>
            <Typography variant="body1" sx={{ mb: 1.5 }}>
              5
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Average PM2.5:
            </Typography>
            <Typography variant="body1">
              9.6 μg/m³
            </Typography>
          </Box>
        </Box>

        {/* How to Use Section */}
        <Box>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            How to Use
          </Typography>
          
          <List dense disablePadding>
            <ListItem sx={{ pb: 1, alignItems: 'flex-start' }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <InfoCircleIcon size={16} color="#666666" />
              </ListItemIcon>
              <ListItemText 
                primary="Click on map points to view detailed information."
                primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              />
            </ListItem>
            
            <ListItem sx={{ pb: 1, alignItems: 'flex-start' }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <InfoCircleIcon size={16} color="#666666" />
              </ListItemIcon>
              <ListItemText 
                primary="Switch to Charts tab to visualize campus data patterns."
                primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              />
            </ListItem>
            
            <ListItem sx={{ alignItems: 'flex-start' }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <InfoCircleIcon size={16} color="#666666" />
              </ListItemIcon>
              <ListItemText 
                primary="View Details tab for raw data listings."
                primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
              />
            </ListItem>
          </List>
        </Box>
      </Box>
    </Paper>
  );
};
