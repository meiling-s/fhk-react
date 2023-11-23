import { layout } from './constant'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// const theme = useTheme()
// const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

export const styles = {
  innerScreen: {
    display: 'flex',
    // height: "100%",
    height: '100vw',
    ml: `${layout.drawerWidth}px`,
    mt: { lg: layout.appbarHeight, sm: '100px' },
    backgroundColor: '#F4F5F7',
    // pl: 4,
    pt: 4
  },
  mobileScreen: {
    ml: 0,
    pl: 0,
    pt: 0
  },
  headerSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: 'black'
  },
  gridForm: {
    alignItems: 'flex-start',
    pb: 2
  },
  header1: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  header2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#717171'
  },
  header3: {
    fontSize: 16,
    color: '#ACACAC'
  },
  formDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000'
  },
  buttonFilledGreen: {
    borderRadius: '40px',
    borderColor: '#79ca25',
    backgroundColor: '#79CA25',
    color: 'white',
    fontWeight: 'bold',
    '&.MuiButton-root:hover': {
      backgroundColor: '#7AD123'
    }
  },
  buttonOutlinedGreen: {
    borderRadius: '40px',
    border: 1,
    borderColor: '#79ca25',
    backgroundColor: 'white',
    color: '#79ca25',
    fontWeight: 'bold',
    '&.MuiButton-root:hover': {
      bgcolor: '#F4F4F4'
    }
  },
  mapRightContainer: {
    width: '50%',
    height: `calc(100vh - ${layout.appbarHeight})`,
    mt: -4
  },
  textField: {
    borderRadius: 5,
    backgroundColor: 'white',
    '& fieldset': {
      borderRadius: 5
    }
  },
  inputProps: {
    '&:hover fieldset': {
      borderColor: '#A8A8A8 !important'
    },
    '&:focus-within fieldset, &:focus-visible fieldset': {
      borderColor: '#79CA25 !important'
    }
  },
  endAdornmentIcon: {
    fontSize: 25,
    color: '#79CA25'
  },
  disableIcon: {
    fontSize: 25,
    color: '#ACACAC'
  },
  listItemTemp: {
    //list item template, general style of custom list item in all state
    paddingX: 1.5,
    paddingY: 1,
    mr: 1,
    borderWidth: 1,
    borderRadius: 50,
    fontWeight: 'bold'
  },
  loginPageBg: {
    backgroundImage: {
      sm: 'white',
      md: 'linear-gradient(157.23deg, #A8EC7E -2.71%, #7EECB7 39.61%, #3BD2F3 107.1%)'
    },
    minHeight: '100vh',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginBox: {
    padding: { sm: '10px', md: '40px' },
    margin: 'auto',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    height: 'fit-content',
    width: '20%',
    minWidth: 300,
    transition: 'height 0.3s ease-in-out'
  },
  labelField: {
    color: '#717171',
    fontSize: 14,
    marginBottom: 1,
    fontWeight: 900
  }
}
