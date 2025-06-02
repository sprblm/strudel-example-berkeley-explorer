/**
 * Controls Panel component for the Explore Data section.
 * Provides a UI for users to control visualization options, filters, and data layers.
 */
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
  Button,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { TreeIcon, AirQualityIcon, InfoCircleIcon, ChevronLeft, ChevronRight } from '../../../components/Icons';
import Plot from 'react-plotly.js';

const PillTabs = styled(Tabs)(({ theme }) => ({
  background: '#F5F7FA',
  borderRadius: 12,
  minHeight: 0,
  padding: 2,
  '.MuiTabs-indicator': {
    display: 'none',
  },
}));

const PillTab = styled(Tab)(({ theme }) => ({
  minHeight: 0,
  minWidth: 0,
  padding: '6px 20px',
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 16,
  color: '#6B7280',
  background: 'transparent',
  marginRight: 8,
  transition: 'background 0.2s, color 0.2s',
  '&.Mui-selected': {
    background: '#FFF',
    color: '#111827',
    boxShadow: '0 1px 2px rgba(16,30,54,0.06)',
  },
  '&:last-of-type': {
    marginRight: 0,
  },
}));

// Styled neutral outlined button for layer toggles
const LayerButton = styled(Button)<{ selected?: boolean }>(({ theme, selected }) => ({
  border: '1.5px solid',
  borderColor: selected ? theme.palette.primary.main : theme.palette.grey[300],
  background: selected ? theme.palette.action.selected : 'transparent',
  color: selected ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: 500,
  borderRadius: 8,
  boxShadow: 'none',
  textTransform: 'none',
  minHeight: 40,
  justifyContent: 'flex-start',
  px: 2,
  py: 1,
  gap: 1,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    background: theme.palette.action.hover,
  },
}));

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
  const [collapsed, setCollapsed] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (collapsed) {
    return (
      <Paper elevation={1} sx={{ p: 1, height: '100%', minWidth: 48, maxWidth: 48, display: 'flex', flexDirection: 'column', borderRadius: 3, alignItems: 'center', justifyContent: 'flex-start' }}>
        <IconButton aria-label="Expand panel" onClick={() => setCollapsed(false)} size="small" sx={{ mt: 1 }}>
          <ChevronRight size={24} />
        </IconButton>
      </Paper>
    );
  }

  // Overview Tab Content
  const renderOverviewTab = () => (
    <>
      {/* Data Layers Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Data Layers
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          gap: 2,
        }}>
          <LayerButton
            startIcon={<TreeIcon size={20} />}
            selected={treesLayerEnabled}
            variant="outlined"
            onClick={() => setTreesLayerEnabled(!treesLayerEnabled)}
          >
            Trees
          </LayerButton>
          <LayerButton
            startIcon={<AirQualityIcon size={20} />}
            selected={sensorsLayerEnabled}
            variant="outlined"
            onClick={() => setSensorsLayerEnabled(!sensorsLayerEnabled)}
          >
            Air Quality
          </LayerButton>
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
  
  // Render Air Quality Visualization Content
  const renderAirQualityVisualizationContent = () => (
    <>
      {/* PM2.5 Levels Chart */}
      <Box sx={{ mb: 3 }}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
            PM2.5 Levels
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            PM2.5 readings throughout the day
          </Typography>
          <Plot
            data={[{
              x: ['10:30 AM', '10:35 AM', '10:40 AM', '10:45 AM', '11:30 AM'],
              y: [8, 11, 8, 14, 9],
              type: 'bar',
              marker: { color: '#FF4081' },
              width: 0.6,
            }]}
            layout={{
              height: 180,
              margin: { l: 32, r: 8, t: 8, b: 32 },
              xaxis: { tickfont: { size: 12 } },
              yaxis: { range: [0, 16], tickfont: { size: 12 } },
              showlegend: false,
              plot_bgcolor: '#fff',
              paper_bgcolor: '#fff',
            }}
            config={{ displayModeBar: false }}
            style={{ width: '100%' }}
          />
        </Paper>
      </Box>
      {/* Temperature vs. Ozone Chart */}
      <Box sx={{ mb: 3 }}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
            Temperature vs. Ozone
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Correlation between temperature and ozone levels
          </Typography>
          <Plot
            data={[
              {
                x: ['10:35 AM', '10:40 AM', '11:30 AM'],
                y: [18, 19, 17],
                type: 'bar',
                name: 'Temperature',
                marker: { color: '#FFD600' },
                yaxis: 'y1',
                width: 0.3,
              },
              {
                x: ['10:35 AM', '10:40 AM', '11:30 AM'],
                y: [40, 38, 36],
                type: 'bar',
                name: 'Ozone',
                marker: { color: '#00B8D9' },
                yaxis: 'y2',
                width: 0.3,
              }
            ]}
            layout={{
              height: 180,
              margin: { l: 32, r: 40, t: 8, b: 32 },
              xaxis: { tickfont: { size: 12 } },
              yaxis: { title: '', range: [0, 20], tickfont: { size: 12 } },
              yaxis2: {
                title: '',
                overlaying: 'y',
                side: 'right',
                range: [0, 44],
                tickfont: { size: 12 },
              },
              barmode: 'group',
              showlegend: false,
              plot_bgcolor: '#fff',
              paper_bgcolor: '#fff',
            }}
            config={{ displayModeBar: false }}
            style={{ width: '100%' }}
          />
        </Paper>
      </Box>
    </>
  );
  
  // Details Tab Content
  const renderDetailsTab = () => (
    <>
      {/* Data Type Section */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
          Raw Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select data type to view
        </Typography>
        <DataTypeButtonGroup dataType={dataType} setDataType={setDataType} />
      </Paper>
      {/* Details List */}
      {dataType === 'airQuality' ? (
        // Air Quality Details Cards
        [
          {
            time: '5/1/2024, 10:30:00 AM', status: 'official', PM25: '8.3 µg/m³', PM10: '15.2 µg/m³', Ozone: '32 ppb', Temp: '18.5°C', Humidity: '65%'
          },
          {
            time: '5/1/2024, 10:35:00 AM', status: 'official', PM25: '10.1 µg/m³', PM10: '18.7 µg/m³', Ozone: '35 ppb', Temp: '19.2°C', Humidity: '62%'
          },
          {
            time: '5/1/2024, 10:40:00 AM', status: 'official', PM25: '7.8 µg/m³', PM10: '14.5 µg/m³', Ozone: '29 ppb', Temp: '18.8°C', Humidity: '64%'
          },
          {
            time: '5/1/2024, 11:15:00 AM', status: 'student', PM25: '12.3 µg/m³', PM10: '22.1 µg/m³', Ozone: '37 ppb', Temp: '19.9°C', Humidity: '60%'
          }
        ].map((item, idx) => (
          <Paper key={idx} elevation={0} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography fontWeight={600} fontSize={15} sx={{ flex: 1 }}>{item.time}</Typography>
              <Box sx={{
                px: 1.5, py: 0.2, borderRadius: 2, fontSize: 13, fontWeight: 600,
                bgcolor: item.status === 'official' ? '#E6F4FF' : '#FFF8E1',
                color: item.status === 'official' ? '#1976D2' : '#B28704',
                border: item.status === 'official' ? '1px solid #90CAF9' : '1px solid #FFE082',
                ml: 1
              }}>{item.status}</Box>
            </Box>
            <Box sx={{ pl: 1 }}>
              <Typography fontSize={14} sx={{ mb: 0.5 }}>PM2.5: <b>{item.PM25}</b></Typography>
              <Typography fontSize={14} sx={{ mb: 0.5 }}>PM10: <b>{item.PM10}</b></Typography>
              <Typography fontSize={14} sx={{ mb: 0.5 }}>Ozone: <b>{item.Ozone}</b></Typography>
              <Typography fontSize={14} sx={{ mb: 0.5 }}>Temperature: <b>{item.Temp}</b></Typography>
              <Typography fontSize={14}>Humidity: <b>{item.Humidity}</b></Typography>
            </Box>
          </Paper>
        ))
      ) : (
        // Trees Details Cards
        [
          { species: 'Coast Live Oak', height: '45 ft', dbh: '24"', date: '2024-03-15', health: 'excellent' },
          { species: 'California Redwood', height: '80 ft', dbh: '36"', date: '2024-03-10', health: 'good' },
          { species: 'American Elm', height: '35 ft', dbh: '18"', date: '2024-02-28', health: 'fair' },
          { species: 'London Plane', height: '40 ft', dbh: '20"', date: '2024-03-05', health: 'good' },
          { species: 'Monterey Pine', height: '55 ft', dbh: '22"', date: '2024-02-20', health: 'fair' },
          { species: 'Coast Live Oak', height: '52 ft', dbh: '20"', date: '2024-02-10', health: 'excellent' }
        ].map((item, idx) => (
          <Paper key={idx} elevation={0} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography fontWeight={600} fontSize={15} sx={{ flex: 1 }}>{item.species}</Typography>
              <Box sx={{
                px: 1.5, py: 0.2, borderRadius: 2, fontSize: 13, fontWeight: 600,
                bgcolor: item.health === 'excellent' ? '#E6F9EC' : item.health === 'good' ? '#F3FDEB' : '#FFF8E1',
                color: item.health === 'excellent' ? '#06B66A' : item.health === 'good' ? '#7CB342' : '#B28704',
                border: item.health === 'excellent' ? '1px solid #B2F2D7' : item.health === 'good' ? '1px solid #DCE775' : '1px solid #FFE082',
                ml: 1
              }}>{item.health}</Box>
            </Box>
            <Box sx={{ pl: 1 }}>
              <Typography fontSize={14} sx={{ mb: 0.5 }}>Height: <b>{item.height}</b></Typography>
              <Typography fontSize={14} sx={{ mb: 0.5 }}>DBH: <b>{item.dbh}</b></Typography>
              <Typography fontSize={14}>Date: <b>{item.date}</b></Typography>
            </Box>
          </Paper>
        ))
      )}
    </>
  );

  // Data Type Button Group for Charts tab
  const DataTypeButtonGroup = ({ dataType, setDataType }: { dataType: string, setDataType: (type: string) => void }) => (
    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
      <LayerButton
        startIcon={<TreeIcon size={20} />}
        selected={dataType === 'trees'}
        variant="outlined"
        onClick={() => setDataType('trees')}
      >
        Trees
      </LayerButton>
      <LayerButton
        startIcon={<AirQualityIcon size={20} />}
        selected={dataType === 'airQuality'}
        variant="outlined"
        onClick={() => setDataType('airQuality')}
      >
        Air Quality
      </LayerButton>
    </Box>
  );

  return (
    <Paper elevation={1} sx={{ p: 3, height: '100%', minWidth: 320, maxWidth: 400, display: 'flex', flexDirection: 'column', borderRadius: 3, position: 'relative' }}>
      <IconButton aria-label="Collapse panel" onClick={() => setCollapsed(true)} size="small" sx={{ position: 'absolute', top: 12, right: 12 }}>
        <ChevronLeft size={24} />
      </IconButton>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        Data Exploration
        <Box component="span" sx={{ ml: 'auto' }}>{/* Place for icon if needed */}</Box>
      </Typography>
      <PillTabs value={tabValue} onChange={handleTabChange} variant="standard" sx={{ mb: 3 }}>
        <PillTab disableRipple label="Overview" />
        <PillTab disableRipple label="Charts" />
        <PillTab disableRipple label="Details" />
      </PillTabs>
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {tabValue === 0 && renderOverviewTab()}
        {tabValue === 1 && (
          <>
            {/* Data Layers Header */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Data Layers
            </Typography>
            <DataTypeButtonGroup dataType={dataType} setDataType={setDataType} />
            {/* Charts for Trees */}
            {dataType === 'trees' && renderTreeVisualizationContent()}
            {/* Charts for Air Quality */}
            {dataType === 'airQuality' && renderAirQualityVisualizationContent()}
          </>
        )}
        {tabValue === 2 && renderDetailsTab()}
      </Box>
    </Paper>
  );
};
