import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, CardActionArea, Chip, Stack } from '@mui/material';
import { useFilters } from '../../../components/FilterContext';
import { filterData } from '../../../utils/filters.utils';
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
  const filterConfigs = taskflow.pages.index.tableFilters;
  
  const { isPending, isError, data, error } = useListQuery({
    activeFilters,
    dataSource: taskflow.data.list.source,
    filterConfigs,
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
        <Typography color="error">Error loading data: {error.message}</Typography>
      </Box>
    );
  }

  // Filter the data based on active filters and search term
  const filteredData = filterData(data, activeFilters, filterConfigs, searchTerm);
  
  // Get the columns for display
  const columns = taskflow.pages.index.tableColumns;
  const titleField = columns[0].field;
  const subtitleField = columns.length > 1 ? columns[1].field : null;
  
  // Get fields for tags
  const tagFields = columns
    .filter((col: any) => col.type !== 'number' && col.field !== titleField && col.field !== subtitleField)
    .map((col: any) => col.field)
    .slice(0, 2); // Limit to 2 tag fields

  // Get numeric fields for details
  const numericFields = columns
    .filter((col: any) => col.type === 'number')
    .map((col: any) => ({
      field: col.field,
      label: col.headerName,
      units: col.units
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
                  boxShadow: 3
                }
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
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h5" color="text.secondary">
                    {item[titleField]?.toString().charAt(0) || 'D'}
                  </Typography>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {String(item[titleField] || '')}
                  </Typography>
                  
                  {subtitleField && (
                    <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
                      {String(item[subtitleField] || '')}
                    </Typography>
                  )}
                  
                  {numericFields.length > 0 && (
                    <Box sx={{ my: 1 }}>
                      {numericFields.slice(0, 3).map((field, idx) => (
                        <Typography key={idx} variant="body2" component="div">
                          <strong>{field.label}:</strong> {item[field.field] !== undefined ? String(item[field.field]) : 'N/A'}
                          {field.units ? ` ${field.units}` : ''}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  
                  {tagFields.length > 0 && (
                    <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                      {tagFields.map((field, idx) => (
                        item[field] && (
                          <Chip 
                            key={idx} 
                            label={String(item[field])} 
                            size="small" 
                            variant="outlined" 
                            sx={{ mb: 1 }}
                          />
                        )
                      ))}
                    </Stack>
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
