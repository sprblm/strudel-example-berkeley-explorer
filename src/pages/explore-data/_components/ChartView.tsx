import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useFilters } from '../../../components/FilterContext';
import { filterData } from '../../../utils/filters.utils';
import { useListQuery } from '../../../utils/useListQuery';
import { taskflow } from '../_config/taskflow.config';
import Plot from 'react-plotly.js';

interface ChartViewProps {
  searchTerm: string;
  setPreviewItem: React.Dispatch<React.SetStateAction<any>>;
}

/**
 * Chart visualization view for the data
 */
export const ChartView: React.FC<ChartViewProps> = ({
  searchTerm,
  setPreviewItem,
}) => {
  const { activeFilters } = useFilters();
  const filterConfigs = taskflow.pages.index.tableFilters;
  
  const { isPending, isError, data, error } = useListQuery({
    activeFilters,
    dataSource: 'urban-tree-inventory',
    filterConfigs,
    queryMode: 'client',
    staticParams: { /* Add static params if necessary */ },
    offset: 0,
    page: 1,
    pageSize: 100,
  });

  // Add similar useListQuery for air quality data
  const { isPending: isPendingAirQuality, isError: isErrorAirQuality, data: airQualityData, error: airQualityError } = useListQuery({
    activeFilters,
    dataSource: 'air-quality',
    filterConfigs,
    queryMode: 'client',
    staticParams: { /* Add static params if necessary */ },
    offset: 0,
    page: 1,
    pageSize: 100,
  });

  if (isPending) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading chart data...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading chart data: {error.message}</Typography>
      </Box>
    );
  }

  // Filter the data based on active filters and search term
  const filteredTreeData = filterData(data, activeFilters, filterConfigs, searchTerm);
  const filteredAirQualityData = filterData(airQualityData, activeFilters, filterConfigs, searchTerm);

  // Create charts for urban tree inventory and air quality data
  const treeChartData = {
    x: filteredTreeData.map((item: any) => item.species),
    y: filteredTreeData.map((item: any) => item.count),
    type: 'bar' as const,
    name: 'Tree Species Count',
  };

  const airQualityChartData = {
    x: filteredAirQualityData.map((item: any) => item.parameter),
    y: filteredAirQualityData.map((item: any) => item.value),
    type: 'bar' as const,
    name: 'Air Quality Parameter Values',
  };

  return (
    <Plot
      data={[treeChartData, airQualityChartData]}
      layout={{ barmode: 'group' }}
      // Add other Plotly configurations
    />
  );

  // Extract columns for potential chart axes
  const columns = taskflow.pages.index.tableColumns;
  const numericColumns = columns.filter((col: any) => col.type === 'number');
  
  // If we don't have numeric columns, show a message
  if (numericColumns.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>No numeric data available for charting.</Typography>
      </Box>
    );
  }

  // Get the first two numeric columns for our default chart
  const xAxisField = numericColumns[0]?.field || columns[0].field;
  const yAxisField = numericColumns[1]?.field || (numericColumns[0]?.field !== columns[0].field ? columns[0].field : columns[1].field);
  
  // Get a categorical field for grouping if available
  const categoricalColumns = columns.filter((col: any) => col.type !== 'number');
  const groupField = categoricalColumns[0]?.field;

  // Prepare data for scatter plot
  const scatterData = {
    x: filteredTreeData.map((item: any) => item[xAxisField]),
    y: filteredTreeData.map((item: any) => item[yAxisField]),
    text: filteredTreeData.map((item: any) => item[columns[0].field]),
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: 10,
      opacity: 0.7,
    },
    name: 'Data Points'
  };

  // Prepare data for bar chart
  // Group by the categorical field if available
  let barData: any[] = [];
  
  if (groupField) {
    // Get unique categories
    const categories = [...new Set(filteredTreeData.map((item: any) => item[groupField]))];
    
    // Create a bar for each category
    barData = categories.map(category => {
      const categoryData = filteredTreeData.filter((item: any) => item[groupField] === category);
      return {
        x: categoryData.map((item: any) => item[xAxisField]),
        y: categoryData.map((item: any) => item[yAxisField]),
        type: 'bar',
        name: category as string,
      };
    });
  } else {
    // Simple bar chart without grouping
    barData = [{
      x: filteredTreeData.slice(0, 20).map((item: any) => item[columns[0].field]),
      y: filteredTreeData.slice(0, 20).map((item: any) => item[yAxisField]),
      type: 'bar',
      name: yAxisField,
    }];
  }

  // Prepare data for histogram
  const histogramData = {
    x: filteredTreeData.map((item: any) => item[xAxisField]),
    type: 'histogram',
    name: xAxisField,
  };

  // Handle clicking on a data point to show preview
  const handlePlotClick = (data: any) => {
    const pointIndex = data.points[0].pointIndex;
    if (Array.isArray(pointIndex)) {
      // For 2D data (heatmaps, etc.)
      return;
    }
    setPreviewItem(filteredTreeData[pointIndex]);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scatter Plot
            </Typography>
            <Box sx={{ height: 400 }}>
              <Plot
                data={[scatterData as Plotly.Data]}
                layout={{
                  title: `${yAxisField} vs ${xAxisField}`,
                  xaxis: { title: xAxisField },
                  yaxis: { title: yAxisField },
                  autosize: true,
                  margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
                onClick={(data) => handlePlotClick(data)}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Bar Chart
            </Typography>
            <Box sx={{ height: 400 }}>
              <Plot
                data={barData}
                layout={{
                  title: groupField ? `${yAxisField} by ${groupField}` : `${yAxisField} Values`,
                  xaxis: { title: groupField || xAxisField },
                  yaxis: { title: yAxisField },
                  autosize: true,
                  margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
                  barmode: 'group',
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
                onClick={(data) => handlePlotClick(data)}
              />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Distribution Histogram
            </Typography>
            <Box sx={{ height: 400 }}>
              <Plot
                data={[histogramData as Plotly.Data]}
                layout={{
                  title: `Distribution of ${xAxisField}`,
                  xaxis: { title: xAxisField },
                  yaxis: { title: 'Count' },
                  autosize: true,
                  margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
                }}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
