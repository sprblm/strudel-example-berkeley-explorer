/**
 * BerkeleyDataMap Styles
 *
 * Contains all Material-UI style definitions for the BerkeleyDataMap component and its subcomponents.
 * Exports styled-system configurations for consistent theming and responsive design
 * across all map interface components, including MapContainer.
 */

import { SxProps, Theme } from '@mui/material/styles';

// BerkeleyDataMap component styles
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

// MapContainer component styles (migrated from MapContainer.styles.ts)
export const mapContainerStyle: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  position: 'relative' as const,
  overflow: 'hidden',
};

export const mapElementStyle: SxProps<Theme> = {
  width: '100%',
  height: '100%',
};

export const loadingTextSx: SxProps<Theme> = {
  marginTop: '1rem',
  color: 'text.secondary',
};

// Keep the old exports for backward compatibility
export const mapContainerStyles = mapContainerSx;
export const mapPlaceholderStyles = mapPlaceholderSx;
export const loadingStyles = loadingContainerSx;
