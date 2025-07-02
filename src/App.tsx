/**
 * Main App component for the Berkeley Environmental Health Explorer platform.
 * Sets up the application routing structure and global layout.
 * Provides routes to all major sections: Home, Search Repositories, Explore Data, Compare Data, Contribute, and About.
 * Implements error boundaries for graceful error handling throughout the application.
 */
import { Box, CssBaseline, Typography, Button, Paper } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import ErrorBoundary from './components/ErrorBoundary';
import { TopBar } from './components/TopBar';
import SearchRepositories from './pages/search-repositories';
import ExploreData from './pages/explore-data';
import CompareData from './pages/compare-data';
import ContributePage from './pages/contribute';
import { HomePage } from './pages/home/index';
import AboutPage from './pages/about/index';
const App = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <TopBar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/search-repositories/*"
              element={<SearchRepositories />}
            />
            <Route path="/explore-data/*" element={<ExploreData />} />
            <Route path="/compare-data/*" element={<CompareData />} />
            <Route path="/contribute" element={<ContributePage />} />
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
          textAlign: 'center',
        }}
      >
      
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
