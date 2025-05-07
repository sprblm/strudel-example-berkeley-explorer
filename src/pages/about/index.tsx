import React from 'react';
import { Box, Container, Typography, Paper, Grid, Stack, Divider } from '@mui/material';
import { PageHeader } from '../../components/PageHeader';

const AboutPage: React.FC = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <PageHeader 
          pageTitle="Berkeley Environmental Health Explorer"
          description="A collaborative platform for Berkeley students to explore and contribute to air quality data"
        />
        
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  The Berkeley Environmental Health Explorer (BCCAC) is a web application designed primarily for
                  Berkeley students. It enables them to discover, explore, compare, and contribute data related to tree inventory
                  and air quality specifically on and around the Berkeley campus.
                </Typography>
                
                <Typography paragraph sx={{ mt: 2 }}>
                  Built with STRUDEL Kit, it integrates key task flows into a coherent educational experience, turning the campus into
                  a living laboratory for environmental studies and citizen science.
                </Typography>
                
                <Box sx={{ mt: 4, mb: 3 }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Educational Focus
                  </Typography>
                  <Typography paragraph>
                    This application is designed to support course learning objectives in:
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Stack spacing={1}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box component="span" sx={{ color: 'success.main', mr: 1 }}>✓</Box>
                          Environmental Science
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box component="span" sx={{ color: 'success.main', mr: 1 }}>✓</Box>
                          Data Science
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box component="span" sx={{ color: 'success.main', mr: 1 }}>✓</Box>
                          Public Health
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={1}>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box component="span" sx={{ color: 'success.main', mr: 1 }}>✓</Box>
                          Urban Forestry
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box component="span" sx={{ color: 'success.main', mr: 1 }}>✓</Box>
                          Public Health
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
                
                <Divider sx={{ my: 4 }} />
                
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  STRUDEL Task Flows
                </Typography>
                <Typography paragraph>
                  How scientific task flows are implemented in this application
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box component="span" sx={{ mr: 1, color: 'info.main' }}>🔍</Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Search Repositories</Typography>
                      </Box>
                      <Typography variant="body2">
                        Find scientific sites, buildings, or data points on the campus map. Filter repositories relevant to course topics.
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box component="span" sx={{ mr: 1, color: 'info.main' }}>🌐</Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Explore Data</Typography>
                      </Box>
                      <Typography variant="body2">
                        Visualize information through health, size, and nearby air quality data using interactive campus maps and basic charts.
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box component="span" sx={{ mr: 1, color: 'info.main' }}>📊</Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Compare Data</Typography>
                      </Box>
                      <Typography variant="body2">
                        Analyze differences in environmental conditions between various campus locations or time periods.
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box component="span" sx={{ mr: 1, color: 'info.main' }}>🔄</Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Contribute Data</Typography>
                      </Box>
                      <Typography variant="body2">
                        Allow students to easily add observations like tree measurements or local air quality readings during fieldwork assignments.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Why a Campus-Focused Environmental Hub?
                  </Typography>
                  
                  <Stack spacing={2} sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ color: 'primary.main', mr: 1 }}>1</Box>
                      It provides a tangible, relatable scale for student learning and data collection.
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ color: 'primary.main', mr: 1 }}>2</Box>
                      It naturally combines complementary datasets (trees, air quality) in a single setting.
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ color: 'primary.main', mr: 1 }}>3</Box>
                      It enables meaningful citizen science participation as part of coursework.
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ color: 'primary.main', mr: 1 }}>4</Box>
                      It develops local relevance and allows students to see the immediate impact of environmental factors.
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box component="span" sx={{ color: 'primary.main', mr: 1 }}>5</Box>
                      It requires diverse visualization capabilities suitable for teaching data analysis.
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  STRUDEL Kit
                </Typography>
                <Typography paragraph variant="body2" color="text.secondary">
                  Scientific Task Research for User experience, Design, and Learning
                </Typography>
                
                <Typography paragraph variant="body2">
                  STRUDEL provides a framework ideal for developing student applications, including educational tools. It consists of:
                </Typography>
                
                <Stack spacing={2} sx={{ mt: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Planning Framework</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Helps structure scientific project goals
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Design Patterns</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reusable components and patterns based on Task Flows
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Task Flows</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Predefined interaction patterns for scientific applications
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
              
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  How to Participate
                </Typography>
                
                <Typography paragraph variant="body2">
                  Students can contribute to the campus data repository by submitting their measurements of air quality readings during fieldwork or course activities.
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Classroom Integration</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Instructors can incorporate the platform into course assignments, allowing students to collect data, analyze patterns, and contribute to the environmental database for campus.
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Research Projects</Typography>
                  <Typography variant="body2" color="text.secondary">
                    The platform can support undergraduate research projects related to urban ecology, air quality monitoring, and environmental health on campus.
                  </Typography>
                </Box>
              </Paper>
              
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Technical Implementation
                </Typography>
                
                <Stack spacing={2} sx={{ mt: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Frontend Framework</Typography>
                    <Typography variant="body2" color="text.secondary">
                      React, TypeScript, and Tailwind CSS
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Visualization</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Interactive maps and data visualizations powered by Recharts
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Data Management</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Structured data models for trees, air quality readings, and campus locations
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Mobile Responsiveness</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Designed for field use on mobile devices for data collection
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
              
              <Paper sx={{ p: 3, mt: 4 }}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Contact Information
                </Typography>
                
                <Typography paragraph variant="body2">
                  For more information about this project:
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2"><strong>Email:</strong> bccac@berkeley.edu</Typography>
                  <Typography variant="body2"><strong>Department:</strong> Environmental Science</Typography>
                  <Typography variant="body2"><strong>Location:</strong> VLSB 3101, UC Berkeley</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;
