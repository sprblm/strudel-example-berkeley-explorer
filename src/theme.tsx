import { createTheme } from '@mui/material';
import type {} from '@mui/x-data-grid/themeAugmentation';

/**
 * MUI Theme object with glass neumorphic iridescent styling
 * Featuring subtle gradients, glass effects, and soft shadows
 */
export const theme = createTheme({
  // Color palette with iridescent tones
  palette: {
    mode: 'light',
    background: {
      default: 'rgba(240, 245, 255, 0.8)', // Subtle blue-tinted background
      paper: 'rgba(255, 255, 255, 0.6)', // Translucent white for glass effect
    },
    primary: {
      main: '#0b4fc5', // Iridescent blue
      light: '#5b8af9',
      dark: '#003892',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#112bd6', // Iridescent purple
      light: '#6a5af9',
      dark: '#0a1c9e',
      contrastText: '#ffffff',
    },
    info: {
      main: '#49caff', // Bright cyan for accents
      light: '#83e0ff',
      dark: '#0097cc',
      contrastText: '#ffffff',
    },
    success: {
      main: '#57c893', // Soft green
      light: '#8df8bf',
      dark: '#2a9568',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ffb64d', // Soft amber
      light: '#ffda82',
      dark: '#cf8600',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff6b8e', // Soft pink-red
      light: '#ff9fb7',
      dark: '#c93762',
      contrastText: '#ffffff',
    },
    neutral: {
      main: '#d0d8e8',
      light: '#e8eef7',
      dark: '#a3b0c9',
    },
    common: {
      black: '#2d3748',
      white: '#ffffff',
    },
    grey: {
      50: '#f7faff',
      500: '#a4b0c3',
      900: '#4a5568',
    },
  },
  // Rounded corners for neumorphic style
  shape: {
    borderRadius: 16, // More pronounced rounded corners
  },
  // Modern, clean typography
  typography: {
    htmlFontSize: 16,
    fontFamily: `'Public Sans', sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600, // Slightly less bold for softer appearance
  },
  // Component customizations for neumorphic glass style
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage:
            'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0))',
          boxShadow:
            'rgba(255, 255, 255, 0.5) -5px -5px 10px, rgba(0, 0, 0, 0.1) 5px 5px 15px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          '&:hover': {
            backgroundImage:
              'linear-gradient(135deg, rgba(218,220,227,0.1), rgba(82,176,214,0.1))',
          },
        },
        elevation1: {
          boxShadow:
            'rgba(255, 255, 255, 0.5) -3px -3px 6px, rgba(0, 0, 0, 0.1) 3px 3px 8px',
        },
        elevation2: {
          boxShadow:
            'rgba(255, 255, 255, 0.5) -5px -5px 10px, rgba(0, 0, 0, 0.1) 5px 5px 15px',
        },
        elevation3: {
          boxShadow:
            'rgba(255, 255, 255, 0.5) -7px -7px 14px, rgba(0, 0, 0, 0.1) 7px 7px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.6)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.8)',
          borderTop: '1px solid rgba(255, 255, 255, 0.8)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow:
              'rgba(255, 255, 255, 0.6) -8px -8px 16px, rgba(0, 0, 0, 0.15) 8px 8px 20px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          boxShadow:
            'rgba(255, 255, 255, 0.4) -2px -2px 5px, rgba(0, 0, 0, 0.1) 2px 2px 5px',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundImage:
              'linear-gradient(135deg, rgba(218,220,227,0.1), rgba(82,176,214,0.1))',
            boxShadow:
              'rgba(255, 255, 255, 0.4) -1px -1px 3px, rgba(0, 0, 0, 0.1) 1px 1px 3px',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            boxShadow:
              'inset rgba(0, 0, 0, 0.1) 2px 2px 5px, inset rgba(255, 255, 255, 0.4) -2px -2px 5px',
            transform: 'translateY(0)',
          },
        },
        contained: {
          backgroundColor: '#5b8af9',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#3d5fc6',
          },
        },
        outlined: {
          borderWidth: '1px',
          borderColor: 'rgba(255, 255, 255, 0.5)',
        },
      },
      variants: [
        {
          props: { color: 'neutral' },
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderColor: 'rgba(255, 255, 255, 0.6)',
            color: '#5a6a8a',
          },
        },
      ],
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            width: '0%',
            height: '2px',
            bottom: '-2px',
            left: '0',
            background:
              'linear-gradient(90deg, rgba(91,138,249,0.8), rgba(156,105,226,0.8))',
            transition: 'width 0.3s ease',
          },
          '&:hover:after': {
            width: '100%',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.7)',
          boxShadow: 'rgba(0, 0, 0, 0.05) 0 1px 5px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.8)',
        },
      },
    },
    MuiStack: {
      defaultProps: {
        spacing: 2,
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 0,
          background: 'rgba(255, 255, 255, 0.4)',
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-overlayWrapper': {
            minHeight: '4rem',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: '#4a5568',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage:
            'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0))',
          boxShadow:
            'rgba(255, 255, 255, 0.5) -5px -5px 10px, rgba(0, 0, 0, 0.1) 5px 5px 15px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          color: 'inherit',
          fontFamily: 'inherit',
          fontSize: 'inherit',
        },
      },
    },
  },
});
