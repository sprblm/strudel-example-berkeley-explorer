/**
 * TreesContent component for the Compare Data section.
 * Visualizes tree-related data comparisons between two locations including species composition and health metrics.
 * Uses Plotly.js to render interactive charts for comparing tree inventories from the Berkeley tree dataset.
 */
import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import Plot from 'react-plotly.js';
import { PieData, Layout, Config } from 'plotly.js';

interface TreesContentProps {
  locationA: string;
  locationB: string;
}
const TreesContent: React.FC<TreesContentProps> = ({
  locationA,
  locationB,
}) => {
  // Mock data for tree species composition
  const treeSpeciesData = {
    [locationA]: {
      Coast: 40,
      Redwood: 20,
      London: 27,
      Monterey: 13,
    },
    [locationB]: {
      Coast: 33,
      Redwood: 42,
      Monterey: 25,
    },
  };

  // Mock data for tree dimensions
  const treeDimensionsData = {
    species: [
      'Coast Live Oak',
      'London Plane',
      'Redwood',
      'Monterey Pine',
      'Valley Oak',
      'Sequoia',
      'Western Red Cedar',
    ],
    heights: [40, 30, 35, 55, 35, 80, 45],
  };

  // Prepare data for tree species pie charts
  const locationAPieData: Partial<PieData> = {
    type: 'pie',
    labels: Object.keys(treeSpeciesData[locationA]),
    values: Object.values(treeSpeciesData[locationA]),
    textinfo: 'label+percent',
    textposition: 'outside' as const,
    automargin: true,
    marker: {
      colors: ['#4CAF50', '#2196F3', '#9C27B0', '#F44336'],
    },
  };

  const locationBPieData: Partial<PieData> = {
    type: 'pie',
    labels: Object.keys(treeSpeciesData[locationB]),
    values: Object.values(treeSpeciesData[locationB]),
    textinfo: 'label+percent',
    textposition: 'outside' as const,
    automargin: true,
    marker: {
      colors: ['#4CAF50', '#2196F3', '#F44336'],
    },
  };

  // Prepare data for tree dimensions bar chart
  const treeDimensionsBarData = {
    x: treeDimensionsData.species,
    y: treeDimensionsData.heights,
    type: 'bar' as const,
    name: 'Avg. Height (ft)',
    marker: {
      color: '#4CAF50' as string,
    },
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Tree Species Composition */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200',
              height: '100%',
            }}
          >
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
              Tree Species Composition
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Number of trees by species at each location
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight={500} textAlign="center">
                  {locationA}
                </Typography>
                <Box sx={{ height: 200 }}>
                  <Plot
                    data={[locationAPieData]}
                    layout={
                      {
                        showlegend: false,
                        margin: {
                          l: 0,
                          r: 0,
                          t: 0,
                          b: 0,
                        },
                        height: 200,
                        width: 200,
                      } as Partial<Layout>
                    }
                    style={{ width: '100%', height: '100%' }}
                    useResizeHandler={true}
                    config={{ responsive: true } as Partial<Config>}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight={500} textAlign="center">
                  {locationB}
                </Typography>
                <Box sx={{ height: 200 }}>
                  <Plot
                    data={[locationBPieData]}
                    layout={
                      {
                        showlegend: false,
                        margin: {
                          l: 0,
                          r: 0,
                          t: 0,
                          b: 0,
                        },
                        height: 200,
                        width: 200,
                      } as Partial<Layout>
                    }
                    style={{ width: '100%', height: '100%' }}
                    useResizeHandler={true}
                    config={{ responsive: true } as Partial<Config>}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Tree Dimensions */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200',
              height: '100%',
            }}
          >
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
              Tree Dimensions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Average height and DBH by species
            </Typography>

            <Box sx={{ height: 300 }}>
              <Plot
                data={[treeDimensionsBarData]}
                layout={
                  {
                    xaxis: {
                      title: 'Species',
                      tickangle: -45,
                    },
                    yaxis: {
                      title: 'Height (ft)',
                      range: [0, 100],
                    },
                    margin: {
                      l: 50,
                      r: 20,
                      t: 20,
                      b: 100,
                    },
                    autosize: true,
                  } as Partial<Layout>
                }
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
                config={{ responsive: true } as Partial<Config>}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TreesContent;
