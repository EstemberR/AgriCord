import { createTheme, Theme } from '@mui/material/styles';
import { palette } from './palette';

export const theme = createTheme({
  palette,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.background?.default,
          color: palette.text?.primary
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: palette.primary?.main,
          boxShadow: 'none',
          borderBottom: `1px solid ${palette.divider}`
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: palette.primary?.main,
          borderRight: `1px solid ${palette.divider}`
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px'
        },
        contained: {
          backgroundColor: palette.secondary?.main,
          color: palette.secondary?.contrastText,
          '&:hover': {
            backgroundColor: palette.secondary?.dark
          }
        },
        outlined: {
          borderColor: palette.secondary?.main,
          color: palette.secondary?.main,
          '&:hover': {
            borderColor: palette.secondary?.light,
            backgroundColor: 'rgba(24, 92, 55, 0.08)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: palette.background?.paper,
          borderRadius: '12px',
          border: `1px solid ${palette.divider}`
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: palette.primary?.main,
          '& .MuiTableCell-root': {
            color: palette.primary?.contrastText
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(24, 26, 32, 0.3)'
          },
          '&:hover': {
            backgroundColor: 'rgba(24, 26, 32, 0.5) !important'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px'
        },
        colorPrimary: {
          backgroundColor: palette.primary?.main,
          color: palette.primary?.contrastText
        },
        colorSecondary: {
          backgroundColor: palette.secondary?.main,
          color: palette.secondary?.contrastText
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: palette.divider
            },
            '&:hover fieldset': {
              borderColor: palette.primary?.light
            },
            '&.Mui-focused fieldset': {
              borderColor: palette.primary?.main
            }
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: palette.text?.secondary
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          backgroundColor: palette.success?.main,
          color: '#ffffff'
        },
        standardError: {
          backgroundColor: palette.error?.main,
          color: '#ffffff'
        },
        standardWarning: {
          backgroundColor: palette.warning?.main,
          color: '#ffffff'
        },
        standardInfo: {
          backgroundColor: palette.primary?.main,
          color: '#ffffff'
        }
      }
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      color: palette.text?.primary
    },
    h2: {
      color: palette.text?.primary
    },
    h3: {
      color: palette.text?.primary
    },
    h4: {
      color: palette.text?.primary
    },
    h5: {
      color: palette.text?.primary
    },
    h6: {
      color: palette.text?.primary
    },
    subtitle1: {
      color: palette.text?.secondary
    },
    subtitle2: {
      color: palette.text?.secondary
    },
    body1: {
      color: palette.text?.primary
    },
    body2: {
      color: palette.text?.secondary
    }
  },
  shape: {
    borderRadius: 8
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.2)',
    '0px 4px 8px rgba(0, 0, 0, 0.2)',
    '0px 8px 16px rgba(0, 0, 0, 0.2)',
    '0px 12px 24px rgba(0, 0, 0, 0.2)',
    ...Array(20).fill('none')
  ]
} as Theme);