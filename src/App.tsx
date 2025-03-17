import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { theme } from './theme';
import { AppProvider } from './context/ContextProvider';
import { ApiModal } from './components/ApiModal';
import { config } from '../strudel.config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import all page components
import Index from './pages/index';
import CompareData from './pages/compare-data';
import CompareDataCompare from './pages/compare-data/compare';
import CompareDataNew from './pages/compare-data/new';
import ExploreData from './pages/explore-data';
import ExploreDataId from './pages/explore-data/[id]';
import MonitorActivities from './pages/monitor-activities';
import MonitorActivitiesCalendar from './pages/monitor-activities/calendar';
import MonitorActivitiesDetail from './pages/monitor-activities/detail';
import Playground from './pages/playground';
import RunComputation from './pages/run-computation';
import RunComputationIdDataInputs from './pages/run-computation/[id]/data-inputs';
import RunComputationIdResults from './pages/run-computation/[id]/results';
import RunComputationIdRunning from './pages/run-computation/[id]/running';
import RunComputationIdSettings from './pages/run-computation/[id]/settings';
import SearchRepositories from './pages/search-repositories';
import SearchRepositoriesId from './pages/search-repositories/[id]';

const queryClient = new QueryClient();

// Create router with all routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/compare-data',
    element: <CompareData />,
  },
  {
    path: '/compare-data/compare',
    element: <CompareDataCompare />,
  },
  {
    path: '/compare-data/new',
    element: <CompareDataNew />,
  },
  {
    path: '/explore-data',
    element: <ExploreData />,
  },
  {
    path: '/explore-data/:id',
    element: <ExploreDataId />,
  },
  {
    path: '/monitor-activities',
    element: <MonitorActivities />,
  },
  {
    path: '/monitor-activities/calendar',
    element: <MonitorActivitiesCalendar />,
  },
  {
    path: '/monitor-activities/detail',
    element: <MonitorActivitiesDetail />,
  },
  {
    path: '/playground',
    element: <Playground />,
  },
  {
    path: '/run-computation',
    element: <RunComputation />,
  },
  {
    path: '/run-computation/:id/data-inputs',
    element: <RunComputationIdDataInputs />,
  },
  {
    path: '/run-computation/:id/results',
    element: <RunComputationIdResults />,
  },
  {
    path: '/run-computation/:id/running',
    element: <RunComputationIdRunning />,
  },
  {
    path: '/run-computation/:id/settings',
    element: <RunComputationIdSettings />,
  },
  {
    path: '/search-repositories',
    element: <SearchRepositories />,
  },
  {
    path: '/search-repositories/:id',
    element: <SearchRepositoriesId />,
  },
]);

const App: React.FC = () => {
  /**
   * Set the html title for the app using the title in the config.
   */
  useEffect(() => {
    document.title = config.title;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppProvider>
            <RouterProvider router={router} />
            <ApiModal />
          </AppProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

export default App;
