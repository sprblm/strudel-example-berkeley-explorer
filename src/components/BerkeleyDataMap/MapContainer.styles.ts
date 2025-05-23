import { SxProps, Theme } from '@mui/material/styles';

export const mapContainerStyle: SxProps<Theme> = {
  width: '100%',
  height: '100%',
  position: 'relative' as const,
  overflow: 'hidden'
};

export const mapElementStyle: SxProps<Theme> = {
  width: '100%',
  height: '100%'
};
