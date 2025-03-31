import React from 'react';
import { Box, Typography, Paper, Grid, LinearProgress, Divider, Chip, Stack } from '@mui/material';
import { 
  ActivityIcon, 
  AlertCircleIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  RefreshCwIcon, 
  AlertTriangleIcon
} from '../../components/Icons';

/**
 * System Monitor page
 * Displays system performance, service status, and active computations
 */
const MonitorPage: React.FC = () => {
  // Mock data - would be replaced with actual API calls in production
  const systemMetrics = {
    cpu: {
      usage: 45,
      label: 'CPU Usage'
    },
    memory: {
      usage: 62,
      label: 'Memory Usage'
    },
    storage: {
      usage: 78,
      label: 'Storage Usage'
    },
    activeJobs: {
      count: 8,
      queued: 3
    }
  };

  const serviceStatus = [
    {
      name: 'Compute Engine',
      status: 'operational',
      uptime: '99.98%'
    },
    {
      name: 'Data Storage',
      status: 'operational',
      uptime: '99.99%'
    },
    {
      name: 'API Gateway',
      status: 'degraded',
      uptime: '98.45%',
      incident: '3/30/2025'
    }
  ];

  const systemAlerts = [
    {
      type: 'warning',
      message: 'High CPU usage detected on compute node 3',
      timestamp: '3/30/2025, 10:44:33 PM'
    },
    {
      type: 'info',
      message: 'Scheduled maintenance in 24 hours',
      timestamp: '3/30/2025, 10:29:33 PM'
    }
  ];

  // Helper function to render the correct status icon
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircleIcon size={18} color="#10B981" />;
      case 'degraded':
        return <AlertTriangleIcon size={18} color="#F59E0B" />;
      case 'down':
        return <AlertCircleIcon size={18} color="#EF4444" />;
      default:
        return <ActivityIcon size={18} />;
    }
  };

  // Helper function to render the correct alert icon
  const renderAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangleIcon size={18} color="#F59E0B" />;
      case 'error':
        return <AlertCircleIcon size={18} color="#EF4444" />;
      case 'info':
        return <RefreshCwIcon size={18} color="#3B82F6" />;
      default:
        return <ActivityIcon size={18} />;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <ActivityIcon size={24} color="#3B82F6" />
        <Box>
          <Typography variant="h4" fontWeight={600} sx={{ mb: 0.5 }}>
            System Monitor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor system performance, service status, and active computations.
          </Typography>
        </Box>
      </Box>

      {/* System Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* CPU Usage */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              height: '100%',
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {systemMetrics.cpu.label}
              </Typography>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                <ActivityIcon size={16} />
              </Box>
            </Box>
            <Typography variant="h3" fontWeight={600} sx={{ mb: 1 }}>
              {systemMetrics.cpu.usage}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={systemMetrics.cpu.usage} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: systemMetrics.cpu.usage > 80 ? '#EF4444' : 
                                  systemMetrics.cpu.usage > 60 ? '#F59E0B' : '#3B82F6'
                }
              }}
            />
          </Paper>
        </Grid>

        {/* Memory Usage */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              height: '100%',
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {systemMetrics.memory.label}
              </Typography>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                <ActivityIcon size={16} />
              </Box>
            </Box>
            <Typography variant="h3" fontWeight={600} sx={{ mb: 1 }}>
              {systemMetrics.memory.usage}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={systemMetrics.memory.usage} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: systemMetrics.memory.usage > 80 ? '#EF4444' : 
                                  systemMetrics.memory.usage > 60 ? '#F59E0B' : '#3B82F6'
                }
              }}
            />
          </Paper>
        </Grid>

        {/* Storage Usage */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              height: '100%',
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {systemMetrics.storage.label}
              </Typography>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                <ActivityIcon size={16} />
              </Box>
            </Box>
            <Typography variant="h3" fontWeight={600} sx={{ mb: 1 }}>
              {systemMetrics.storage.usage}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={systemMetrics.storage.usage}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: systemMetrics.storage.usage > 80 ? '#EF4444' : 
                                  systemMetrics.storage.usage > 60 ? '#F59E0B' : '#3B82F6'
                }
              }}
            />
          </Paper>
        </Grid>

        {/* Active Jobs */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              height: '100%',
              border: '1px solid',
              borderColor: 'grey.200',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Active Jobs
              </Typography>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                <ClockIcon size={16} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
              <Typography variant="h3" fontWeight={600}>
                {systemMetrics.activeJobs.count}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({systemMetrics.activeJobs.queued} queued)
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Service Status */}
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 4,
          border: '1px solid',
          borderColor: 'grey.200',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Service Status
          </Typography>
        </Box>

        <Divider />
        
        {serviceStatus.map((service, index) => (
          <React.Fragment key={service.name}>
            <Box 
              sx={{ 
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {renderStatusIcon(service.status)}
                <Typography sx={{ ml: 1.5 }}>
                  {service.name}
                </Typography>
                <Chip 
                  label={service.status === 'operational' ? 'Operational' : 
                         service.status === 'degraded' ? 'Degraded' : 'Down'}
                  size="small"
                  sx={{ 
                    ml: 2,
                    backgroundColor: service.status === 'operational' ? 'rgba(16, 185, 129, 0.1)' :
                                    service.status === 'degraded' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: service.status === 'operational' ? '#10B981' :
                          service.status === 'degraded' ? '#F59E0B' : '#EF4444',
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {service.uptime} uptime
                </Typography>
                {service.incident && (
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    Last incident: {service.incident}
                  </Typography>
                )}
              </Box>
            </Box>
            {index < serviceStatus.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Paper>

      {/* System Alerts */}
      <Paper 
        elevation={0} 
        sx={{ 
          border: '1px solid',
          borderColor: 'grey.200',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            System Alerts
          </Typography>
        </Box>

        <Divider />
        
        {systemAlerts.length > 0 ? (
          systemAlerts.map((alert, index) => (
            <React.Fragment key={index}>
              <Box sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box sx={{ pt: 0.25 }}>
                    {renderAlertIcon(alert.type)}
                  </Box>
                  <Box>
                    <Typography variant="body1">
                      {alert.message}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {alert.timestamp}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              {index < systemAlerts.length - 1 && <Divider />}
            </React.Fragment>
          ))
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No alerts at this time
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MonitorPage;
