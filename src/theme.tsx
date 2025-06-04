import { createTheme } from '@mui/material';
import type {} from '@mui/x-data-grid/themeAugmentation';

/**
 * MUI Theme object with modern aesthetic inspired by bolt-version-cdac
 * Featuring clean design, subtle shadows, and smooth transitions
 */
export const theme = createTheme({
  // Updated color palette with modern tones
  palette: {
    mode: 'light',
    background: {
      default: '#f9fafb', // Light gray background similar to tailwind bg-gray-50
      paper: '#ffffff', // Clean white for cards and content areas
    },
    primary: {
      main: '#1d4ed8', // Modern blue similar to tailwind blue-700
      light: '#3b82f6', // tailwind blue-500
      dark: '#1e40af', // tailwind blue-800
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4f46e5', // Modern indigo similar to tailwind indigo-600
      light: '#6366f1', // tailwind indigo-500
      dark: '#4338ca', // tailwind indigo-700
      contrastText: '#ffffff',
    },
    info: {
      main: '#0ea5e9', // Bright sky blue similar to tailwind sky-500
      light: '#38bdf8', // tailwind sky-400
      dark: '#0284c7', // tailwind sky-600
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981', // Clean green similar to tailwind emerald-500
      light: '#34d399', // tailwind emerald-400
      dark: '#059669', // tailwind emerald-600
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b', // Warm amber similar to tailwind amber-500
      light: '#fbbf24', // tailwind amber-400
      dark: '#d97706', // tailwind amber-600
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444', // Modern red similar to tailwind red-500
      light: '#f87171', // tailwind red-400
      dark: '#dc2626', // tailwind red-600
      contrastText: '#ffffff',
    },
    neutral: {
      main: '#9ca3af', // tailwind gray-400
      light: '#e5e7eb', // tailwind gray-200
      dark: '#6b7280', // tailwind gray-500
    },
    common: {
      black: '#111827', // tailwind gray-900
      white: '#ffffff',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  // Modern rounded corners
  shape: {
    borderRadius: 12, // Slightly reduced but still modern
  },
  // Clean, modern typography
  typography: {
    htmlFontSize: 16,
    fontFamily: `'Public Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
  // Component customizations for modern style
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
          '&:hover': {
            boxShadow:
              '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
        elevation1: {
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow:
            '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 12,
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow:
              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow:
              '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          },
        },
        contained: {
          backgroundColor: '#3b82f6', // tailwind blue-500
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#2563eb', // tailwind blue-600
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.04)', // Very light blue on hover
          },
        },
      },
      variants: [
        {
          props: { color: 'neutral' },
          style: {
            backgroundColor: '#f3f4f6', // tailwind gray-100
            color: '#4b5563', // tailwind gray-600
            '&:hover': {
              backgroundColor: '#e5e7eb', // tailwind gray-200
            },
          },
        },
      ],
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          color: '#2563eb', // tailwind blue-600
          fontWeight: 500,
          position: 'relative',
          transition: 'color 0.2s ease-in-out',
          '&:hover': {
            color: '#1d4ed8', // tailwind blue-700
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            width: '0%',
            height: '2px',
            bottom: '-2px',
            left: '0',
            backgroundColor: '#2563eb', // tailwind blue-600
            transition: 'width 0.2s ease-in-out',
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
          backgroundColor: '#ffffff',
          boxShadow:
            '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          color: '#111827', // tailwind gray-900
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'box-shadow 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3b82f6', // tailwind blue-500
              },
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)', // Light blue focus ring
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3b82f6', // tailwind blue-500
                borderWidth: '1px',
              },
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: 8,
          '&.Mui-checked': {
            color: '#3b82f6', // tailwind blue-500
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: 8,
          '&.Mui-checked': {
            color: '#3b82f6', // tailwind blue-500
          },
        },
      },
    },
    MuiStack: {
      defaultProps: {
        spacing: 2,
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#3b82f6', // tailwind blue-500
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 48,
          minWidth: 120,
          '&.Mui-selected': {
            color: '#3b82f6', // tailwind blue-500
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          '&.MuiChip-colorPrimary': {
            backgroundColor: '#e0f2fe', // Light blue background
            color: '#0284c7', // tailwind sky-600
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: '#e0e7ff', // Light indigo background
            color: '#4f46e5', // tailwind indigo-600
          },
          '&.MuiChip-colorSuccess': {
            backgroundColor: '#d1fae5', // Light green background
            color: '#059669', // tailwind emerald-600
          },
          '&.MuiChip-colorError': {
            backgroundColor: '#fee2e2', // Light red background
            color: '#dc2626', // tailwind red-600
          },
          '&.MuiChip-colorWarning': {
            backgroundColor: '#fef3c7', // Light amber background
            color: '#d97706', // tailwind amber-600
          },
          '&.MuiChip-colorInfo': {
            backgroundColor: '#e0f2fe', // Light sky background
            color: '#0284c7', // tailwind sky-600
          },
        },
      },
    },
  },
});
