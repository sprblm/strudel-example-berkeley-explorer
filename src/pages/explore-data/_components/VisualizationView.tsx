import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  ButtonGroup, 
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import Plot from 'react-plotly.js';
import * as d3 from 'd3-fetch';
import { ChevronLeft, DownloadIcon, FilterIcon } from '../../../components/Icons';

interface VisualizationViewProps {
  activeChart: 'timeSeries' | 'map' | 'histogram' | 'distribution';
  onToggleControls: () => void;
  showControls: boolean;
}

/**
 * Main visualization component for the explore data page
 * Uses Plotly.js for charts and visualizations
 */
export const VisualizationView: React.FC<VisualizationViewProps> = ({
  activeChart,
  onToggleControls,
  showControls
}) => {
  // Mock temperature data for demo - in a real app this would come from an API
  const generateTemperatureData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baselineTemp = 15;
    const amplitude = 15;
    
    const temps = months.map((_, i) => {
      // Create a sine wave pattern for temperature (higher in summer, lower in winter)
      return baselineTemp + amplitude * Math.sin((i / 11) * Math.PI);
    });
    
    return { months, temps };
  };
  
  const { months, temps } = generateTemperatureData();
  
  // Generate chart data for Plotly based on active chart type
  const getChartData = () => {
    switch (activeChart) {
      case 'timeSeries':
        return [{
          x: months,
          y: temps,
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: '#1E88E5' },
          line: { width: 3 },
          name: 'Temperature (°C)'
        }];
      
      case 'histogram':
        return [{
          x: temps,
          type: 'histogram',
          marker: { color: '#1E88E5' },
          name: 'Temperature Distribution'
        }];
        
      case 'distribution':
        return [{
          y: temps,
          type: 'box',
          marker: { color: '#1E88E5' },
          name: 'Temperature Distribution'
        }];
        
      case 'map':
        // For map we would use a different approach, perhaps with leaflet
        // But for demo purposes, we'll use a scatter plot
        return [{
          x: [-85, -80, -75, -70, -65],
          y: [40, 35, 30, 45, 25],
          type: 'scatter',
          mode: 'markers',
          marker: { 
            color: temps,
            colorscale: 'Viridis',
            size: 15,
            showscale: true,
            colorbar: {
              title: 'Temperature (°C)'
            }
          },
          name: 'Geographic Distribution'
        }];
      
      default:
        return [{
          x: months,
          y: temps,
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: '#1E88E5' },
          name: 'Temperature (°C)'
        }];
    }
  };
  
  // Get layout configuration for Plotly
  const getChartLayout = () => {
    const baseLayout = {
      autosize: true,
      height: 500,
      margin: { l: 50, r: 30, t: 50, b: 50 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: {
        family: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      },
      hovermode: 'closest'
    };
    
    switch (activeChart) {
      case 'timeSeries':
        return {
          ...baseLayout,
          title: 'Temperature Trends',
          xaxis: { 
            title: 'Month',
            gridcolor: '#f0f0f0'
          },
          yaxis: { 
            title: 'Temperature (°C)',
            gridcolor: '#f0f0f0'
          }
        };
        
      case 'histogram':
        return {
          ...baseLayout,
          title: 'Temperature Distribution',
          xaxis: { 
            title: 'Temperature (°C)',
            gridcolor: '#f0f0f0' 
          },
          yaxis: { 
            title: 'Frequency',
            gridcolor: '#f0f0f0'
          }
        };
        
      case 'distribution':
        return {
          ...baseLayout,
          title: 'Statistical Distribution',
          yaxis: { 
            title: 'Temperature (°C)',
            gridcolor: '#f0f0f0'
          }
        };
        
      case 'map':
        return {
          ...baseLayout,
          title: 'Geographic Distribution',
          xaxis: { 
            title: 'Longitude',
            gridcolor: '#f0f0f0'
          },
          yaxis: { 
            title: 'Latitude',
            gridcolor: '#f0f0f0'
          }
        };
        
      default:
        return baseLayout;
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 0, 
        height: '100%', 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Visualization Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'grey.200'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Temperature Trends
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            Monthly average temperature data
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={showControls ? "Hide controls" : "Show controls"}>
            <IconButton 
              size="small" 
              onClick={onToggleControls}
              sx={{ 
                border: '1px solid',
                borderColor: 'grey.300' 
              }}
            >
              {showControls ? <ChevronLeft size={18} /> : <FilterIcon size={18} />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Export data">
            <IconButton 
              size="small"
              sx={{ 
                border: '1px solid',
                borderColor: 'grey.300' 
              }}
            >
              <DownloadIcon size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Visualization Controls */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        gap: 2,
        borderBottom: '1px solid',
        borderColor: 'grey.200'
      }}>
        <ButtonGroup variant="outlined" size="small">
          <Button 
            color={activeChart === 'timeSeries' ? 'primary' : 'inherit'}
            variant={activeChart === 'timeSeries' ? 'contained' : 'outlined'}
          >
            Time Series
          </Button>
          <Button 
            color={activeChart === 'map' ? 'primary' : 'inherit'}
            variant={activeChart === 'map' ? 'contained' : 'outlined'}
          >
            Map View
          </Button>
          <Button 
            color={activeChart === 'histogram' ? 'primary' : 'inherit'}
            variant={activeChart === 'histogram' ? 'contained' : 'outlined'}
          >
            Histogram
          </Button>
          <Button 
            color={activeChart === 'distribution' ? 'primary' : 'inherit'}
            variant={activeChart === 'distribution' ? 'contained' : 'outlined'}
          >
            Distribution
          </Button>
        </ButtonGroup>
        
        <Divider orientation="vertical" flexItem />
        
        <Button variant="outlined" size="small">
          Export
        </Button>
      </Box>
      
      {/* Visualization Content */}
      <Box sx={{ 
        flex: 1, 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Plot
          data={getChartData()}
          layout={getChartLayout()}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
          config={{
            responsive: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['lasso2d', 'select2d', 'toggleSpikelines']
          }}
        />
      </Box>
    </Paper>
  );
};
