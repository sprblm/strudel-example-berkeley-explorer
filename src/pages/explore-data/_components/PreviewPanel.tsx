import React from 'react';
import {
  Box,
  Button,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography,
  Tab,
  Tabs,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Link as RouterLink } from 'react-router-dom';
import { LabelValueTable } from '../../../components/LabelValueTable';
import { DataGrid } from '@mui/x-data-grid';
import { taskflow } from '../_config/taskflow.config';
import Plot from 'react-plotly.js';

/**
 * Placeholder columns for related data table
 */
const relatedColumns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 50,
  },
  {
    field: 'attr1',
    headerName: 'Attribute 1',
    width: 100,
  },
  {
    field: 'attr2',
    headerName: 'Attribute 2',
    width: 100,
  },
  {
    field: 'attr3',
    headerName: 'Attribute 3',
    width: 100,
  },
];

/**
 * Placeholder rows for related data table
 */
const emptyRows = Array(25).fill(0);
const relatedRows = emptyRows.map((d, i) => {
  return { id: i, attr1: 'value', attr2: 'value', attr3: 'value' };
});

interface PreviewPanelProps {
  /**
   * Data for the selected row from the main table
   */
  previewItem: any;
  /**
   * Function to handle hiding
   */
  onClose: () => void;
}

/**
 * Panel to show extra information about a row in a separate panel
 * next to the `<DataTablePanel>`.
 */
export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  previewItem,
  onClose,
}) => {
  const columns = taskflow.pages.index.tableColumns;
  const dataIdField = taskflow.data.list.idField;
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Generate some sample data for visualization based on the preview item
  const generateVisualizationData = () => {
    // For time series data (if available)
    if (previewItem['Orbital Period Days'] && previewItem['Mass']) {
      return {
        timeSeriesData: {
          x: Array.from({ length: 20 }, (_, i) => i * (previewItem['Orbital Period Days'] / 20)),
          y: Array.from({ length: 20 }, (_, i) => Math.sin(i * 0.5) * previewItem['Mass'] / 10 + previewItem['Mass']),
        },
        scatterData: {
          x: [previewItem['Orbital Period Days'] || 0, previewItem['Eccentricity'] * 100 || 0],
          y: [previewItem['Mass'] || 0, previewItem['Mass'] * 0.8 || 0],
          text: ['Current', 'Projected'],
        }
      };
    }
    
    // Default data if specific fields aren't available
    return {
      timeSeriesData: {
        x: Array.from({ length: 20 }, (_, i) => i),
        y: Array.from({ length: 20 }, () => Math.random() * 10),
      },
      scatterData: {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        text: ['A', 'B', 'C', 'D'],
      }
    };
  };

  const visualizationData = generateVisualizationData();

  /**
   * Content to render on the page for this component
   */
  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        padding: 2,
      }}
    >
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Stack direction="row">
            <Typography variant="h6" component="h3" flex={1}>
              <Link
                component={RouterLink}
                to={`${previewItem[dataIdField]}`}
                underline="hover"
              >
                {previewItem[columns[0].field]}
              </Link>
            </Typography>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <Typography variant="body2">
            Detailed information and visualizations for {previewItem[columns[0].field]}.
          </Typography>
        </Stack>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="preview tabs">
            <Tab label="Overview" />
            <Tab label="Visualizations" />
            <Tab label="Related Data" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        {tabValue === 0 && (
          <Stack spacing={3}>
            <Box>
              <Typography fontWeight="medium" mb={1}>
                Basic Properties
              </Typography>
              <LabelValueTable
                rows={Object.entries(previewItem)
                  .filter(([key]) => !key.includes('Id') && key !== 'id')
                  .slice(0, 5)
                  .map(([key, value]) => ({ 
                    label: key, 
                    value: value !== null && value !== undefined ? value.toString() : 'N/A' 
                  }))}
              />
            </Box>
            <Box>
              <Typography fontWeight="medium" mb={1}>
                Additional Properties
              </Typography>
              <LabelValueTable
                rows={Object.entries(previewItem)
                  .filter(([key]) => !key.includes('Id') && key !== 'id')
                  .slice(5, 10)
                  .map(([key, value]) => ({ 
                    label: key, 
                    value: value !== null && value !== undefined ? value.toString() : 'N/A' 
                  }))}
              />
            </Box>
          </Stack>
        )}

        {/* Visualizations Tab */}
        {tabValue === 1 && (
          <Stack spacing={3}>
            <Box>
              <Typography fontWeight="medium" mb={1}>
                Time Series Data
              </Typography>
              <Box sx={{ height: '300px', width: '100%' }}>
                <Plot
                  data={[
                    {
                      x: visualizationData.timeSeriesData.x,
                      y: visualizationData.timeSeriesData.y,
                      type: 'scatter',
                      mode: 'lines+markers',
                      marker: { color: 'blue' },
                      name: 'Time Series',
                    },
                  ]}
                  layout={{
                    title: `${previewItem[columns[0].field]} - Time Series`,
                    xaxis: { title: 'Time (days)' },
                    yaxis: { title: 'Value' },
                    autosize: true,
                    margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
                  }}
                  style={{ width: '100%', height: '100%' }}
                  useResizeHandler={true}
                />
              </Box>
            </Box>
            <Box>
              <Typography fontWeight="medium" mb={1}>
                Comparative Analysis
              </Typography>
              <Box sx={{ height: '300px', width: '100%' }}>
                <Plot
                  data={[
                    {
                      x: visualizationData.scatterData.x,
                      y: visualizationData.scatterData.y,
                      type: 'scatter',
                      mode: 'markers',
                      marker: { 
                        color: ['red', 'blue'],
                        size: 12 
                      },
                      text: visualizationData.scatterData.text,
                      name: 'Comparison',
                    },
                  ]}
                  layout={{
                    title: `${previewItem[columns[0].field]} - Comparison`,
                    xaxis: { title: 'Parameter 1' },
                    yaxis: { title: 'Parameter 2' },
                    autosize: true,
                    margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
                  }}
                  style={{ width: '100%', height: '100%' }}
                  useResizeHandler={true}
                />
              </Box>
            </Box>
          </Stack>
        )}

        {/* Related Data Tab */}
        {tabValue === 2 && (
          <Box>
            <Typography fontWeight="medium" mb={1}>
              Related Data
            </Typography>
            <DataGrid
              rows={relatedRows}
              columns={relatedColumns}
              disableRowSelectionOnClick
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              autoHeight
            />
          </Box>
        )}

        <Stack direction="row" spacing={2}>
          <Link component={RouterLink} to={`${previewItem[dataIdField]}`}>
            <Button variant="contained">View details</Button>
          </Link>
          <Button variant="outlined">Export data</Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
