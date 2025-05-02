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

  // Fetch actual tree data and air quality data
  const treeData = {
    x: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
    y: [10, 20, 30, 40],
    type: 'bar' as const,
    name: 'Tree Inventory',
  };

  const airQualityData = {
    x: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
    y: [5, 10, 15, 20],
    type: 'bar' as const,
    name: 'Air Quality',
  };
    const categories = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
    
    return {
      x: categories,
      y: categories.map((_, i) => {
        // Create some mock data based on the seed and type
        return seed * (i + 1) * (type === 'tree' ? 10 : 5);
      }),
      type: 'bar' as const,
      name: type === 'tree' ? 'Tree Inventory' : 'Air Quality',
    };
  };

  const treeData = {
    x: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
    y: [10, 20, 30, 40],
    type: 'bar' as const,
    name: 'Tree Inventory',
  };

  const airQualityData = {
    x: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
    y: [5, 10, 15, 20],
    type: 'bar' as const,
    name: 'Air Quality',
  };

  // Dataset information for urban tree inventory and air quality
  const datasets = [
    {
      id: 1,
      title: 'Urban Tree Inventory',
      source: 'Source: Local Government Data',
      data: treeData,
    },
    {
      id: 2,
      title: 'Air Quality Measurements',
      source: 'Source: Environmental Agency',
      data: airQualityData,
    },
    {
      id: 1,
      title: 'Urban Tree Inventory',
      source: 'Source: Local Government Data',
      data: treeData,
    },
    {
      id: 2,
      title: 'Air Quality Measurements',
      source: 'Source: Environmental Agency',
      data: airQualityData,
    },
  ];

  // --- Calculate Statistical Summaries (Example) ---
  const calculateSummary = (data: { y: number[] }) => {
    if (!data || !data.y || data.y.length === 0) return {
      average: 0,
      total: 0,
      max: 0,
      min: 0,
      median: 0
    };
    
    const sortedData = [...data.y].sort((a, b) => a - b);
    const sum = data.y.reduce((acc, val) => acc + val, 0);
    const average = sum / data.y.length;
    const max = sortedData[sortedData.length - 1];
    const min = sortedData[0];
    const median = sortedData.length % 2 === 0
      ? (sortedData[sortedData.length / 2 - 1] + sortedData[sortedData.length / 2]) / 2
      : sortedData[Math.floor(sortedData.length / 2)];
  
    return {
      average: average.toFixed(2),
      total: sum,
      max: max.toFixed(2),
      min: min.toFixed(2),
      median: median.toFixed(2)
    };
  };
  
  const treeSummary = calculateSummary(treeData);
  const airQualitySummary = calculateSummary(airQualityData);

  // --- Render Component ---
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 2 }}>
        Compare Datasets
      </Typography>
      <Grid container spacing={3}>
        {/* Plot */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Plot
              data={datasets.map(dataset => dataset.data)}
              layout={{
                barmode: 'group',
                title: 'Comparison Chart',
                height: 300,
                margin: { t: 40, b: 40, l: 40, r: 20 }
              }}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler={true}
            />
          </Paper>
        </Grid>
        {/* Additional Plot for Relationship Visualization */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Plot
              data={[{
                x: treeData.y,
                y: airQualityData.y,
                type: 'scatter',
                mode: 'markers',
                name: 'Tree Inventory vs Air Quality'
              }]}
              layout={{
                title: 'Relationship between Tree Inventory and Air Quality',
                xaxis: { title: 'Tree Inventory' },
                yaxis: { title: 'Air Quality Measurements' },
                height: 300,
                margin: { t: 40, b: 40, l: 40, r: 20 }
              }}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler={true}
            />
          </Paper>
        </Grid>

        {/* Statistical Summaries */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Tree Inventory Summary</Typography>
            <Typography>Average Value: {treeSummary.average}</Typography>
            <Typography>Total Value: {treeSummary.total}</Typography>
            <Typography>Max Value: {treeSummary.max}</Typography>
            <Typography>Min Value: {treeSummary.min}</Typography>
            <Typography>Median Value: {treeSummary.median}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Air Quality Summary</Typography>
            <Typography>Average Value: {airQualitySummary.average}</Typography>
            <Typography>Total Value: {airQualitySummary.total}</Typography>
            <Typography>Max Value: {airQualitySummary.max}</Typography>
            <Typography>Min Value: {airQualitySummary.min}</Typography>
            <Typography>Median Value: {airQualitySummary.median}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompareDatasets;
