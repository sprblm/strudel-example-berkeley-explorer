// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Box, Container, CssBaseline, AppBar, Toolbar, Typography, Button, Link, Paper, Stack } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import SearchRepositories from './pages/search-repositories';
import DataExplorer from './pages/explore-data';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import InfoIcon from '@mui/icons-material/Info';
import GitHubIcon from '@mui/icons-material/GitHub';

/**
 * Main App component that sets up routing and global layout
 */
function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header/Navigation */}
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Climate Data Analysis Platform
            </Typography>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/"
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/search-repositories"
              startIcon={<SearchIcon />}
            >
              Search Data
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/explore-data"
              startIcon={<ExploreIcon />}
            >
              Explore Data
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/about"
              startIcon={<InfoIcon />}
            >
              About
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search-repositories/*" element={<SearchRepositories />} />
            <Route path="/explore-data/*" element={<DataExplorer />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Box>

        {/* Footer */}
        <Paper 
          component="footer" 
          square 
          variant="outlined" 
          sx={{ 
            mt: 'auto',
            py: 2,
            px: 2,
          }}
        >
          <Container maxWidth="lg">
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Typography variant="body2" color="text.secondary">
                {new Date().getFullYear()} Climate Data Analysis Platform
              </Typography>
              <Stack direction="row" spacing={3}>
                <Link 
                  href="https://strudel.science" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  color="inherit"
                  underline="hover"
                >
                  Built with Strudel Kit
                </Link>
                <Link 
                  href="https://github.com/oilsinwater/climate-study" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  color="inherit"
                  underline="hover"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <GitHubIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                  GitHub
                </Link>
              </Stack>
            </Stack>
          </Container>
        </Paper>
      </Box>
    </Router>
  );
}

/**
 * Home page component
 */
const HomePage = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={4}>
          <Box textAlign="center">
            <Typography variant="h3" component="h1" gutterBottom>
              Climate Data Analysis Platform
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Discover, explore, and analyze climate data from multiple sources
            </Typography>
          </Box>

          <Stack 
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            justifyContent="center"
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                flex: 1,
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <SearchIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Search Data Repositories
              </Typography>
              <Typography paragraph>
                Find climate datasets from NOAA, NASA, WorldClim, and other sources.
              </Typography>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/search-repositories"
                startIcon={<SearchIcon />}
              >
                Search Data
              </Button>
            </Paper>

            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                flex: 1,
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <ExploreIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Explore & Visualize
              </Typography>
              <Typography paragraph>
                Analyze climate data with interactive charts, maps, and visualizations.
              </Typography>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/explore-data"
                startIcon={<ExploreIcon />}
              >
                Explore Data
              </Button>
            </Paper>
          </Stack>

          <Paper sx={{ p: 3, mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              About This Platform
            </Typography>
            <Typography paragraph>
              The Climate Data Analysis Platform is a case study example application built with the Strudel Kit, 
              demonstrating how scientific data can be searched, explored, and visualized in a user-friendly interface.
            </Typography>
            <Typography paragraph>
              This platform provides access to climate data from various sources, including NOAA, NASA, WorldClim, CMIP6, 
              and ERA5, allowing researchers and climate scientists to easily find and analyze relevant datasets.
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

/**
 * About page component
 */
const AboutPage = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            About the Climate Data Analysis Platform
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Project Overview
          </Typography>
          <Typography paragraph>
            The Climate Data Analysis Platform is a case study example application built with the Strudel Kit, 
            demonstrating how scientific data can be searched, explored, and visualized in a user-friendly interface.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Data Sources
          </Typography>
          <Typography paragraph>
            This platform provides access to climate data from various sources:
          </Typography>
          <ul>
            <li>
              <Typography>
                <strong>WorldClim</strong> - Global climate data for current conditions, future projections, and past climate
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>NOAA</strong> - National Oceanic and Atmospheric Administration climate datasets
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>NASA</strong> - Earth observation and climate data from NASA
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>CMIP6</strong> - Coupled Model Intercomparison Project Phase 6 climate model outputs
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>ERA5</strong> - ECMWF Reanalysis v5 climate data
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>User-contributed</strong> - Community-contributed climate datasets
              </Typography>
            </li>
          </ul>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Features
          </Typography>
          <Typography paragraph>
            The platform includes the following key features:
          </Typography>
          <ul>
            <li>
              <Typography>
                <strong>Search Data Repositories</strong> - Find climate datasets from multiple sources with filtering options
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>Explore Data</strong> - Visualize and analyze climate data through interactive tables, charts, and maps
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>Multiple Visualization Options</strong> - View data as tables, cards, charts, or geographic maps
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>Detailed Data Preview</strong> - Examine individual datasets with interactive visualizations
              </Typography>
            </li>
          </ul>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Technology
          </Typography>
          <Typography paragraph>
            This application is built using:
          </Typography>
          <ul>
            <li>
              <Typography>
                <strong>Strudel Kit</strong> - A framework for building scientific web applications
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>React</strong> - For building the user interface
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>Material UI</strong> - For component styling and layout
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>Plotly.js</strong> - For interactive data visualizations
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>TypeScript</strong> - For type-safe code
              </Typography>
            </li>
          </ul>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Contact
          </Typography>
          <Typography paragraph>
            For more information about this project, please visit the <Link href="https://github.com/oilsinwater/climate-study" target="_blank" rel="noopener noreferrer">GitHub repository</Link>.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default App;
