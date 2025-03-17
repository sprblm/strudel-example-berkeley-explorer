import { Box, Chip, Link, Stack, Tooltip, Typography, Rating } from '@mui/material';
import { blue } from '@mui/material/colors';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { taskflow } from '../_config/taskflow.config';

interface DataListCardProps {
  item: any;
  previewItem: any;
  setPreviewItem: React.Dispatch<React.SetStateAction<any>>;
}

/**
 * Card to show in the main list of the `<DatasetExplorer>`.
 * The fields that are displayed in the cards are originally
 * configured in `defintions.cards.main`.
 */
export const DataListCard: React.FC<DataListCardProps> = ({
  item,
  previewItem,
  setPreviewItem,
}) => {
  const cardFields = taskflow.pages.index.cardFields;
  const handleItemClick = () => {
    setPreviewItem(item);
  };

  // Content to render on the page for this component
  return (
    <Stack
      className={previewItem?.id === item.id ? 'selected' : ''}
      direction="row"
      onClick={() => handleItemClick()}
      sx={{
        padding: 2,
        marginBottom: 1,
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        transition: '0.25s',
        '&:hover': {
          bgcolor: 'neutral.light',
          boxShadow: 1,
        },
        '&.selected': {
          bgcolor: blue[50],
          borderColor: blue[300],
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'neutral.dark',
          height: 100,
          width: 100,
          borderRadius: 1,
          overflow: 'hidden',
          marginRight: 2,
        }}
      >
        {item[cardFields.thumbnail] ? (
          <Box
            component="img"
            src={item[cardFields.thumbnail]} 
            alt={item[cardFields.title]} 
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Typography fontSize="small">{'<Image>'}</Typography>
        )}
      </Box>
      <Box flex={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            <Link component={RouterLink} to={`./${item.id}`} underline="hover">
              {item[cardFields.title]}
            </Link>
          </Typography>
          
          {item[cardFields.source] && (
            <Chip 
              label={item[cardFields.source]} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          )}
          
          {item[cardFields.quality] && (
            <Tooltip title="Dataset Quality Rating">
              <Box>
                <Rating 
                  name="quality-rating" 
                  value={item[cardFields.quality]} 
                  readOnly 
                  size="small" 
                  precision={0.5}
                />
              </Box>
            </Tooltip>
          )}
        </Stack>
        
        {cardFields.content && (
          <Typography
            sx={{
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: '2',
              display: '-webkit-box',
              overflow: 'hidden',
              my: 1,
            }}
          >
            {item[cardFields.content]}
          </Typography>
        )}
        
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          {item[cardFields.temporal_coverage] && (
            <Tooltip title="Time Period">
              <Typography variant="body2" color="text.secondary">
                <strong>Time Period:</strong> {item[cardFields.temporal_coverage]}
              </Typography>
            </Tooltip>
          )}
          
          {item[cardFields.spatial_coverage] && (
            <Tooltip title="Geographic Coverage">
              <Typography variant="body2" color="text.secondary">
                <strong>Region:</strong> {item[cardFields.spatial_coverage]}
              </Typography>
            </Tooltip>
          )}
          
          {item[cardFields.resolution] && (
            <Tooltip title="Dataset Resolution">
              <Typography variant="body2" color="text.secondary">
                <strong>Resolution:</strong> {item[cardFields.resolution]}
              </Typography>
            </Tooltip>
          )}
        </Stack>
        
        {cardFields.tags && item[cardFields.tags] && item[cardFields.tags].length > 0 && (
          <Box sx={{ mt: 1 }}>
            {item[cardFields.tags].map((tag: string, i: number) => (
              <Chip
                key={`${tag}-${i}`}
                label={tag}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
        )}
        
        {item[cardFields.variables] && item[cardFields.variables].length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
              Variables:
            </Typography>
            {item[cardFields.variables].map((variable: string, i: number) => (
              <Chip
                key={`${variable}-${i}`}
                label={variable}
                size="small"
                color="secondary"
                variant="outlined"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Stack>
  );
};
