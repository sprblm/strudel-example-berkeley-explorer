import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import {
  Box,
  Button,
  Pagination,
  Paper,
  Stack,
  Typography,
  ListItemText,
} from '@mui/material';
import React, { useEffect, useState, useMemo } from 'react';
import { DataListCard } from './DataListCard';
import { getListConfig, getCardFields } from '../_config/taskflow.config';
import { useListQuery } from '../../../utils/useListQuery';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ErrorAlert } from '../../../components/ErrorAlert';

interface DataListPanelProps {
  onToggleFiltersPanel: () => void;
  previewItem: Record<string, unknown> | null;
  setPreviewItem: React.Dispatch<React.SetStateAction<Record<string, unknown> | null>>;
  listConfig?: ReturnType<typeof getListConfig>;
  cardFields?: ReturnType<typeof getCardFields>;
}

/**
 * Show a list of filterable `<DataListCard>` components based on the data source.
 * Cards are filterable by the inputs in `<FiltersPanel>` and clicking a card will
 * display the `<PreviewPanel>`.
 */
export const DataListPanel = ({
  onToggleFiltersPanel,
  previewItem,
  setPreviewItem,
  listConfig = getListConfig(),
  cardFields = getCardFields(),
}: DataListPanelProps) => {
  const { idField, title, content } = cardFields;
  const { source: dataSource } = listConfig;
  const [cards, setCards] = useState<Record<string, unknown>[]>([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');

  const { data: response, isPending, isError, error } = useListQuery(dataSource);
  const data = response?.data || [];

  useEffect(() => {
    if (data.length > 0) {
      setCards(data);
    }
  }, [data]);

  const renderCards = useMemo(() => {
    if (isPending) {
      return <LoadingSpinner />;
    }
    if (isError) {
      return <ErrorAlert message={error?.message ?? 'Error fetching data'} />;
    }
    return cards.map((card, index) => {
      const cardId = String(card[idField as keyof typeof card] || index);
      const cardTitle = card[title as keyof typeof card] as string;
      const cardContent = card[content as keyof typeof card] as string;
      
      return (
        <DataListCard key={cardId} item={card} previewItem={previewItem} setPreviewItem={setPreviewItem}>
          <ListItemText
            primary={<Typography>{cardTitle}</Typography>}
            secondary={<Typography>{cardContent}</Typography>}
          />
        </DataListCard>
      );
    });
  }, [cards, isPending, isError, error, idField, title, content, previewItem, setPreviewItem]);

  // Content to render on the page for this component
  return (
    <Paper elevation={0}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 2,
          }}
        >
          <Button
            startIcon={<FilterAltIcon />}
            onClick={onToggleFiltersPanel}
          >
            Filters
          </Button>
          <Button
            startIcon={<SortIcon />}
            onClick={() => setSortBy(sortBy === 'name' ? 'date' : 'name')}
          >
            Sort by {sortBy === 'name' ? 'Date' : 'Name'}
          </Button>
        </Box>
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            padding: 2,
          }}
        >
          {renderCards}
          {cards && cards.length === 0 && (
            <Stack flex={1}>
              <Typography>No data matches your search</Typography>
            </Stack>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: 2,
          }}
        >
          <Pagination
            count={Math.ceil((response?.total || 0) / 10)}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </Box>
      </Box>
    </Paper>
  );
};
