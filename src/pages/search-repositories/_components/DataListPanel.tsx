import { Box, Pagination, Stack, Typography } from '@mui/material';
import DataListCard  from './DataListCard';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { DataListPanelProps } from '../_config/taskflow.types';

/**
 * Show a list of filterable `<DataListCard>` components based on the data source.
 * Cards are filterable by the inputs in `<FiltersPanel>` and clicking a card will
 * display the `<PreviewPanel>`.
 */

const DataListPanel = ({ searchResults, previewItem, setPreviewItem }: DataListPanelProps) => {
  if (searchResults.length === 0) {
    return <LoadingSpinner />;
  }
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">Datasets</Typography>
        <Pagination
          count={Math.ceil((searchResults.length || 0) / 10)}
          page={1}
          onChange={(_, _value) => {}}
        />
      </Stack>
      <Box sx={{ mt: 2 }}>
        {searchResults.map((dataset) => (
          <DataListCard
            key={dataset.id}
            dataset={dataset}
            onClick={() => setPreviewItem(dataset)}
            isSelected={previewItem?.id === dataset.id}
          />
        ))}
      </Box>
    </Box>
  );
};

export default DataListPanel;
