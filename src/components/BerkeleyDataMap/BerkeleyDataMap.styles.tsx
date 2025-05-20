import { SxProps, Theme } from '@mui/material';

export const mapContainerStyles: SxProps<Theme> = {
  position: 'relative',
  width: '100%',
  height: 400,
};

export const mapPlaceholderStyles: React.CSSProperties = {
  width: '100%',
  height: '100%',
  minHeight: 300,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f5f5f5',
};

export const loadingStyles: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 2,
};
