import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import Plot from 'react-plotly.js';

interface OverviewContentProps {
  locationA: string;
  locationB: string;
}

/**
 * Overview content component showing environmental factors and tree health comparisons
 */
const OverviewContent: React.FC<OverviewContentProps> = ({
  locationA,
  locationB
}) => {
  // Mock data for environmental factors radar chart
  const environmentalFactorsData = {
    [locationA]: {
      treeDiversity: 8.0,
      temperature: 7.2,
      airQuality: 8.5,
      shadeCoverage: 8.2,
      plantDiversity: 7.5,
      noiseLevel: 5.8
    },
    [locationB]: {
      treeDiversity: 7.0,
      temperature: 8.5,
      airQuality: 6.8,
      shadeCoverage: 5.5,
      plantDiversity: 6.0,
      noiseLevel: 7.2
    }
  };

  // Mock data for tree health bar chart
  const treeHealthData = {
    [locationA]: {
      excellent: 8,
      good: 5,
      fair: 2,
      poor: 0
    },
    [locationB]: {
      excellent: 6,
      good: 4,
      fair: 2,
      poor: 1
    }
  };

  // Mock data for key differences
  const keyDifferences = {
    [locationA]: [
      { text: 'Higher tree density and diversity' },
      { text: 'Better air quality overall' },
      { text: 'More shade coverage throughout the day' }
    ],
    [locationB]: [
      { text: 'Taller trees on average' },
      { text: 'Higher PM2.5 levels' },
      { text: 'Higher daily temperature fluctuation' }
    ]
  };

  // Prepare data for environmental factors radar chart
  const categories = ['Tree Diversity', 'Temperature', 'Air Quality', 'Shade Coverage', 'Plant Diversity', 'Noise Level'];
  
  const locationARadarData = {
    type: 'scatterpolar' as const,
    r: [
      environmentalFactorsData[locationA].treeDiversity,
      environmentalFactorsData[locationA].temperature,
      environmentalFactorsData[locationA].airQuality,
      environmentalFactorsData[locationA].shadeCoverage,
      environmentalFactorsData[locationA].plantDiversity,
      environmentalFactorsData[locationA].noiseLevel
    ],
    theta: categories,
    fill: 'toself' as 'toself',
    name: locationA,
    line: {
      color: '#3B82F6'
    },
    fillcolor: 'rgba(59, 130, 246, 0.2)'
  };

  const locationBRadarData = {
    type: 'scatterpolar' as const,
    r: [
      environmentalFactorsData[locationB].treeDiversity,
      environmentalFactorsData[locationB].temperature,
      environmentalFactorsData[locationB].airQuality,
      environmentalFactorsData[locationB].shadeCoverage,
      environmentalFactorsData[locationB].plantDiversity,
      environmentalFactorsData[locationB].noiseLevel
    ],
    theta: categories,
    fill: 'toself' as 'toself',
    name: locationB,
    line: {
      color: '#F59E0B'
    },
    fillcolor: 'rgba(245, 158, 11, 0.2)'
  };

  // Prepare data for tree health bar chart
  const healthCategories = ['Excellent', 'Good', 'Fair', 'Poor'];
  
  const locationABarData = {
    x: healthCategories,
    y: [
      treeHealthData[locationA].excellent,
      treeHealthData[locationA].good,
      treeHealthData[locationA].fair,
      treeHealthData[locationA].poor
    ],
    type: 'bar' as const,
    name: locationA,
    marker: {
      color: '#3B82F6'
    }
  };

  const locationBBarData = {
    x: healthCategories,
    y: [
      treeHealthData[locationB].excellent,
      treeHealthData[locationB].good,
      treeHealthData[locationB].fair,
      treeHealthData[locationB].poor
    ],
    type: 'bar' as const,
    name: locationB,
    marker: {
      color: '#F59E0B'
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Environmental Factors Comparison */}
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
              Environmental Factors Comparison
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Radar chart comparing various environmental metrics
            </Typography>
            
            <Box sx={{ height: 300 }}>
              <Plot
                data={[locationARadarData, locationBRadarData]}
                layout={{
                  polar: {
                    radialaxis: {
                      visible: true,
                      range: [0, 10]
                    }
                  },
                  showlegend: true,
                  legend: {
                    orientation: 'h',
                    y: -0.2
                  },
                  margin: {
                    l: 40,
                    r: 40,
                    t: 20,
                    b: 40
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
        
        {/* Tree Health Comparison */}
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
              Tree Health Comparison
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Number of trees by health status at each location
            </Typography>
            
            <Box sx={{ height: 300 }}>
              <Plot
                data={[locationABarData, locationBBarData]}
                layout={{
                  barmode: 'group',
                  xaxis: {
                    title: 'Health Status'
                  },
                  yaxis: {
                    title: 'Number of Trees',
                    range: [0, 10]
                  },
                  legend: {
                    orientation: 'h',
                    y: -0.2
                  },
                  margin: {
                    l: 40,
                    r: 20,
                    t: 20,
                    b: 80
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
        
        {/* Summary of Key Differences */}
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              border: '1px solid',
              borderColor: 'grey.200'
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3 }}>
              Summary of Key Differences
            </Typography>
            
            <Grid container spacing={3}>
              {/* Location A Differences */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2 }}>
                  {locationA}
                </Typography>
                
                {keyDifferences[locationA].map((item, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      mb: 1.5 
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: '50%', 
                        bgcolor: '#4CAF50',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 10,
                        mr: 1,
                        mt: 0.5
                      }}
                    >
                      ✓
                    </Box>
                    <Typography variant="body2">
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Grid>
              
              {/* Location B Differences */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" fontWeight={500} sx={{ mb: 2 }}>
                  {locationB}
                </Typography>
                
                {keyDifferences[locationB].map((item, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      mb: 1.5 
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: '50%', 
                        bgcolor: '#4CAF50',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 10,
                        mr: 1,
                        mt: 0.5
                      }}
                    >
                      ✓
                    </Box>
                    <Typography variant="body2">
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewContent;
