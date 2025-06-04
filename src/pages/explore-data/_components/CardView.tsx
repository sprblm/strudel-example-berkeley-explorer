/**
 * CardView component for the Explore Data section.
 * Displays environmental data in a grid of cards with images and metadata.
 * Allows users to browse and select items for detailed preview.
 */
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  Stack,
} from '@mui/material';
import { useFilters } from '@/contexts/FiltersContext';
import { DataCard, FilterConfig } from '@/types/filters.types';
import { useListQuery } from '../../../utils/useListQuery';
import { taskflow } from '../_config/taskflow.config';

interface CardViewProps {
  searchTerm: string;
  setPreviewItem: React.Dispatch<React.SetStateAction<any>>;
}

/**
 * Card-based visualization view for the data
 */
export const CardView: React.FC<CardViewProps> = ({
  searchTerm,
  setPreviewItem,
}) => {
  const { activeFilters } = useFilters();
  const filterConfigs = taskflow.pages.index
    .tableFilters as Partial<FilterConfig>[];

  // Map the filter configs to match the expected FilterConfig type
  const mappedFilterConfigs: FilterConfig[] = React.useMemo(() => {
    if (!filterConfigs) return [];
    return filterConfigs
      .filter((config): config is Partial<FilterConfig> => Boolean(config))
      .map((config) => {
        // Map the filterComponent to a valid value if needed
        let mappedComponent: FilterConfig['filterComponent'] = 'TextInput';
        if (config.filterComponent) {
          if (config.filterComponent === 'CheckboxList') {
            mappedComponent = 'MultiSelect';
          } else if (
            ['TextInput', 'MultiSelect', 'DateRangePicker'].includes(
              config.filterComponent
            )
          ) {
            mappedComponent =
              config.filterComponent as FilterConfig['filterComponent'];
          }
        }

        // Ensure operator is one of the allowed types
        const operator: FilterConfig['operator'] = (
          [
            'contains',
            'contains-one-of',
            'equals',
            'equals-one-of',
            'between',
            'between-dates-inclusive',
          ] as const
        ).includes(config.operator as any)
          ? (config.operator as FilterConfig['operator'])
          : 'contains';

        return {
          field: config.field || '',
          label: config.label || '',
          operator,
          filterComponent: mappedComponent,
          ...(config.paramType && { paramType: config.paramType }),
          ...(config.paramTypeOptions && {
            paramTypeOptions: config.paramTypeOptions,
          }),
          ...(config.transformValue && {
            transformValue: config.transformValue,
          }),
        };
      });
  }, [filterConfigs]);

  const { isPending, isError, data, error } = useListQuery({
    activeFilters,
    dataSource: taskflow.data.list.source,
    filterConfigs: mappedFilterConfigs || [],
    queryMode: taskflow.data.list.queryMode,
    staticParams: taskflow.data.list.staticParams,
  });

  if (isPending) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading data...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error loading data: {error.message}
        </Typography>
      </Box>
    );
  }

  // Filter the data based on active filters and search term
  const filteredData = Array.isArray(data)
    ? filterData(data, activeFilters, filterConfigs, searchTerm)
    : [];

  // Get the columns for display
  const columns = taskflow.pages.index.tableColumns || [];
  const titleField = columns[0]?.field || 'id';
  const subtitleField = columns[1]?.field || null;

  // Get fields for tags
  const tagFields = columns
    .filter(
      (col: any) =>
        col.type !== 'number' &&
        col.field !== titleField &&
        col.field !== subtitleField
    )
    .map((col: any) => col.field)
    .slice(0, 2); // Limit to 2 tag fields

  // Get numeric fields for details
  const numericFields = columns
    .filter((col: any) => col.type === 'number')
    .map((col: any) => ({
      field: col.field,
      label: col.headerName || col.field,
      units: col.units || '',
    }));

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {filteredData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 3,
                },
              }}
            >
              <CardActionArea onClick={() => setPreviewItem(item)}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    backgroundColor: `hsl(${(index * 40) % 360}, 70%, 80%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5" color="text.secondary">
                    {item[titleField]?.toString().charAt(0) || 'D'}
                  </Typography>
                </CardMedia>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {item[titleField]}
                  </Typography>
                  {subtitleField && (
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {String(item[subtitleField] || '')}
                    </Typography>
                  )}
                  {tagFields.length > 0 && (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 1, mb: 1, flexWrap: 'wrap', gap: 0.5 }}
                    >
                      {tagFields.map((field, idx) => {
                        const value = item[field];
                        return value != null && value !== '' ? (
                          <Chip
                            key={`${field}-${idx}`}
                            label={String(value)}
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ) : null;
                      })}
                    </Stack>
                  )}
                  {numericFields.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {numericFields.slice(0, 3).map((field, idx) => {
                        const value = item[field.field];
                        return value != null ? (
                          <Box
                            key={`${field.field}-${idx}`}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {field.label}:
                            </Typography>
                            <Typography variant="body2">
                              {Number(value).toLocaleString()} {field.units}
                            </Typography>
                          </Box>
                        ) : null;
                      })}
                    </Box>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
