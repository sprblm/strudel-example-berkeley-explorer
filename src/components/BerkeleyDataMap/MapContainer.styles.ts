import { SxProps, Theme } from '@mui/material/styles';

// Styles for the MapContainer component
export const mapContainerStyle: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  position: 'relative' as const,
};

export const mapCanvasStyle: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  borderRadius: 1,
};

export const loadingOverlayStyle: SxProps<Theme> = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  zIndex: 10,
};

export const cursorPointerStyle = {
  cursor: 'pointer',
};

export const cursorDefaultStyle = {
  cursor: 'default',
};

export const mapContainerDivStyle = (
  height: string | number,
  width: string | number
) => ({
  height: typeof height === 'number' ? `${height}px` : height,
  width: typeof width === 'number' ? `${width}px` : width,
  position: 'relative' as const,
  borderRadius: '4px',
});
