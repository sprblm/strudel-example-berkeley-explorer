import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import Plot from 'react-plotly.js';

interface AirQualityContentProps {
  locationA: string;
  locationB: string;
}

/**
 * Air Quality content component showing PM2.5 levels and ozone comparison
 */
const AirQualityContent: React.FC<AirQualityContentProps> = ({
  locationA,
  locationB
}) => {
  // Mock data for PM2.5 levels throughout the day
  const pm25Data = {
    times: ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'],
    [locationA]: [7.8, 8.5, 9.2, 10.1, 11.2, 9.5],
    [locationB]: [8.5, 10.2, 11.0, 11.8, 12.3, 10.8]
  };

  // Mock data for ozone comparison
  const ozoneData = {
    times: ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'],
    [locationA]: [28, 32, 35, 38, 34],
    [locationB]: [30, 35, 40, 42, 38]
  };

  // Prepare data for PM2.5 line chart
  const pm25LocationAData = {
    x: pm25Data.times,
    y: pm25Data[locationA],
    type: 'scatter' as const,
    mode: 'lines+markers' as const,
    name: `${locationA} PM2.5`,
    line: {
      color: '#3B82F6',
      width: 2
    },
    marker: {
      color: '#3B82F6',
      size: 6
    }
  };

  const pm25LocationBData = {
    x: pm25Data.times,
    y: pm25Data[locationB],
    type: 'scatter' as const,
    mode: 'lines+markers' as const,
    name: `${locationB} PM2.5`,
    line: {
      color: '#F59E0B',
      width: 2
    },
    marker: {
      color: '#F59E0B',
      size: 6
    }
  };

  // Prepare data for ozone bar chart
  const ozoneLocationAData = {
    x: ozoneData.times,
    y: ozoneData[locationA],
    type: 'bar' as const,
    name: `${locationA}`,
    marker: {
      color: '#3B82F6'
    }
  };

  const ozoneLocationBData = {
    x: ozoneData.times,
    y: ozoneData[locationB],
    type: 'bar' as const,
    name: `${locationB}`,
    marker: {
      color: '#F59E0B'
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* PM2.5 Levels Throughout the Day */}
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              borderRadius: 2, 
              border: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
              PM2.5 Levels Throughout the Day
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Comparison of PM2.5 readings between locations
            </Typography>
            
            <Box sx={{ height: 300 }}>
              <Plot
                data={[pm25LocationAData, pm25LocationBData]}
                layout={{
                  xaxis: {
                    title: '',
                    showgrid: false
                  },
                  yaxis: {
                    title: 'µg/m³',
                    range: [0, 16]
                  },
                  legend: {
                    orientation: 'h',
                    y: -0.2
                  },
                  margin: {
                    l: 50,
                    r: 20,
                    t: 20,
                    b: 50
                  },
                  autosize: true,
                  hovermode: 'closest'
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
                config={{ responsive: true }}
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* Ozone Comparison and Key Findings */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              borderRadius: 2, 
              border: '1px solid',
              borderColor: 'grey.200',
              height: '100%'
            }}
          >
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
              Ozone Comparison
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ozone levels (ppb) between locations
            </Typography>
            
            <Box sx={{ height: 250 }}>
              <Plot
                data={[ozoneLocationAData, ozoneLocationBData]}
                layout={{
                  barmode: 'group',
                  xaxis: {
                    title: '',
                    showgrid: false
                  },
                  yaxis: {
                    title: 'ppb',
                    range: [0, 60]
                  },
                  legend: {
                    orientation: 'h',
                    y: -0.2
                  },
                  margin: {
                    l: 50,
                    r: 20,
                    t: 20,
                    b: 50
                  },
                  autosize: true
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
                config={{ responsive: true }}
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* Key Findings */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              borderRadius: 2, 
              border: '1px solid',
              borderColor: 'grey.200',
              height: '100%'
            }}
          >
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2 }}>
              Key Findings
            </Typography>
            <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 1 }}>
              Summary of air quality observations
            </Typography>
            <Typography variant="body2" paragraph>
              PM2.5 levels at {locationB} are consistently 15-20% higher than at {locationA}, 
              likely due to differences in tree canopy coverage and proximity to traffic routes.
            </Typography>
            
            <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 1 }}>
              Ozone Patterns
            </Typography>
            <Typography variant="body2" paragraph>
              Ozone concentrations peak during mid-afternoon at both locations, with {locationB} showing 
              consistently higher values. This correlates with increased temperature and solar radiation.
            </Typography>
            
            <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 1 }}>
              Health Implications
            </Typography>
            <Typography variant="body2">
              While both locations maintain air quality levels generally within healthy guidelines, the 
              consistently better readings at {locationA} may provide valuable insights for campus 
              urban planning and tree planting strategies.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AirQualityContent;
