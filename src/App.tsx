import React from 'react';
import { Box, CssBaseline, Typography, Button, Paper } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import ErrorBoundary from './components/ErrorBoundary';
import { TopBar } from './components/TopBar';
import SearchRepositories from './pages/search-repositories';
import DataExplorer from './pages/explore-data';
import { HomePage } from './pages/home/index';
import { AboutPage } from './pages/about/index';

/**
 * Main App component that sets up routing and global layout
 */
const App = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <TopBar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search-repositories/*" element={<SearchRepositories />} />
            <Route path="/explore-data/*" element={<DataExplorer />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </ErrorBoundary>
      </Box>

      <Paper 
        component="footer" 
        square 
        variant="outlined" 
        sx={{ 
          mt: 'auto',
          py: 2,
          px: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Climate Data Analysis Platform {new Date().getFullYear()}
        </Typography>
        <Button 
          variant="text" 
          size="small" 
          color="inherit"
          href="https://github.com/superbloom/climate-study"
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<GitHubIcon />}
        >
          View on GitHub
        </Button>
      </Paper>
    </Box>
  );
};

export default App;
