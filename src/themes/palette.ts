import { Palette } from '@mui/icons-material';
import { createTheme } from '@mui/material';
import { orange } from '@mui/material/colors';
import { PaletteOptions } from '@mui/material/styles/createPalette';


declare module '@mui/material/styles' {
    interface Theme {
      status: {
        danger: string;
      };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
      status?: {
        danger?: string;
      };
    }
  }

export const paletteColors = {
  KeyGreen: '#79CA25',
  Green1:'#7CE495',
  Green2:'#E4F6DC',
  Red:'#FFF0F4',
  Red1:'#FF4242',
  Grey:'#ACACAC',
  Blue:'#6BC7FF'
};


const theme = createTheme({
    palette: {
        primary: {
          main: paletteColors.KeyGreen,
          light:paletteColors.Green2
        },
        secondary: {
          main: '#edf2ff',
        },
      },
    });
export default theme;