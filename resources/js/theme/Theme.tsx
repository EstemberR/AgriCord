import { createTheme, ThemeOptions } from '@mui/material/styles';
import typography from './Typography';
import { shadows } from './Shadows';
import { DarkThemeColors } from './DefaultColors';

const themeOptions: ThemeOptions = {
  direction: 'ltr',
  palette: {
    mode: 'dark',
    primary: {
      main: DarkThemeColors.primary,
      light: DarkThemeColors.primarylight,
      dark: DarkThemeColors.primarydark,
    },
    secondary: {
      main: DarkThemeColors.secondary,
      light: DarkThemeColors.secondarylight,
      dark: DarkThemeColors.secondarydark,
    },
    background: {
      default: DarkThemeColors.background,
      paper: DarkThemeColors.paper,
    },
    text: DarkThemeColors.text,
  },
  typography,
  shadows,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: DarkThemeColors.background,
          color: DarkThemeColors.text.primary,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: DarkThemeColors.paper,
          color: DarkThemeColors.text.primary,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: DarkThemeColors.paper,
          color: DarkThemeColors.text.primary,
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;