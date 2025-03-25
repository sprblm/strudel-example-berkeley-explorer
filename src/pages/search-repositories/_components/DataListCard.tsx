import React from 'react';
import { Box, Card, IconButton, Stack } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface DataListCardProps {
  item: any;
  previewItem: any;
  setPreviewItem: React.Dispatch<React.SetStateAction<any>>;
  children: React.ReactNode;
}

/**
 * Card component that displays data in the DataListPanel
 * Clicking the card selects it for preview in the PreviewPanel
 */
export const DataListCard: React.FC<DataListCardProps> = ({
  item,
  previewItem,
  setPreviewItem,
  children,
}) => {
  const handleClick = () => {
    setPreviewItem(item);
  };

  // Check if this card is the selected one
  const isSelected = previewItem && previewItem.id === item.id;

  return (
    <Card
      sx={{
        marginBottom: 2,
        border: isSelected ? '1px solid' : 'none',
        borderColor: 'primary.main',
        transition: 'all 0.2s',
        ':hover': {
          boxShadow: 3,
        },
      }}
    >
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
