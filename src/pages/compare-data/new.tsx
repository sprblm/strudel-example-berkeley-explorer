/**
 * NewScenario component for the Compare Data section.
 * Provides an interface for users to create new comparison scenarios with custom parameters.
 * Integrates with the comparison context system to add user-defined scenarios to the comparison workflow.
 */
import { Box, Button, Container, Link, Paper, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { useCompareData } from './_context/ContextProvider';
import { setComparing } from './_context/actions';
import { taskflow } from './_config/taskflow.config';
export const NewScenario: React.FC = () => {
  const { dispatch } = useCompareData();

  /**
   * Set comparing to true whenever this page renders.
   * Set it back to false when the component is torn down.
   */
  useEffect(() => {
    dispatch(setComparing(true));
    return () => {
      dispatch(setComparing(false));
    };
  }, []);

  /**
   * Content to render on the page for this component
   */
  return (
    <Box>
      <PageHeader
        pageTitle={taskflow.pages.new.title}
        description={taskflow.pages.new.description}
        actions={
          <Stack direction="row">
            <Box>
              <Link component={RouterLink} to="..">
                <Button
                  variant="contained"
                  color="warning"
                  data-testid="cpd-cancel-button"
                >
                  Cancel
                </Button>
              </Link>
            </Box>
            <Box>
              <Link component={RouterLink} to="..">
                <Button variant="contained" data-testid="cpd-save-button">
                  Save {taskflow.properties.itemName}
                </Button>
              </Link>
            </Box>
          </Stack>
        }
        sx={{
          padding: 3,
          backgroundColor: 'white',
        }}
      />
      <Container
        maxWidth="xl"
        sx={{
          marginTop: 3,
          marginBottom: 3,
        }}
      >
        <Paper
          sx={{
            padding: 2,
          }}
        >
          {/* TODO: add form */}
          Work in progress
        </Paper>
      </Container>
    </Box>
  );
};

export default NewScenario;
