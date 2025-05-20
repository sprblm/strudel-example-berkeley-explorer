import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
  Tab,
  Tabs,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink } from 'react-router-dom';
import { LabelValueTable } from './LabelValueTable';
import { DataGrid } from '@mui/x-data-grid';
import Plot from 'react-plotly.js';

interface LabelValuePair {
  label: string;
  value: React.ReactNode;
  type?: string;
  units?: string;
}

interface SharedPreviewPanelProps {
  /**
   * Data for the selected item to preview
   */
  previewItem: any;
  /**
   * Function to handle closing the preview panel
   */
  onClose: () => void;
  /**
   * Optional ID field for the data items (defaults to 'id')
   */
  idField?: string;
  /**
   * Optional columns configuration for displaying the item data
   */
  columns?: Array<{
    field: string;
    headerName?: string;
    type?: string;
    units?: string;
  }>;
  /**
   * Optional configuration for detail page navigation
   */
  detailsConfig?: {
    enabled: boolean;
    path: string;
  };
}

/**
 * Shared preview panel component that can be used across different sections
 * of the application to display detailed information about a selected item.
 */
export const SharedPreviewPanel: React.FC<SharedPreviewPanelProps> = ({
  previewItem,
  onClose,
  idField = 'id',
  columns = [],
  detailsConfig = { enabled: false, path: '' },
}) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Generate sample visualization data
  const generateVisualizationData = () => {
    try {
      // In a real implementation, this would fetch or process the actual data
      return {
        timeSeriesData: {
          x: Array.from({ length: 20 }, (_, i) => i),
          y: Array.from({ length: 20 }, (_, i) => Math.sin(i * 0.5) * 5 + 10),
        },
        scatterData: {
          x: [1, 2, 3, 4],
          y: [10, 15, 13, 17],
          text: ['A', 'B', 'C', 'D'],
        }
      };
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error generating visualization data:', error);
      }
      // Return safe default data
      return {
        timeSeriesData: {
          x: [0, 1, 2, 3, 4],
          y: [5, 10, 5, 10, 5],
        },
        scatterData: {
          x: [1, 2, 3, 4],
          y: [10, 15, 13, 17],
          text: ['A', 'B', 'C', 'D'],
        }
      };
    }
  };

  const visualizationData = generateVisualizationData();

  // If no item is selected, don't render anything
  if (!previewItem) {
    return null;
  }

  // Extract the item attributes to display in the details
  const attributes: LabelValuePair[] = useMemo(() => {
    if (columns?.length) {
      return columns.map(col => ({
        label: col.headerName || col.field || '',
        value: previewItem[col.field] as React.ReactNode,
        type: col.type,
        units: col.units
      }));
    }
    return Object.entries(previewItem).map(([key, value]) => ({
      label: key,
      value: value as React.ReactNode,
      type: typeof value === 'number' ? 'number' : 'string'
    }));
  }, [columns, previewItem]);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderLeft: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between"
        sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Typography variant="h6" component="h2">
          {previewItem.name || previewItem.title || `Item ${previewItem[idField]}`}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Details" />
          <Tab label="Visualizations" />
          <Tab label="Related" />
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {/* Details Tab */}
        {tabValue === 0 && (
          <Stack spacing={2}>
            <LabelValueTable rows={attributes} />
            
            {detailsConfig.enabled && (
              <Button 
                component={RouterLink} 
                to={`${detailsConfig.path}/${previewItem[idField]}`}
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                View Full Details
              </Button>
            )}
          </Stack>
        )}

        {/* Visualizations Tab */}
        {tabValue === 1 && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Time Series Data
              </Typography>
              <Plot
                data={[
                  {
                    x: visualizationData.timeSeriesData.x,
                    y: visualizationData.timeSeriesData.y,
                    type: 'scatter',
                    mode: 'lines+markers',
                    marker: {color: 'blue'},
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 300,
                  margin: {l: 50, r: 50, t: 30, b: 50},
                  xaxis: {title: {text: 'Time'}},
                  yaxis: {title: {text: 'Value'}},
                }}
                style={{width: '100%'}}
                useResizeHandler={true}
                onError={(error) => {
                  if (process.env.NODE_ENV !== 'production') {
                    // eslint-disable-next-line no-console
                    console.error('Error rendering Plotly chart:', error);
                  }
                }}
              />
            </Box>
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Data Distribution
              </Typography>
              <Plot
                data={[
                  {
                    x: visualizationData.scatterData.x,
                    y: visualizationData.scatterData.y,
                    text: visualizationData.scatterData.text,
                    type: 'scatter',
                    mode: 'markers',
                    marker: {
                      size: 12,
                      color: 'rgba(55, 128, 191, 0.7)',
                    },
                  },
                ]}
                layout={{
                  autosize: true,
                  height: 300,
                  margin: {l: 50, r: 50, t: 30, b: 50},
                  xaxis: {title: {text: 'X Value'}},
                  yaxis: {title: {text: 'Y Value'}},
                }}
                style={{width: '100%'}}
                useResizeHandler={true}
                onError={(error) => {
                  if (process.env.NODE_ENV !== 'production') {
                    // eslint-disable-next-line no-console
                    console.error('Error rendering Plotly chart:', error);
                  }
                }}
              />
            </Box>
          </Stack>
        )}

        {/* Related Tab */}
        {tabValue === 2 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Related Items
            </Typography>
            <DataGrid
              rows={Array(5).fill(0).map((_, i) => ({
                id: i,
                name: `Related Item ${i + 1}`,
                type: 'Dataset',
                relation: 'Referenced'
              }))}
              columns={[
                { field: 'name', headerName: 'Name', flex: 1 },
                { field: 'type', headerName: 'Type', width: 120 },
                { field: 'relation', headerName: 'Relation', width: 120 }
              ]}
              pageSizeOptions={[5]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              autoHeight
              disableRowSelectionOnClick
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
};
