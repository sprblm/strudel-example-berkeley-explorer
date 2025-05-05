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
  Divider,
  ToggleButton,
  ToggleButtonGroup
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
  const [dataType, setDataType] = useState<string>("trees");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDataTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newDataType: string,
  ) => {
    if (newDataType !== null) {
      setDataType(newDataType);
    }
  };

  // Overview Tab Content
  const renderOverviewTab = () => (
    <>
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
    </>
  );

  // Render Tree Visualization Content
  const renderTreeVisualizationContent = () => (
    <>
      {/* Tree Species Distribution Chart */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          Tree Species Distribution
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Number of trees by species
        </Typography>
        
        {/* Bar Chart Visualization */}
        <Box sx={{ height: 200, position: 'relative' }}>
          {/* Y-Axis Labels */}
          <Typography variant="caption" sx={{ position: 'absolute', left: 0, top: 0 }}>2</Typography>
          <Typography variant="caption" sx={{ position: 'absolute', left: 0, top: 115 }}>0.5</Typography>
          
          {/* Bars */}
          <Box sx={{ 
            display: 'flex', 
            height: '100%', 
            pl: 3, 
            alignItems: 'flex-end',
            pt: 2,
            position: 'relative'
          }}>
            {/* Grid Lines */}
            <Box sx={{ 
              position: 'absolute', 
              width: '100%', 
              height: '1px', 
              bgcolor: '#e0e0e0', 
              top: 13,
              left: 0,
              borderStyle: 'dashed',
              borderWidth: '0 0 1px 0',
              borderColor: '#ccc'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              width: '100%', 
              height: '1px', 
              bgcolor: '#e0e0e0', 
              top: 124,
              left: 0,
              borderStyle: 'dashed',
              borderWidth: '0 0 1px 0',
              borderColor: '#ccc'
            }} />
          
            {/* First Bar - Taller */}
            <Box sx={{ 
              width: 26, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column', 
              alignItems: 'center',
              mx: 0.5
            }}>
              <Box sx={{ width: '100%', height: '80%', bgcolor: '#1976d2', borderRadius: '2px 2px 0 0' }} />
              <Typography variant="caption" sx={{ 
                mt: 1,
                fontSize: '7px',
                maxWidth: 30,
                textAlign: 'center',
                transform: 'rotate(-45deg)',
                transformOrigin: 'top left',
                whiteSpace: 'nowrap'
              }}>
                Coast Live Oak
              </Typography>
            </Box>

            {/* Other Bars - All Same Height */}
            {['California Redwood', 'American Elm', 'London Plane', 'Monterey Pine', 'California Bay Laurel'].map((tree, index) => (
              <Box key={index} sx={{ 
                width: 26, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column', 
                alignItems: 'center',
                mx: 0.5
              }}>
                <Box sx={{ width: '100%', height: '30%', bgcolor: '#1976d2', borderRadius: '2px 2px 0 0' }} />
                <Typography variant="caption" sx={{ 
                  mt: 1,
                  fontSize: '7px',
                  maxWidth: 30,
                  textAlign: 'center',
                  transform: 'rotate(-45deg)',
                  transformOrigin: 'top left',
                  whiteSpace: 'nowrap'
                }}>
                  {tree}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Tree Health Status Chart */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          Tree Health Status
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Distribution of tree health conditions
        </Typography>
        
        {/* Pie Chart Visualization */}
        <Box sx={{ position: 'relative', height: 200, display: 'flex', justifyContent: 'center' }}>
          {/* Simplified Pie Chart Representation */}
          <Box sx={{ 
            width: 180, 
            height: 180, 
            borderRadius: '50%', 
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Excellent Slice - Green - 29% */}
            <Box sx={{ 
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'conic-gradient(transparent 0deg, transparent 105deg, #8BC34A 105deg, #8BC34A 360deg)',
              transform: 'rotate(0deg)'
            }} />
            
            {/* Good Slice - Light Green - 43% */}
            <Box sx={{ 
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'conic-gradient(transparent 0deg, transparent 0deg, #AEEA00 0deg, #AEEA00 155deg, transparent 155deg)',
              transform: 'rotate(0deg)'
            }} />
            
            {/* Fair Slice - Yellow - 29% */}
            <Box sx={{ 
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'conic-gradient(transparent 0deg, transparent 0deg, #FFD600 0deg, #FFD600 105deg, transparent 105deg)',
              transform: 'rotate(155deg)'
            }} />
          </Box>
          
          {/* Labels */}
          <Typography sx={{ 
            position: 'absolute', 
            top: 20, 
            right: 20, 
            color: '#8BC34A',
            fontWeight: 'bold' 
          }}>
            Excellent 29%
          </Typography>
          
          <Typography sx={{ 
            position: 'absolute', 
            top: 80, 
            left: 10, 
            color: '#AEEA00',
            fontWeight: 'bold' 
          }}>
            Good 43%
          </Typography>
          
          <Typography sx={{ 
            position: 'absolute', 
            bottom: 20, 
            right: 40, 
            color: '#FFD600',
            fontWeight: 'bold' 
          }}>
            Fair 29%
          </Typography>
        </Box>
      </Box>
    </>
  );

  // Render Air Quality Visualization Content
  const renderAirQualityVisualizationContent = () => (
    <>
      {/* PM2.5 Levels Chart */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          PM2.5 Levels
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          PM2.5 readings throughout the day
        </Typography>
        
        {/* Bar Chart Visualization */}
        <Box sx={{ height: 200, position: 'relative' }}>
          {/* Y-Axis Labels */}
          <Typography variant="caption" sx={{ position: 'absolute', left: 0, top: 0 }}>16</Typography>
          <Typography variant="caption" sx={{ position: 'absolute', left: 0, top: 50 }}>8</Typography>
          <Typography variant="caption" sx={{ position: 'absolute', left: 0, top: 100 }}>4</Typography>
          <Typography variant="caption" sx={{ position: 'absolute', left: 0, top: 150 }}>0</Typography>
          
          {/* Bars */}
          <Box sx={{ 
            display: 'flex', 
            height: '100%', 
            pl: 3, 
            alignItems: 'flex-end',
            pt: 2,
            position: 'relative'
          }}>
            {/* Grid Lines */}
            <Box sx={{ 
              position: 'absolute', 
              width: '100%', 
              height: '1px', 
              bgcolor: '#e0e0e0', 
              top: 13,
              left: 0,
              borderStyle: 'dashed',
              borderWidth: '0 0 1px 0',
              borderColor: '#ccc'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              width: '100%', 
              height: '1px', 
              bgcolor: '#e0e0e0', 
              top: 63,
              left: 0,
              borderStyle: 'dashed',
              borderWidth: '0 0 1px 0',
              borderColor: '#ccc'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              width: '100%', 
              height: '1px', 
              bgcolor: '#e0e0e0', 
              top: 113,
              left: 0,
              borderStyle: 'dashed',
              borderWidth: '0 0 1px 0',
              borderColor: '#ccc'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              width: '100%', 
              height: '1px', 
              bgcolor: '#e0e0e0', 
              top: 163,
              left: 0,
              borderStyle: 'dashed',
              borderWidth: '0 0 1px 0',
              borderColor: '#ccc'
            }} />
          
            {/* PM2.5 Bars with varying heights */}
            {[
              { time: '10:30 AM', height: '40%' },
              { time: '10:40 AM', height: '55%' },
              { time: '11:00 AM', height: '35%' },
              { time: '11:20 AM', height: '65%' },
              { time: '11:30 AM', height: '50%' }
            ].map((reading, index) => (
              <Box key={index} sx={{ 
                width: 26, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column', 
                alignItems: 'center',
                mx: 1.5
              }}>
                <Box sx={{ 
                  width: '100%', 
                  height: reading.height, 
                  bgcolor: '#e91e63', 
                  borderRadius: '2px 2px 0 0' 
                }} />
                <Typography variant="caption" sx={{ 
                  mt: 1,
                  fontSize: '9px',
                  textAlign: 'center',
                  width: 50
                }}>
                  {reading.time}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Temperature vs. Ozone Chart */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          Temperature vs. Ozone
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Correlation between temperature and ozone levels
        </Typography>
        
        {/* Double Bar Chart */}
        <Box sx={{ height: 220, position: 'relative' }}>
          {/* Y-Axis Labels - Left (Temperature) */}
          <Typography variant="caption" sx={{ position: 'absolute', left: 0, top: 0 }}>20</Typography>
          <Typography variant="caption" sx={{ position: 'absolute', left: 0, top: 50 }}>10</Typography>
          <Typography variant="caption" sx={{ position: 'absolute', left: 0, top: 100 }}>5</Typography>
          <Typography variant="caption" sx={{ position: 'absolute', left: 0, top: 150 }}>0</Typography>
          
          {/* Y-Axis Labels - Right (Ozone) */}
          <Typography variant="caption" sx={{ position: 'absolute', right: 0, top: 0 }}>40</Typography>
          <Typography variant="caption" sx={{ position: 'absolute', right: 0, top: 50 }}>20</Typography>
          <Typography variant="caption" sx={{ position: 'absolute', right: 0, top: 100 }}>10</Typography>
          <Typography variant="caption" sx={{ position: 'absolute', right: 0, top: 150 }}>0</Typography>
          
          {/* Bars */}
          <Box sx={{ 
            display: 'flex', 
            height: '100%', 
            px: 3, 
            alignItems: 'flex-end',
            pt: 2,
            position: 'relative'
          }}>
            {/* Grid Lines */}
            <Box sx={{ 
              position: 'absolute', 
              width: '100%', 
              height: '1px', 
              bgcolor: '#e0e0e0', 
              top: 13,
              left: 0,
              borderStyle: 'dashed',
              borderWidth: '0 0 1px 0',
              borderColor: '#ccc'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              width: '100%', 
              height: '1px', 
              bgcolor: '#e0e0e0', 
              top: 63,
              left: 0,
              borderStyle: 'dashed',
              borderWidth: '0 0 1px 0',
              borderColor: '#ccc'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              width: '100%', 
              height: '1px', 
              bgcolor: '#e0e0e0', 
              top: 113,
              left: 0,
              borderStyle: 'dashed',
              borderWidth: '0 0 1px 0',
              borderColor: '#ccc'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              width: '100%', 
              height: '1px', 
              bgcolor: '#e0e0e0', 
              top: 163,
              left: 0,
              borderStyle: 'dashed',
              borderWidth: '0 0 1px 0',
              borderColor: '#ccc'
            }} />
          
            {/* Temperature & Ozone Bar Pairs */}
            {[
              { time: '10:35 AM', tempHeight: '60%', ozoneHeight: '45%' },
              { time: '10:50 AM', tempHeight: '70%', ozoneHeight: '55%' },
              { time: '11:15 AM', tempHeight: '65%', ozoneHeight: '40%' },
              { time: '11:30 AM', tempHeight: '75%', ozoneHeight: '60%' }
            ].map((reading, index) => (
              <Box key={index} sx={{ 
                width: 50, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column', 
                alignItems: 'center',
                mx: 1
              }}>
                <Box sx={{ 
                  width: '100%', 
                  display: 'flex',
                  height: '100%',
                  alignItems: 'flex-end'
                }}>
                  {/* Temperature Bar */}
                  <Box sx={{
                    width: '45%',
                    height: reading.tempHeight,
                    bgcolor: '#2196F3',
                    borderRadius: '2px 2px 0 0',
                    mr: 0.5
                  }} />
                  
                  {/* Ozone Bar */}
                  <Box sx={{
                    width: '45%',
                    height: reading.ozoneHeight,
                    bgcolor: '#FFC107',
                    borderRadius: '2px 2px 0 0'
                  }} />
                </Box>
                <Typography variant="caption" sx={{ 
                  mt: 1,
                  fontSize: '9px',
                  textAlign: 'center'
                }}>
                  {reading.time}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );

  // Visualizations Tab Content
  const renderVisualizationsTab = () => (
    <>
      {/* Data Type Selector */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Data Type
        </Typography>
        
        <ToggleButtonGroup
          value={dataType}
          onChange={handleDataTypeChange}
          exclusive
          aria-label="data type"
          sx={{ width: '100%' }}
        >
          <ToggleButton 
            value="trees" 
            aria-label="trees" 
            sx={{ 
              flex: 1, 
              py: 1.5,
              bgcolor: dataType === 'trees' ? '#FFF9C4' : 'transparent',
              '&.Mui-selected': {
                bgcolor: '#FFF9C4',
              }
            }}
          >
            <TreeIcon size={18} color="#4CAF50" />
            <Typography sx={{ ml: 1 }}>Trees</Typography>
          </ToggleButton>
          <ToggleButton 
            value="airQuality" 
            aria-label="air quality"
            sx={{ 
              flex: 1,
              py: 1.5,
              bgcolor: dataType === 'airQuality' ? '#FFF9C4' : 'transparent',
              '&.Mui-selected': {
                bgcolor: '#FFF9C4',
              }
            }}
          >
            <SensorIcon size={18} color="#2196F3" />
            <Typography sx={{ ml: 1 }}>Air Quality</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Conditional Rendering Based on Selected Data Type */}
      {dataType === 'trees' 
        ? renderTreeVisualizationContent() 
        : renderAirQualityVisualizationContent()
      }
    </>
  );

  // Details Tab Content (placeholder)
  const renderDetailsTab = () => (
    <Box sx={{ py: 3 }}>
      <Typography variant="body1">
        Detailed raw data and metrics will be displayed here.
      </Typography>
    </Box>
  );

  // Render the appropriate tab content
  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return renderOverviewTab();
      case 1:
        return renderVisualizationsTab();
      case 2:
        return renderDetailsTab();
      default:
        return renderOverviewTab();
    }
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
          <Tab label="Visualizations" sx={{ 
            ...(tabValue === 1 && {
              color: '#4CAF50',
              border: '1px solid #4CAF50', 
              borderRadius: 1
            })
          }} />
          <Tab label="Details" />
        </Tabs>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ p: 3, flex: 1 }}>
        {renderTabContent()}
      </Box>
    </Paper>
  );
};
