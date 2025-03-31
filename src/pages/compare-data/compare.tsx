import { Box, Typography, Paper, Grid, Stack, FormControlLabel, Checkbox, Button, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { ChevronDown, DownloadIcon } from '../../components/Icons';
import Plot from 'react-plotly.js';

/**
 * Compare Datasets page
 * Shows side-by-side comparison of climate datasets with interactive charts
 */
const CompareDatasets: React.FC = () => {
  // State for sync controls
  const [syncTimelines, setSyncTimelines] = useState(true);
  const [syncYAxes, setSyncYAxes] = useState(false);

  // Mock data for the temperature charts
  const generateTemperatureData = (seed: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baselineTemp = 15;
    const amplitude = 15;
    
    return {
      x: months,
      y: months.map((_, i) => {
        // Create a sine wave pattern for temperature (higher in summer, lower in winter)
        // Add some random variation based on the seed
        return baselineTemp + amplitude * Math.sin((i / 11) * Math.PI) + (seed * 0.5 * (Math.random() - 0.5));
      }),
      type: 'scatter',
      mode: 'lines',
      line: {
        color: '#1E88E5',
        width: 3
      }
    };
  };

  // Dataset information
  const datasets = [
    {
      id: 1,
      title: 'Observed Temperature',
      source: 'Source: NOAA CDO',
      data: generateTemperatureData(1)
    },
    {
      id: 2,
      title: 'Model Projection',
      source: 'Source: CMIP6',
      data: generateTemperatureData(2)
    },
    {
      id: 3,
      title: 'Historical Average',
      source: 'Source: WorldClim',
      data: generateTemperatureData(3)
    },
    {
      id: 4,
      title: 'Satellite Data',
      source: 'Source: NASA NEO',
      data: generateTemperatureData(4)
    }
  ];

  // Layout configuration for all charts
  const getChartLayout = (title: string) => ({
    title: '',
    autosize: true,
    height: 240,
    margin: { l: 40, r: 30, t: 10, b: 40 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: {
      family: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },
    xaxis: {
      showgrid: true,
      gridcolor: '#f0f0f0'
    },
    yaxis: {
      range: syncYAxes ? [0, 25] : undefined,
      showgrid: true,
      gridcolor: '#f0f0f0'
    }
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fafafa' }}>
      <Box sx={{ p: 3, flex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Compare Datasets
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Compare multiple climate datasets side by side
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<ChevronDown size={16} />}
            >
              Layout: 2-up
            </Button>
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<DownloadIcon size={16} />}
            >
              Export
            </Button>
          </Box>
        </Box>
        
        {/* Controls */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={syncTimelines}
                onChange={() => setSyncTimelines(!syncTimelines)}
                size="small"
              />
            }
            label="Sync timelines"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={syncYAxes}
                onChange={() => setSyncYAxes(!syncYAxes)}
                size="small"
              />
            }
            label="Sync y-axes"
          />
        </Box>
        
        {/* Charts Grid */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 2, 
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          <Grid container spacing={3}>
            {datasets.map((dataset) => (
              <Grid item xs={12} md={6} key={dataset.id}>
                <Box sx={{ 
                  p: 0, 
                  borderRadius: 1, 
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}>
                  {/* Chart Header */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'grey.200'
                  }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {dataset.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dataset.source}
                      </Typography>
                    </Box>
                    <IconButton size="small">
                      <ChevronDown size={16} />
                    </IconButton>
                  </Box>
                  
                  {/* Chart */}
                  <Box sx={{ p: 1 }}>
                    <Plot
                      data={[dataset.data]}
                      layout={getChartLayout(dataset.title)}
                      style={{ width: '100%', height: '100%' }}
                      useResizeHandler={true}
                      config={{
                        responsive: true,
                        displaylogo: false,
                        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'toggleSpikelines']
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default CompareDatasets;
