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
  Chip
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
        {/* Main content */}
        <Box maxWidth="1200px" mx="auto">
          {/* Run Computation Section */}
          <Accordion 
            defaultExpanded 
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              '&:before': { display: 'none' } // Remove default divider
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronDown />}
              sx={{ backgroundColor: '#f8fafd' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PlayCircle size={20} />
                <Typography variant="h6" component="h2" fontWeight={600}>
                  Run Computation
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Execute climate data analysis and modeling tasks using our high-performance computing infrastructure.
              </Typography>
            </AccordionDetails>
          </Accordion>

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
                        <MenuItem value="Predictive Modeling">Predictive Modeling</MenuItem>
                        <MenuItem value="Statistical Analysis">Statistical Analysis</MenuItem>
                        <MenuItem value="Climate Simulation">Climate Simulation</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Parameters Section */}
                  <Grid item xs={12}>
                    <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                      Parameters
                    </Typography>

                    {/* Dataset */}
                    <Box sx={{ mb: 2 }}>
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
                            Select a dataset
                          </MenuItem>
                          <MenuItem value="global-temp-2020-2024">Global Temperature Records 2020-2024</MenuItem>
                          <MenuItem value="sea-level-1990-2024">Sea Level Data 1990-2024</MenuItem>
                          <MenuItem value="arctic-ice-2010-2024">Arctic Ice Extent 2010-2024</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    {/* Variables */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                        Variables
                      </Typography>
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={variables.temperature}
                              onChange={handleVariableChange}
                              name="temperature"
                              size="small"
                            />
                          }
                          label="Temperature"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={variables.precipitation}
                              onChange={handleVariableChange}
                              name="precipitation"
                              size="small"
                            />
                          }
                          label="Precipitation"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={variables.humidity}
                              onChange={handleVariableChange}
                              name="humidity"
                              size="small"
                            />
                          }
                          label="Humidity"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={variables.windSpeed}
                              onChange={handleVariableChange}
                              name="windSpeed"
                              size="small"
                            />
                          }
                          label="Wind Speed"
                        />
                      </FormGroup>
                    </Box>

                    {/* Date Range */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                          Start Date
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="date"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          placeholder="mm/dd/yyyy"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                          End Date
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          type="date"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          placeholder="mm/dd/yyyy"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </Grid>
                    </Grid>

                    {/* Analysis Method */}
                    <Box sx={{ mb: 2 }}>
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
                          <MenuItem value="Advanced Regression">Advanced Regression</MenuItem>
                          <MenuItem value="Statistical Modeling">Statistical Modeling</MenuItem>
                          <MenuItem value="Machine Learning">Machine Learning</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    {/* Time Resolution */}
                    <Box sx={{ mb: 3 }}>
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
                    </Box>

                    {/* Submit Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleSubmitJob}
                      sx={{ py: 1 }}
                    >
                      Submit Job
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* System Status */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  mb: 3
                }}
              >
                <Typography variant="h6" component="h2" fontWeight={500} sx={{ mb: 2 }}>
                  System Status
                </Typography>

                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ClockIcon size={16} color="#6B7280" />
                      <Typography variant="body2" color="text.secondary">
                        Queue Time
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={500}>
                      ~6 minutes
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ServerIcon size={16} color="#6B7280" />
                      <Typography variant="body2" color="text.secondary">
                        Available Nodes
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={500}>
                      12/20
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Active Jobs */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h6" component="h2" fontWeight={500} sx={{ mb: 2 }}>
                  Active Jobs
                </Typography>

                <Stack spacing={2.5}>
                  {activeJobs.map((job) => (
                    <Box key={job.id}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="body2" fontWeight={500} color="text.primary">
                          {job.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Started {job.startedTime} ago
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          {getJobStatusComponent(job.status, job.progress)}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Stack>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    variant="text"
                    size="small"
                    endIcon={<ChevronDown size={16} />}
                  >
                    View Results
                  </Button>
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
