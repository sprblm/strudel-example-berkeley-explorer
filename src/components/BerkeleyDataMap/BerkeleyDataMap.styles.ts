import { SxProps, Theme } from '@mui/material/styles';

export const mapContainerSx: SxProps<Theme> = {
  position: 'relative',
  width: '100%',
  height: '100%',
  minHeight: '400px',
};

export const mapPlaceholderSx: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
};

export const loadingContainerSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
};

export const loadingTextSx: SxProps<Theme> = {
  marginTop: '1rem',
  color: 'text.secondary',
};

// Keep the old exports for backward compatibility
export const mapContainerStyles = mapContainerSx;
export const mapPlaceholderStyles = mapPlaceholderSx;
export const loadingStyles = loadingContainerSx;
