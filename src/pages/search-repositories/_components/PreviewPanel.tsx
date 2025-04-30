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
import { LabelValueTable } from '../../../components/LabelValueTable';
import { DataGrid } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { taskflow } from '../_config/taskflow.config';

// Add type definitions for urban tree inventory and air quality datasets
interface Dataset {
  type: 'urban-tree-inventory' | 'air-quality';
  species?: string;
  location?: string;
  parameter?: string;
  value?: number;
  // Add other relevant fields
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
  const cardFields = taskflow.pages.index.cardFields;

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
                {previewItem[cardFields.title]}
              </Link>
            </Typography>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
          
          {/* Source and Quality */}
          <Stack direction="row" spacing={2} alignItems="center">
            {previewItem[cardFields.source] && (
              <Chip 
                label={previewItem[cardFields.source]} 
                color="primary" 
                variant="outlined" 
                size="small"
              />
            )}
            
            {previewItem[cardFields.quality] && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">Quality:</Typography>
                <Rating 
                  value={previewItem[cardFields.quality]} 
                  readOnly 
                  size="small"
                  precision={0.5}
                />
              </Stack>
            )}
          </Stack>
        </Stack>

        {/* Dataset Thumbnail/Map */}
        {previewItem[cardFields.thumbnail] && (
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
              src={previewItem[cardFields.thumbnail]} 
              alt={previewItem[cardFields.title]} 
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        )}
        
        {/* Summary */}
        {previewItem[cardFields.content] && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Summary
            </Typography>
            <Typography>{previewItem[cardFields.content]}</Typography>
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
            {previewItem[cardFields.temporal_coverage] && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Time Period
                </Typography>
                <Typography>
                  {previewItem[cardFields.temporal_coverage]}
                </Typography>
              </Grid>
            )}
            
            {/* Spatial Coverage */}
            {previewItem[cardFields.spatial_coverage] && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Geographic Region
                </Typography>
                <Typography>
                  {previewItem[cardFields.spatial_coverage]}
                </Typography>
              </Grid>
            )}
            
            {/* Resolution */}
            {previewItem[cardFields.resolution] && (
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Resolution
                </Typography>
                <Typography>
                  {previewItem[cardFields.resolution]}
                </Typography>
              </Grid>
            )}
            
            {/* Variables */}
            {previewItem[cardFields.variables] && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Climate Variables
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Array.isArray(previewItem[cardFields.variables]) ? 
                    previewItem[cardFields.variables].map((variable: string, index: number) => (
                      <Chip key={index} label={variable} size="small" />
                    )) : 
                    <Typography>{previewItem[cardFields.variables]}</Typography>
                  }
                </Box>
              </Grid>
            )}
            
            {/* Citation */}
            {previewItem[cardFields.citation] && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Citation
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {previewItem[cardFields.citation]}
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
            
            {previewItem[cardFields.download_url] && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<DownloadIcon />}
                href={previewItem[cardFields.download_url]}
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
