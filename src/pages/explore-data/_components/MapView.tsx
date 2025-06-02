/**
 * MapView component for the Explore Data section.
 * Provides a map-based visualization of environmental data using Mapbox GL.
 * Displays tree locations, air quality data points, and other geographic information.
 */
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useFilters } from '../../../components/FilterContext';
import { filterData } from '../../../utils/filters.utils';
import { useListQuery } from '../../../utils/useListQuery';
import { taskflow } from '../_config/taskflow.config';
import Plot from 'react-plotly.js';
import { FilterConfig } from '../../../types/filters.types';

interface MapViewProps {
  searchTerm: string;
  setPreviewItem: React.Dispatch<React.SetStateAction<any>>;
}
 */
export const MapView: React.FC<MapViewProps> = ({
  searchTerm,
  setPreviewItem,
}) => {
  const { activeFilters } = useFilters();
  const filterConfigs = taskflow.pages.index.tableFilters || [];
   
  const { isPending, isError, data } = useListQuery({
    activeFilters,
    dataSource: 'urban-tree-inventory',
    filterConfigs: filterConfigs as FilterConfig[],
    queryMode: 'client',
    staticParams: { /* Add static params if necessary */ },
    offset: 0,
    page: 1,
    pageSize: 100,
  });

  // Add similar useListQuery for air quality data
  const { data: airQualityData } = useListQuery({
    activeFilters,
    dataSource: 'air-quality',
    filterConfigs: filterConfigs as FilterConfig[],
    queryMode: 'client',
    staticParams: { /* Add static params if necessary */ },
    offset: 0,
    page: 1,
    pageSize: 100,
  });

  if (isPending) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading map data...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading map data. Please try again later.</Typography>
      </Box>
    );
  }

  // Filter the data based on active filters and search term
  const filteredTreeData = filterData(data, activeFilters, filterConfigs as FilterConfig[], searchTerm);
  const filteredAirQualityData = filterData(airQualityData, activeFilters, filterConfigs as FilterConfig[], searchTerm);

  // Combine and visualize both tree and air quality data on the map
  const combinedData: Plotly.Data[] = [
    // Baseline Tree location data
    {
      type: 'scattermapbox' as const,
      lat: filteredTreeData.filter((item: any) => item.isBaseline).map((item: any) => item.location[1]),
      lon: filteredTreeData.filter((item: any) => item.isBaseline).map((item: any) => item.location[0]),
      text: filteredTreeData.filter((item: any) => item.isBaseline).map((item: any) => item.species),
      mode: 'markers' as const,
      marker: {
        size: 10,
        color: 'grey', // Baseline trees
      },
    },
    // Contributed Tree location data
    {
      type: 'scattermapbox' as const,
      lat: filteredTreeData.filter((item: any) => !item.isBaseline).map((item: any) => item.location[1]),
      lon: filteredTreeData.filter((item: any) => !item.isBaseline).map((item: any) => item.location[0]),
      text: filteredTreeData.filter((item: any) => !item.isBaseline).map((item: any) => item.species),
      mode: 'markers' as const,
      marker: {
        size: 10,
        color: 'green', // Contributed trees
      },
    },
    // Air quality data
    {
      type: 'scattermapbox' as const,
      lat: filteredAirQualityData.filter((item: any) => item.isBaseline).map((item: any) => item.location[1]),
      lon: filteredAirQualityData.filter((item: any) => item.isBaseline).map((item: any) => item.location[0]),
      text: filteredAirQualityData.filter((item: any) => item.isBaseline).map((item: any) => item.parameter),
      mode: 'markers' as const,
      marker: {
        size: 10,
        color: 'blue', // AirNow data
      },
    },
    // Contributed AQ Readings
    {
      type: 'scattermapbox' as const,
      lat: filteredAirQualityData.filter((item: any) => !item.isBaseline).map((item: any) => item.location[1]),
      lon: filteredAirQualityData.filter((item: any) => !item.isBaseline).map((item: any) => item.location[0]),
      text: filteredAirQualityData.filter((item: any) => !item.isBaseline).map((item: any) => item.parameter),
      mode: 'markers' as const,
      marker: {
        size: 10,
        color: 'red', // Contributed AQ readings
      },
    },
    // Air quality data
    {
      type: 'scattermapbox' as const,
      lat: filteredAirQualityData.map((item: any) => item.lat),
      lon: filteredAirQualityData.map((item: any) => item.lon),
      text: filteredAirQualityData.map((item: any) => item.parameter),
      mode: 'markers' as const,
      marker: {
        size: 10,
      },
    },
  ];

  const layout = {
    mapbox: {
      style: 'open-street-map',
      center: { lat: 37.7749, lon: -122.4194 }, // Example coordinates
      zoom: 12,
    },
  };

  return (
    <Plot
      data={combinedData}
      layout={layout}
      // Add other Plotly configurations
    />
  );

  // Extract columns for potential map data
  const columns = taskflow.pages.index.tableColumns ?? [];
  const numericColumns = columns.filter((col: any) => col.type === 'number');
  
  // For a map, we need to generate some latitude and longitude data
  // In a real application, this would come from the actual data
  // Here we'll generate random coordinates for demonstration
  const mapData = filteredTreeData.map((item, index) => {
    // Generate random coordinates centered around different regions based on some property
    // This is just for demonstration - in a real app, you'd use actual coordinates
    // Use some property to determine the region, or just use the index
    const region = index % 5;
    
    let regionLatitude, regionLongitude;
    
    switch(region) {
      case 0: // North America
        regionLatitude = 40;
        regionLongitude = -100;
        break;
      case 1: // Europe
        regionLatitude = 50;
        regionLongitude = 10;
        break;
      case 2: // Asia
        regionLatitude = 30;
        regionLongitude = 100;
        break;
      case 3: // South America
        regionLatitude = -20;
        regionLongitude = -60;
        break;
      case 4: // Africa
        regionLatitude = 0;
        regionLongitude = 20;
        break;
      default:
        regionLatitude = 0;
        regionLongitude = 0;
    }
    
    // Add some random variation
    const latitude = regionLatitude + (Math.random() - 0.5) * 20;
    const longitude = regionLongitude + (Math.random() - 0.5) * 20;
    
    // Use a numeric field for the size of the marker if available
    const sizeField = numericColumns[0]?.field;
    const size = sizeField ? Math.max(5, Math.min(20, (item as any)[sizeField] / 10)) : 10;
    
    return {
      ...item,
      latitude,
      longitude,
      size
    };
  });

  // Handle clicking on a map point to show preview
  const handleMapClick = (clickData: any) => {
    const pointIndex = clickData.points[0].pointIndex;
    setPreviewItem(filteredTreeData[pointIndex]);
  };

  // Get a field to use for coloring the points
  const colorField = numericColumns[1]?.field || numericColumns[0]?.field;
  const colorValues = colorField ? mapData.map((item: any) => item[colorField]) : [];
  
  // Get a field for the hover text
  const titleField = columns?.[0]?.field || 'id';

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Global Distribution Map
        </Typography>
        <Box sx={{ height: 600 }}>
          <Plot
            data={[
              {
                type: 'scattergeo',
                mode: 'markers',
                lon: mapData.map(item => item.longitude),
                lat: mapData.map(item => item.latitude),
                text: mapData.map((item: any) => item[titleField]),
                marker: {
                  size: mapData.map(item => item.size),
                  color: colorField ? colorValues : 'blue',
                  colorscale: 'Viridis',
                  showscale: !!colorField,
                  colorbar: colorField ? {
                    title: { text: columns?.find((col: any) => col.field === colorField)?.headerName || colorField }
                  } : undefined,
                  opacity: 0.8,
                },
                name: 'Data Points',
                hoverinfo: 'text',
                hovertext: mapData.map(item => {
                  // Create hover text with key information
                  return `${(item as any)[titleField]}<br>` +
                    (columns ? columns.slice(1, 4).map((col: any) =>
                      `${col.headerName}: ${(item as any)[col.field]}${col.units ? ` ${col.units}` : ''}`
                    ).join('<br>') : '')
                })
              }
            ]}
            layout={{
              title: { text: 'Climate Data Geographic Distribution' },
              autosize: true,
              margin: { l: 0, r: 0, b: 0, t: 50, pad: 4 },
              geo: {
                scope: 'world',
                showland: true,
                landcolor: 'rgb(217, 217, 217)',
                subunitcolor: 'rgb(255, 255, 255)',
                countrycolor: 'rgb(255, 255, 255)',
                showlakes: true,
                lakecolor: 'rgb(255, 255, 255)',
                showsubunits: true,
                showcountries: true,
                resolution: 50,
                projection: {
                  type: 'natural earth'
                }
              }
            }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
            onClick={(clickData) => handleMapClick(clickData)}
          />
        </Box>
      </Paper>
    </Box>
  );
};
