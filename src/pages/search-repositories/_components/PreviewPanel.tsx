/**
 * PreviewPanel component for the Search Repositories section.
 * Displays detailed information about a selected dataset including metadata, quality ratings, and download options.
 * Provides a comprehensive view of dataset attributes and allows users to explore or download the data.
 */
import React from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Link,
  Paper,
  Rating,
  Stack,
  Typography,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import { Link as RouterLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { taskflow } from '../_config/taskflow.config';

export interface Dataset {
  id: string;
  title: string;
  summary: string;
  source: string;
  publication_date: string;
  details?: {
    type: string;
    count: number;
    format: string;
    fields: string[];
  };
}

/**
 * Placeholder columns for attached files table
 */
const attachedFilesColumns: GridColDef[] = [
  {
    field: 'file_name',
    headerName: 'File Name',
    flex: 1,
  },
  {
    field: 'file_type',
    headerName: 'Type',
    width: 120,
  },
  {
    field: 'file_size',
    headerName: 'Size',
    type: 'number',
    width: 100,
  },
];

/**
 * Placeholder rows for attached files table
 */
const attachedFiles = [
  {
    file_name: 'temperature_data_2020.nc',
    file_type: 'NetCDF',
    file_size: '15 MB',
  },
  {
    file_name: 'precipitation_daily.csv',
    file_type: 'CSV',
    file_size: '117 MB',
  },
  {
    file_name: 'dataset_metadata.json',
    file_type: 'JSON',
    file_size: '4 MB',
  },
  {
    file_name: 'region_boundaries.geojson',
    file_type: 'GeoJSON',
    file_size: '8 MB',
  },
];

interface PreviewPanelProps {
  /**
   * Data for the selected card from the main list
   */
  previewItem: any;
  /**
   * Function to handle hiding
   */
  onClose: () => void;
}

/**
 * Panel to show detailed information about a climate dataset
 * next to the `<DataListPanel>`.
 */
export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  previewItem,
  onClose,
}) => {
  // Get the cardFields from taskflow config
  const taskflowCardFields = taskflow.pages.index.cardFields;
  
  // Create a safer way to access dataset properties
  const getDatasetProperty = <T extends unknown>(item: any, key: string, defaultValue: T = '' as unknown as T): T => {
    if (!item || typeof key !== 'string') return defaultValue;
    return (item[key] as T) || defaultValue;
  };
  
  // Create a mapping object for field names
  const fieldMapping = {
    title: taskflowCardFields.titleField || 'title',
    source: 'source',
    quality: 'quality',
    thumbnail: 'thumbnail',
    content: taskflowCardFields.contentField || 'summary',
    temporal_coverage: 'temporal_coverage',
    spatial_coverage: 'spatial_coverage',
    resolution: 'resolution',
    variables: 'variables',
    citation: 'citation',
    download_url: 'download_url'
  };

  // Content to render on the page for this component
  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        padding: 2,
        overflowY: 'auto',
      }}
    >
      <Stack spacing={3}>
        {/* Header Section */}
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center">
            <Typography variant="h6" component="h3" flex={1}>
              <Link
                component={RouterLink}
                to={`./${previewItem.id}`}
                underline="hover"
              >
                {getDatasetProperty<string>(previewItem, fieldMapping.title)}
              </Link>
            </Typography>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          
          {/* Source and Quality */}
          <Stack direction="row" spacing={2} alignItems="center">
            {getDatasetProperty<string>(previewItem, fieldMapping.source) && (
              <Chip 
                label={getDatasetProperty<string>(previewItem, fieldMapping.source)} 
                color="primary" 
                variant="outlined" 
                size="small"
              />
            )}
            
            {getDatasetProperty<string>(previewItem, fieldMapping.quality) && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">Quality:</Typography>
                <Rating 
                  value={parseInt(getDatasetProperty<string>(previewItem, fieldMapping.quality, '0'))} 
                  readOnly 
                  size="small"
                  precision={0.5}
                />
              </Stack>
            )}
          </Stack>
        </Stack>

        {/* Dataset Thumbnail/Map */}
        {getDatasetProperty<string>(previewItem, fieldMapping.thumbnail) && (
          <Box
            sx={{
              height: '200px',
              width: '100%',
              overflow: 'hidden',
              backgroundColor: 'neutral.light'
            }}
          >
            <Box
              component="img"
              src={getDatasetProperty<string>(previewItem, fieldMapping.thumbnail)} 
              alt={getDatasetProperty<string>(previewItem, fieldMapping.title)} 
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        )}
        
        {/* Summary */}
        {getDatasetProperty<string>(previewItem, fieldMapping.content) && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography>{getDatasetProperty<string>(previewItem, fieldMapping.content)}</Typography>
          </Box>
        )}
        
        <Divider />
        
        {/* Dataset Details */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Dataset Details
          </Typography>
          
          <Grid container spacing={2}>
            {/* Temporal Coverage */}
            {getDatasetProperty<string>(previewItem, fieldMapping.temporal_coverage) && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Time Period
                </Typography>
                <Typography>
                  {getDatasetProperty<string>(previewItem, fieldMapping.temporal_coverage)}
                </Typography>
              </Grid>
            )}
            
            {/* Spatial Coverage */}
            {getDatasetProperty<string>(previewItem, fieldMapping.spatial_coverage) && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Geographic Region
                </Typography>
                <Typography>
                  {getDatasetProperty<string>(previewItem, fieldMapping.spatial_coverage)}
                </Typography>
              </Grid>
            )}
            
            {/* Resolution */}
            {getDatasetProperty<string>(previewItem, fieldMapping.resolution) && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Resolution
                </Typography>
                <Typography>
                  {getDatasetProperty<string>(previewItem, fieldMapping.resolution)}
                </Typography>
              </Grid>
            )}
            
            {/* Variables */}
            {getDatasetProperty<string[]>(previewItem, fieldMapping.variables, []) && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Climate Variables
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Array.isArray(getDatasetProperty<string[]>(previewItem, fieldMapping.variables, [])) ? 
                    getDatasetProperty<string[]>(previewItem, fieldMapping.variables, []).map((variable: string, index: number) => (
                      <Chip key={index} label={variable} size="small" />
                    )) : 
                    <Typography>{getDatasetProperty<string>(previewItem, fieldMapping.variables)}</Typography>
                  }
                </Box>
              </Grid>
            )}
            
            {/* Citation */}
            {getDatasetProperty<string>(previewItem, fieldMapping.citation) && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Citation
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {getDatasetProperty<string>(previewItem, fieldMapping.citation)}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
        
        <Divider />
        
        {/* Attached Files */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Attached Files
          </Typography>
          <Box sx={{ height: 250, width: '100%' }}>
            <DataGrid
              rows={attachedFiles}
              columns={attachedFilesColumns}
              hideFooter
              disableRowSelectionOnClick
              getRowId={(row) => row.file_name}
            />
          </Box>
        </Box>
        
        <Divider />
        
        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="outlined"
            startIcon={<BookmarkIcon />}
          >
            Bookmark
          </Button>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<ShareIcon />}
            >
              Share
            </Button>
            
            {getDatasetProperty<string>(previewItem, fieldMapping.download_url) && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                href={getDatasetProperty<string>(previewItem, fieldMapping.download_url)}
                target="_blank"
              >
                Download
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};
