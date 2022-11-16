import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: green[800],
      contrastText: '#fff',
    },
    secondary: {
      main: green[100],
      light: green[50],
      dark: green[200],
    },
  },
});
