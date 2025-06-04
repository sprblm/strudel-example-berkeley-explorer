import React, { ReactNode } from 'react';
import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Box,
  Chip,
  Divider,
  Stack,
  IconButton,
} from '@mui/material';
import { InfoIcon, ExternalLinkIcon } from './Icons';

export interface CardProps {
  title?: string;
  subtitle?: string;
  content?: string | ReactNode;
  category?: string;
  date?: string;
  footer?: ReactNode;
  headerAction?: ReactNode;
  onClick?: () => void;
  elevation?: number;
  variant?: 'outlined' | 'elevation';
  sx?: any;
  metadata?: {
    label: string;
    value: string | ReactNode;
    icon?: ReactNode;
  }[];
  tags?: string[];
  actionButtons?: ReactNode;
}

/**
 * Enhanced card component with modern styling
 * Designed for consistent look and feel across the application
 */
export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  content,
  category,
  date,
  footer,
  headerAction,
  onClick,
  elevation = 1,
  variant = 'elevation',
  sx = {},
  metadata = [],
  tags = [],
  actionButtons,
}) => {
  return (
    <MuiCard
      elevation={variant === 'elevation' ? elevation : 0}
      variant={variant}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              boxShadow:
                '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }
          : {},
        ...sx,
      }}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <CardHeader
          title={
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 600, fontSize: '1.125rem' }}
            >
              {title}
            </Typography>
          }
          subheader={
            subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {subtitle}
              </Typography>
            )
          }
          action={headerAction}
          sx={{ pb: 1 }}
        />
      )}

      {(category || date) && (
        <Box
          sx={{
            px: 2,
            pt: 0,
            pb: 1,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {category && (
            <Chip
              label={category}
              size="small"
              sx={{
                backgroundColor: 'primary.50',
                color: 'primary.700',
                fontWeight: 500,
                fontSize: '0.75rem',
              }}
            />
          )}
          {date && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {date}
            </Typography>
          )}
        </Box>
      )}

      <CardContent sx={{ pt: category || date ? 0 : 2 }}>
        {typeof content === 'string' ? (
          <Typography variant="body2" color="text.secondary">
            {content}
          </Typography>
        ) : (
          content
        )}

        {metadata.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={1.5}>
              {metadata.map((item, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  {item.icon}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500, mr: 1 }}
                  >
                    {item.label}:
                  </Typography>
                  <Typography variant="body2">{item.value}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {tags.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  backgroundColor: 'grey.100',
                  color: 'grey.700',
                  fontSize: '0.675rem',
                  height: '20px',
                }}
              />
            ))}
          </Box>
        )}
      </CardContent>

      {(footer || actionButtons) && (
        <CardActions
          sx={{ px: 2, pt: 0, pb: 2, justifyContent: 'space-between' }}
        >
          {footer}
          {actionButtons && (
            <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
              {actionButtons}
            </Box>
          )}
        </CardActions>
      )}
    </MuiCard>
  );
};

/**
 * Simple info card with clean styling
 */
export const InfoCard: React.FC<{
  title: string;
  content: string | ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  sx?: any;
}> = ({ title, content, icon, action, sx = {} }) => {
  return (
    <MuiCard
      variant="outlined"
      sx={{
        borderColor: 'grey.200',
        ...sx,
      }}
    >
      <CardHeader
        avatar={icon || <InfoIcon size={20} color="primary" />}
        title={
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        }
        action={action}
      />
      <CardContent sx={{ pt: 0 }}>
        {typeof content === 'string' ? (
          <Typography variant="body2">{content}</Typography>
        ) : (
          content
        )}
      </CardContent>
    </MuiCard>
  );
};
