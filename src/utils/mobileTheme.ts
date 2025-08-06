import { createTheme } from '@mui/material/styles';

// Mobile-first responsive theme
export const mobileTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    // Mobile-optimized typography
    h1: {
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      '@media (max-width:600px)': {
        fontSize: '1.125rem',
      },
    },
    h6: {
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    body1: {
      '@media (max-width:600px)': {
        fontSize: '0.875rem',
      },
    },
    body2: {
      '@media (max-width:600px)': {
        fontSize: '0.75rem',
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    // Mobile-optimized component defaults
    MuiButton: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            minHeight: '44px', // Minimum touch target size
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '12px', // Larger touch target
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            '& .MuiInputBase-root': {
              fontSize: '16px', // Prevents zoom on iOS
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          '@media (max-width:600px)': {
            margin: '8px',
            width: 'calc(100% - 16px)',
            maxWidth: 'none',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '8px 4px',
            fontSize: '0.75rem',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            height: '28px',
            fontSize: '0.75rem',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            paddingLeft: '8px',
            paddingRight: '8px',
          },
        },
      },
    },
    // Drawer optimizations
    MuiDrawer: {
      styleOverrides: {
        paper: {
          '@media (max-width:600px)': {
            width: '280px',
          },
        },
      },
    },
    // Form control optimizations
    MuiFormControl: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            marginBottom: '12px',
          },
        },
      },
    },
  },
});

export default mobileTheme;
