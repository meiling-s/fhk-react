import { createTheme } from '@mui/material';
import { PaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

export const paletteColors = {
  KeyGreen: '#79CA25',
  Green1: '#7CE495',
  Green2: '#E4F6DC',
  Red: '#FFF0F4',
  Red1: '#FF4242',
  Grey: '#ACACAC',
  Blue: '#6BC7FF'
};

const theme = createTheme({
  palette: {
    primary: {
      main: paletteColors.KeyGreen,
      light: paletteColors.Green2
    },
    secondary: {
      main: '#edf2ff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: paletteColors.KeyGreen,
          color: '#fff',
          '&:hover': {
            backgroundColor: '#6BAF21', // Darker shade for hover state
          },
        },
        outlinedPrimary: {
          borderColor: paletteColors.KeyGreen, // Green border
          color: paletteColors.KeyGreen, // Green text
          backgroundColor: '#fff', // White background
          '&:hover': {
            borderColor: '#6BAF21', // Darker green border on hover
            backgroundColor: paletteColors.Green2, // Light green background on hover
          },
        },
      },
    },
  },
});

export default theme;
