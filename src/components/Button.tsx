import React, { ReactNode } from 'react';
import { 
  Button as MuiButton, 
  ButtonProps as MuiButtonProps,
  IconButton as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
  Tooltip
} from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'startIcon' | 'endIcon'> {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  tooltip?: string;
}

/**
 * Enhanced Button component with modern styling and improved hover effects
 */
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  startIcon, 
  endIcon,
  tooltip,
  ...props 
}) => {
  const button = (
    <MuiButton
      {...props}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '0.875rem',
        transition: 'all 0.2s ease-in-out',
        boxShadow: props.variant === 'contained' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: props.variant === 'contained' 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
            : 'none',
        },
        ...props.sx
      }}
    >
      {children}
    </MuiButton>
  );

  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }

  return button;
};

export interface IconButtonProps extends MuiIconButtonProps {
  tooltip?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Enhanced IconButton component with tooltip support
 */
export const IconButton: React.FC<IconButtonProps> = ({ 
  children, 
  tooltip,
  size = 'medium',
  ...props 
}) => {
  const iconSizes = {
    small: 28,
    medium: 36,
    large: 44
  };

  const button = (
    <MuiIconButton
      {...props}
      sx={{
        width: iconSizes[size],
        height: iconSizes[size],
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
        color: props.color === 'primary' ? 'primary.main' : 'grey.700',
        '&:hover': {
          backgroundColor: props.color === 'primary' 
            ? 'rgba(59, 130, 246, 0.08)'
            : 'grey.100',
        },
        ...props.sx
      }}
    >
      {children}
    </MuiIconButton>
  );

  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>;
  }

  return button;
};
