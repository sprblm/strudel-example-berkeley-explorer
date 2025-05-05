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
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { TreeIcon, SensorIcon, InfoCircleIcon } from '../../../components/Icons';

interface ControlsPanelProps {
  activeChart: 'map' | 'timeSeries' | 'histogram' | 'distribution';
  setActiveChart: React.Dispatch<React.SetStateAction<'map' | 'timeSeries' | 'histogram' | 'distribution'>>;
  dataType: string;
  setDataType: React.Dispatch<React.SetStateAction<string>>;
  treesLayerEnabled: boolean;
  setTreesLayerEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  sensorsLayerEnabled: boolean;
  setSensorsLayerEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Left panel control component with chart type selection and other controls.
 */
export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  activeChart,
  setActiveChart,
  dataType,
  setDataType,
  treesLayerEnabled,
  setTreesLayerEnabled,
  sensorsLayerEnabled,
  setSensorsLayerEnabled
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
            gap: 2
          }}>
            {/* Oak */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <Box sx={{ width: '100%', height: '50%', bgcolor: '#4CAF50', borderRadius: '3px 3px 0 0' }} />
              <Typography variant="caption" sx={{ mt: 1 }}>Oak</Typography>
            </Box>
            
            {/* Maple */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <Box sx={{ width: '100%', height: '100%', bgcolor: '#4CAF50', borderRadius: '3px 3px 0 0' }} />
              <Typography variant="caption" sx={{ mt: 1 }}>Maple</Typography>
            </Box>
            
            {/* Pine */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <Box sx={{ width: '100%', height: '75%', bgcolor: '#4CAF50', borderRadius: '3px 3px 0 0' }} />
              <Typography variant="caption" sx={{ mt: 1 }}>Pine</Typography>
            </Box>
            
            {/* Birch */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <Box sx={{ width: '100%', height: '25%', bgcolor: '#4CAF50', borderRadius: '3px 3px 0 0' }} />
              <Typography variant="caption" sx={{ mt: 1 }}>Birch</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Air Quality Trends */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
          Air Quality Trends
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Average PM2.5 readings over time
        </Typography>
        
        {/* Line Chart Visualization */}
        <Box sx={{ height: 200, position: 'relative', pl: 3, pr: 2 }}>
          {/* Y-Axis Labels */}
          <Typography variant="caption" sx={{ position: 'absolute', left: 0, top: 0 }}>15</Typography>
          <Typography variant="caption" sx={{ position: 'absolute', left: 0, top: 100 }}>7.5</Typography>
          <Typography variant="caption" sx={{ position: 'absolute', left: 0, bottom: 0 }}>0</Typography>
          
          {/* X-Axis Labels */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption">Jan</Typography>
            <Typography variant="caption">Mar</Typography>
            <Typography variant="caption">May</Typography>
            <Typography variant="caption">Jul</Typography>
          </Box>
          
          {/* Line Chart */}
          <Box sx={{ 
            height: '100%', 
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              borderBottom: '1px dashed',
              borderColor: 'grey.300'
            }
          }}>
            {/* Line Graph (simplified representation) */}
            <Box sx={{ 
              position: 'absolute',
              top: '30%',
              left: 0,
              right: 0,
              height: '2px',
              bgcolor: '#2196F3',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '20%',
                width: '60%',
                height: '200%',
                borderRadius: '50%',
                border: '2px solid #2196F3',
                borderBottom: 'none',
                borderLeft: 'none',
                borderRight: 'none'
              }
            }} />
            
            {/* Data Points */}
            <Box sx={{ 
              position: 'absolute', 
              top: '30%', 
              left: '10%', 
              width: 8, 
              height: 8, 
              bgcolor: '#2196F3', 
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              top: '40%', 
              left: '30%', 
              width: 8, 
              height: 8, 
              bgcolor: '#2196F3', 
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              top: '20%', 
              left: '50%', 
              width: 8, 
              height: 8, 
              bgcolor: '#2196F3', 
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              top: '30%', 
              left: '70%', 
              width: 8, 
              height: 8, 
              bgcolor: '#2196F3', 
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }} />
            <Box sx={{ 
              position: 'absolute', 
              top: '25%', 
              left: '90%', 
              width: 8, 
              height: 8, 
              bgcolor: '#2196F3', 
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }} />
          </Box>
        </Box>
      </Box>
      
      {/* Data Insights */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Data Insights
        </Typography>
        
        <List dense disablePadding>
          <ListItem sx={{ pb: 1, alignItems: 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <InfoCircleIcon size={16} color="#666666" />
            </ListItemIcon>
            <ListItemText 
              primary="Maple trees are the most common species on campus."
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
            />
          </ListItem>
          
          <ListItem sx={{ pb: 1, alignItems: 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <InfoCircleIcon size={16} color="#666666" />
            </ListItemIcon>
            <ListItemText 
              primary="Air quality readings have improved by 15% since January."
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
            />
          </ListItem>
          
          <ListItem sx={{ alignItems: 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <InfoCircleIcon size={16} color="#666666" />
            </ListItemIcon>
            <ListItemText 
              primary="PM2.5 levels peak during morning rush hour (7-9am)."
              primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
            />
          </ListItem>
        </List>
      </Box>
    </>
  );
  
  // Details Tab Content
  const renderDetailsTab = () => (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        Raw Data
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        View detailed data for all campus elements.
      </Typography>
      
      {/* Data Table Placeholder */}
      <Box sx={{ 
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 1,
        p: 2,
        mb: 3
      }}>
        <Typography variant="body2" fontWeight={500}>
          Trees Data
        </Typography>
        
        <Box component="table" sx={{ width: '100%', mt: 1, borderCollapse: 'collapse' }}>
          <Box component="thead">
            <Box component="tr" sx={{ borderBottom: '1px solid', borderColor: 'grey.300' }}>
              <Box component="th" sx={{ py: 1, textAlign: 'left', fontSize: 13 }}>ID</Box>
              <Box component="th" sx={{ py: 1, textAlign: 'left', fontSize: 13 }}>Species</Box>
              <Box component="th" sx={{ py: 1, textAlign: 'left', fontSize: 13 }}>Height</Box>
            </Box>
          </Box>
          <Box component="tbody">
            <Box component="tr" sx={{ borderBottom: '1px solid', borderColor: 'grey.100' }}>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>T001</Box>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>Oak</Box>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>15m</Box>
            </Box>
            <Box component="tr" sx={{ borderBottom: '1px solid', borderColor: 'grey.100' }}>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>T002</Box>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>Maple</Box>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>12m</Box>
            </Box>
            <Box component="tr">
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>T003</Box>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>Pine</Box>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>18m</Box>
            </Box>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ 
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 1,
        p: 2
      }}>
        <Typography variant="body2" fontWeight={500}>
          Sensor Data
        </Typography>
        
        <Box component="table" sx={{ width: '100%', mt: 1, borderCollapse: 'collapse' }}>
          <Box component="thead">
            <Box component="tr" sx={{ borderBottom: '1px solid', borderColor: 'grey.300' }}>
              <Box component="th" sx={{ py: 1, textAlign: 'left', fontSize: 13 }}>ID</Box>
              <Box component="th" sx={{ py: 1, textAlign: 'left', fontSize: 13 }}>Type</Box>
              <Box component="th" sx={{ py: 1, textAlign: 'left', fontSize: 13 }}>Value</Box>
            </Box>
          </Box>
          <Box component="tbody">
            <Box component="tr" sx={{ borderBottom: '1px solid', borderColor: 'grey.100' }}>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>S001</Box>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>PM2.5</Box>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>8.2 μg/m³</Box>
            </Box>
            <Box component="tr" sx={{ borderBottom: '1px solid', borderColor: 'grey.100' }}>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>S002</Box>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>CO2</Box>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>412 ppm</Box>
            </Box>
            <Box component="tr">
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>S003</Box>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>Temp</Box>
              <Box component="td" sx={{ py: 1, fontSize: 13 }}>22.5°C</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        width: 320, 
        height: '100%',
        p: 3,
        border: '1px solid',
        borderColor: 'grey.200',
        borderRadius: 2,
        overflow: 'auto'
      }}
    >
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{ 
          mb: 3,
          '.MuiTab-root': {
            minWidth: 'auto',
            px: 2,
            py: 1,
            minHeight: 'auto',
            textTransform: 'none',
            fontWeight: 500
          }
        }}
      >
        <Tab label="Overview" />
        <Tab label="Charts" />
        <Tab label="Details" />
      </Tabs>

      {/* Data Type Selection - Only show in Charts tab */}
      {tabValue === 1 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Data Type
          </Typography>
          
          <ToggleButtonGroup
            value={dataType}
            exclusive
            onChange={(e, newValue) => newValue && setDataType(newValue)}
            aria-label="data type"
            size="small"
            sx={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
              width: '100%',
              '.MuiToggleButton-root': {
                textTransform: 'none',
                py: 1
              }
            }}
          >
            <ToggleButton value="trees">
              Trees
            </ToggleButton>
            <ToggleButton value="airQuality">
              Air Quality
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {/* Chart Type Selection - Only show in Charts tab */}
      {tabValue === 1 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
            Chart Type
          </Typography>
          
          <ToggleButtonGroup
            value={activeChart}
            exclusive
            onChange={(e, newValue) => newValue && setActiveChart(newValue)}
            aria-label="chart type"
            size="small"
            sx={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
              width: '100%',
              '.MuiToggleButton-root': {
                textTransform: 'none',
                py: 1
              }
            }}
          >
            <ToggleButton value="map">
              Map View
            </ToggleButton>
            <ToggleButton value="timeSeries">
              Time Series
            </ToggleButton>
            <ToggleButton value="histogram">
              Histogram
            </ToggleButton>
            <ToggleButton value="distribution">
              Distribution
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {tabValue === 0 && renderOverviewTab()}
      {tabValue === 1 && renderTreeVisualizationContent()}
      {tabValue === 2 && renderDetailsTab()}
    </Paper>
  );
};
