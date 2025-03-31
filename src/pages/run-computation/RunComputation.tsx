import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  LinearProgress,
  Chip,
  Container
} from '@mui/material';
import { ChevronDown, PlayCircle, ClockIcon, Server as ServerIcon } from '../../components/Icons';

/**
 * Run Computation page
 * Allows users to configure and execute climate data analysis jobs
 */
const RunComputationPage: React.FC = () => {
  // State for form fields
  const [jobName, setJobName] = useState('Temperature Trend Analysis 2024');
  const [computationType, setComputationType] = useState('Data Analysis');
  const [dataset, setDataset] = useState('');
  const [analysisMethod, setAnalysisMethod] = useState('Standard Analysis');
  const [timeResolution, setTimeResolution] = useState('Daily');
  
  // State for date ranges
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // State for selected variables
  const [variables, setVariables] = useState({
    temperature: true,
    precipitation: false,
    humidity: false,
    windSpeed: false,
  });

  // Handle variable checkbox changes
  const handleVariableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVariables({
      ...variables,
      [event.target.name]: event.target.checked,
    });
  };

  // Active jobs (mock data)
  const activeJobs = [
    {
      id: 1,
      name: 'Temperature Analysis',
      status: 'Running',
      progress: 48,
      startedTime: '30m ago',
    },
    {
      id: 2,
      name: 'Precipitation Forecast',
      status: 'Queued',
      progress: 0,
      startedTime: '2m ago',
    },
    {
      id: 3,
      name: 'Climate Model Validation',
      status: 'Completed',
      progress: 100,
      startedTime: '2h ago',
    },
  ];

  // Handle job submission
  const handleSubmitJob = () => {
    console.log({
      jobName,
      computationType,
      dataset,
      variables,
      startDate,
      endDate,
      analysisMethod,
      timeResolution,
    });
  };

  // Get job status color and component
  const getJobStatusComponent = (status: string, progress: number) => {
    switch (status) {
      case 'Running':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flex: 1, mr: 1 }}>
              <LinearProgress variant="determinate" value={progress} color="primary" />
            </Box>
            <Typography variant="caption" sx={{ minWidth: 35 }}>
              {progress}%
            </Typography>
            <Chip label={status} size="small" color="primary" />
          </Box>
        );
      case 'Queued':
        return <Chip label={status} size="small" color="warning" />;
      case 'Completed':
        return <Chip label={status} size="small" color="success" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <Box sx={{ p: 3, flex: 1 }}>
        {/* Updated Header with Monitor-style formatting */}
        <Box maxWidth="1200px" mx="auto" mb={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <PlayCircle size={24} color="#3B82F6" />
            <Box>
              <Typography variant="h4" fontWeight={600} sx={{ mb: 0.5 }}>
                Run Computation
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Execute climate data analysis and modeling tasks using our high-performance computing infrastructure.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main content */}
        <Box maxWidth="1200px" mx="auto">
          {/* Job Configuration and System Status */}
          <Grid container spacing={3}>
            {/* Job Configuration */}
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2" fontWeight={500}>
                    Job Configuration
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* Job Name */}
                  <Grid item xs={12}>
                    <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                      Job Name
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="e.g. Temperature Trend Analysis 2024"
                      size="small"
                      value={jobName}
                      onChange={(e) => setJobName(e.target.value)}
                    />
                  </Grid>

                  {/* Computation Type */}
                  <Grid item xs={12}>
                    <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                      Computation Type
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={computationType}
                        onChange={(e) => setComputationType(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Computation Type' }}
                      >
                        <MenuItem value="Data Analysis">Data Analysis</MenuItem>
                        <MenuItem value="Model Training">Model Training</MenuItem>
                        <MenuItem value="Data Visualization">Data Visualization</MenuItem>
                        <MenuItem value="Statistical Testing">Statistical Testing</MenuItem>
                        <MenuItem value="Prediction">Climate Prediction</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Dataset Selection */}
                  <Grid item xs={12}>
                    <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                      Dataset
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={dataset}
                        onChange={(e) => setDataset(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Dataset' }}
                      >
                        <MenuItem value="" disabled>
                          <em>Select a dataset</em>
                        </MenuItem>
                        <MenuItem value="noaa-ghcn">NOAA Global Historical Climatology Network</MenuItem>
                        <MenuItem value="nasa-gistemp">NASA GISTEMP Surface Temperature Analysis</MenuItem>
                        <MenuItem value="hadcrut5">HadCRUT5 Global Temperature</MenuItem>
                        <MenuItem value="era5">ERA5 Reanalysis</MenuItem>
                        <MenuItem value="cmip6">CMIP6 Multi-Model Ensemble</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Variables */}
                  <Grid item xs={12}>
                    <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                      Variables to Include
                    </Typography>
                    <FormGroup>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={variables.temperature}
                                onChange={handleVariableChange}
                                name="temperature"
                              />
                            }
                            label="Temperature"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={variables.precipitation}
                                onChange={handleVariableChange}
                                name="precipitation"
                              />
                            }
                            label="Precipitation"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={variables.humidity}
                                onChange={handleVariableChange}
                                name="humidity"
                              />
                            }
                            label="Humidity"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                checked={variables.windSpeed}
                                onChange={handleVariableChange}
                                name="windSpeed"
                              />
                            }
                            label="Wind Speed"
                          />
                        </Grid>
                      </Grid>
                    </FormGroup>
                  </Grid>

                  {/* Time Range */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                      Start Date
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                      End Date
                    </Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Grid>

                  {/* Analysis Method */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                      Analysis Method
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={analysisMethod}
                        onChange={(e) => setAnalysisMethod(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Analysis Method' }}
                      >
                        <MenuItem value="Standard Analysis">Standard Analysis</MenuItem>
                        <MenuItem value="Advanced Statistics">Advanced Statistics</MenuItem>
                        <MenuItem value="Machine Learning">Machine Learning</MenuItem>
                        <MenuItem value="Neural Networks">Neural Networks</MenuItem>
                        <MenuItem value="Ensemble Methods">Ensemble Methods</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Time Resolution */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                      Time Resolution
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={timeResolution}
                        onChange={(e) => setTimeResolution(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Time Resolution' }}
                      >
                        <MenuItem value="Hourly">Hourly</MenuItem>
                        <MenuItem value="Daily">Daily</MenuItem>
                        <MenuItem value="Weekly">Weekly</MenuItem>
                        <MenuItem value="Monthly">Monthly</MenuItem>
                        <MenuItem value="Yearly">Yearly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitJob}
                        startIcon={<PlayCircle size={18} />}
                      >
                        Run Computation
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Active Jobs and System Status */}
            <Grid item xs={12} md={4}>
              {/* Active Jobs */}
              <Paper
                elevation={0}
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ClockIcon size={18} sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" component="h2" fontWeight={500}>
                    Active Jobs
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  {activeJobs.map((job) => (
                    <Box
                      key={job.id}
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'background.default',
                        border: '1px solid',
                        borderColor: 'grey.200',
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                        {job.name}
                      </Typography>
                      <Box sx={{ mb: 1 }}>
                        {getJobStatusComponent(job.status, job.progress)}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Started {job.startedTime}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>

              {/* System Status */}
              <Paper
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ServerIcon size={18} sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" component="h2" fontWeight={500}>
                    System Status
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">CPU Usage</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      64%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={64}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">Memory Usage</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      42%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={42}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">Available Nodes</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      8/12
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(8 / 12) * 100}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default RunComputationPage;
