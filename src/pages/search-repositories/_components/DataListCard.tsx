import React from 'react';
import { Box, Card, IconButton, Stack } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import type { CardData } from '../_config/taskflow.types';
import { taskflow } from '../_config/taskflow.config';

interface DataListCardProps {
  item: CardData;
  previewItem: CardData | null;
  setPreviewItem: (item: CardData | null) => void;
  children: React.ReactNode;
}

/**
 * Card component that displays data in the DataListPanel
 * Clicking the card selects it for preview in the PreviewPanel
 */
const cardStyles = {
  marginBottom: taskflow.pages.index.cardSpacing || 2,
  borderColor: taskflow.pages.index.theme?.primaryColor || 'primary.main'
};

export const DataListCard: React.FC<DataListCardProps> = ({
  item,
  previewItem,
  setPreviewItem,
  children
}) => {
  const handleClick = () => {
    setPreviewItem(item);
  };

  // Check if this card is the selected one
  const isSelected = previewItem?.id === item.id;

  return (
    <Card sx={{
      ...cardStyles,
      border: isSelected ? '1px solid' : 'none',
      transition: 'all 0.2s',
      ':hover': { boxShadow: 3 }
    }}>
      <Box onClick={handleClick} sx={{ cursor: 'pointer' }}>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ flex: 1 }}>{children}</Box>
            <IconButton edge="end" aria-label="view details" onClick={handleClick}>
              <KeyboardArrowRightIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Card>
  );
};
