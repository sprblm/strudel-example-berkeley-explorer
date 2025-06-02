/**
 * CompareDataWrapper component for the Compare Data section.
 * Serves as the layout wrapper for all comparison pages, providing shared context and navigation.
 * Loads scenario data and makes it available through context to all child components.
 */
import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '../../components/TopBar';
import { useDataFromSource } from '../../utils/useDataFromSource';
import { CompareDataProvider } from './_context/ContextProvider';
import { taskflow } from './_config/taskflow.config';
const CompareDataWrapper: React.FC = () => {
  const scenarios = useDataFromSource(taskflow.data.items.source);

  /**
   * Content to render on the page for this component
   */
  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <TopBar />
      </Box>
      <Box>
        <CompareDataProvider
          data={scenarios || []}
          columns={taskflow.pages.index.tableColumns}
          dataIdField="id"
        >
          <Outlet />
        </CompareDataProvider>
      </Box>
    </Box>
  );
};

export default CompareDataWrapper;
