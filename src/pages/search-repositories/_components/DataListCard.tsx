import React from 'react';
import { Box, Card, Stack, Typography, IconButton } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

/**
 * Card component that displays data in the DataListPanel
 * Clicking the card selects it for preview in the PreviewPanel
 */
const cardStyles = {
  marginBottom: 2,
  borderColor: 'primary.main'
};

interface Dataset {
  title: string;
  summary: string;
  attached_files?: { file_id: number; file_name: string; file_size: string; description: string }[];
}

interface DataListCardProps {
  dataset: Dataset;
  onClick: () => void;
  isSelected: boolean;
}

const DataListCard: React.FC<DataListCardProps> = ({
  dataset,
  onClick,
  isSelected
}) => {
  return (
    <Card sx={{
      ...cardStyles,
      border: isSelected ? '1px solid' : 'none',
      transition: 'all 0.2s',
      ':hover': { boxShadow: 3 }
    }}>
      <Box onClick={onClick} sx={{ cursor: 'pointer' }}>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{dataset.title}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {dataset.summary}
              </Typography>
              {dataset.attached_files?.map((file) => (
                <div key={file.file_id}>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {file.file_name}
                  </Typography>
                </div>
              ))}
            </Box>
            <IconButton edge="end" aria-label="view details" onClick={onClick}>
              <KeyboardArrowRightIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Card>
  );
};

export default DataListCard;
