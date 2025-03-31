import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  TextField, 
  Checkbox, 
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip
} from '@mui/material';
import { UploadIcon, InfoIcon } from '../../components/Icons';

/**
 * Contribute Data page
 * Allows users to share climate datasets with the scientific community
 */
const ContributePage: React.FC = () => {
  // State for file upload
  const [files, setFiles] = useState<File[]>([]);
  
  // State for form fields
  const [datasetName, setDatasetName] = useState('');
  const [description, setDescription] = useState('');
  const [dataSource, setDataSource] = useState('');
  const [dataFormat, setDataFormat] = useState('CSV');
  
  // State for checkboxes
  const [standardFormat, setStandardFormat] = useState(false);
  const [includeMetadata, setIncludeMetadata] = useState(false);
  const [removeSensitive, setRemoveSensitive] = useState(false);

  // User contributions (mock data)
  const userContributions = [
    {
      id: 1,
      name: 'Global Temperature Records 2020-2024',
      description: 'High-resolution temperature measurements from weather stations worldwide',
      date: '03/26/2025',
      size: '18.1 MB',
      format: 'CSV',
      status: 'Published'
    },
    {
      id: 2,
      name: 'Arctic Sea Ice Extent Data',
      description: 'Monthly sea ice extent measurements from satellite observations',
      date: '03/8/2025',
      size: '10.5 MB',
      format: 'NetCDF',
      status: 'Processing'
    }
  ];

  // Handler for file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  // Handler for file dragover
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handler for file input change
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  // Handler for submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic would go here
    console.log({ datasetName, description, dataSource, dataFormat, files });
  };

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'success';
      case 'Processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Box sx={{ p: 3, flex: 1 }}>
        {/* Updated Header with Monitor-style formatting */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <UploadIcon size={24} color="#3B82F6" />
          <Box>
            <Typography variant="h4" fontWeight={600} sx={{ mb: 0.5 }}>
              Contribute Data
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Share climate datasets with the scientific community and contribute to climate research.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left column with upload and form */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                border: '1px solid',
                borderColor: 'grey.200',
                mb: 3
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upload Dataset
              </Typography>
              
              {/* File upload area */}
              <Box 
                sx={{ 
                  border: '1px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  mb: 2,
                  minHeight: '150px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <UploadIcon size={32} color="#9E9E9E" />
                <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
                  Drag and drop your dataset files here, or click to select files
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supported formats: CSV, NetCDF, HDF5 (Max 100MB)
                </Typography>
                
                <Box sx={{ mt: 1 }}>
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileSelect}
                    sx={{ display: 'none' }}
                    aria-label="Upload dataset files"
                    title="Upload dataset files"
                  />
                  <label htmlFor="file-upload" sx={{ display: 'block' }}>
                    <Button
                      variant="text"
                      component="span"
                    >
                      Select Files
                    </Button>
                  </label>
                </Box>
              </Box>
              
              {/* Pre-upload checks */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Before You Upload
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={standardFormat}
                      onChange={(e) => setStandardFormat(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Ensure your data follows the standard format specifications"
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={includeMetadata}
                      onChange={(e) => setIncludeMetadata(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Include necessary metadata in your files"
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={removeSensitive}
                      onChange={(e) => setRemoveSensitive(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Remove any sensitive or personal information"
                />
              </Box>
            </Paper>
            
            {/* Dataset Metadata Form */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                border: '1px solid',
                borderColor: 'grey.200',
                mb: 3
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Dataset Metadata
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Dataset Name"
                      fullWidth
                      required
                      value={datasetName}
                      onChange={(e) => setDatasetName(e.target.value)}
                      InputProps={{
                        // Add a red asterisk for required field
                        endAdornment: <Box component="span" sx={{ color: 'error.main', ml: 1 }}>*</Box>
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      fullWidth
                      multiline
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Data Source"
                      fullWidth
                      value={dataSource}
                      onChange={(e) => setDataSource(e.target.value)}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="data-format-label">Data Format</InputLabel>
                      <Select
                        labelId="data-format-label"
                        id="data-format"
                        value={dataFormat}
                        label="Data Format"
                        onChange={(e) => setDataFormat(e.target.value)}
                      >
                        <MenuItem value="CSV">CSV</MenuItem>
                        <MenuItem value="NetCDF">NetCDF</MenuItem>
                        <MenuItem value="HDF5">HDF5</MenuItem>
                        <MenuItem value="GeoTIFF">GeoTIFF</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      Submit Metadata
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
            
            {/* User Contributions */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Your Contributions
              </Typography>
              
              {userContributions.map((contribution) => (
                <Box 
                  key={contribution.id}
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    border: '1px solid',
                    borderColor: 'grey.200',
                    borderRadius: 1
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {contribution.name}
                    </Typography>
                    <Chip 
                      label={contribution.status} 
                      size="small" 
                      color={getStatusColor(contribution.status) as any}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {contribution.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {contribution.date}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {contribution.size}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {contribution.format}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
          
          {/* Right column with guidelines */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2, 
                border: '1px solid',
                borderColor: 'grey.200'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contribution Guidelines
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <InfoIcon size={18} color="#1E88E5" />
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Ensure your dataset includes complete metadata and documentation
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <InfoIcon size={18} color="#66BB6A" />
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Data should be in standard formats (CSV, NetCDF, HDF5)
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <InfoIcon size={18} color="#FFA726" />
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Maximum file size: 100MB per dataset
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ContributePage;
