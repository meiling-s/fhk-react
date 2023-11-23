import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  // InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import logo_company from '../../logo_company.png'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import { useNavigate } from 'react-router-dom'
import { login } from '../../APICalls/login'
import { localStorgeKeyName } from '../../constants/constant'
import CustomCopyrightSection from '../../components/CustomCopyrightSection'
import { styles as constantStyle } from '../../constants/styles'

const Login = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [loginTo, setLoginTo] = useState('astd')
  const navigate = useNavigate()

  // overwrite select style
  //todo : make select as component
  const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
      marginTop: theme.spacing(3)
    },
    '& .MuiInputBase-input': {
      border: '1px solid rgba(0, 0, 0, 0.23)',
      borderRadius: 8,
      padding: 8
    }
  }))

  const onLoginButtonClick = async (userName: string, password: string) => {
    const result = await login({
      username: userName,
      password: password,
      realm: 'astd'
    })
    switch (loginTo) {
      case 'astd':
        navigate('/astd')
        break
      case 'collector':
        navigate('/collector')
        break
      case 'warehouse':
        navigate('/warehouse')
        break
      default:
        navigate('/collector')
    }
    console.log(
      `Token: ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`
    )
    localStorage.setItem(
      localStorgeKeyName.keycloakToken,
      result?.access_token || ''
    )
    localStorage.setItem(localStorgeKeyName.username, result?.username || '')
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const navigateToForgotPassword = () => {
    navigate('/forgetPassword')
  }

  return (
    <Box sx={constantStyle.loginPageBg}>
      <Box sx={constantStyle.loginBox}>
        <img src={logo_company} alt="logo_company" style={{ width: '70px' }} />
        <Typography
          sx={{ marginTop: '30px', marginBottom: '30px' }}
          fontWeight="bold"
          variant="h6"
        >
          登入
        </Typography>
        <Stack spacing={4}>
          <Box>
            <Typography sx={styles.typo}>用戶名稱</Typography>
            <TextField
              fullWidth
              placeholder="請輸入用戶名稱"
              InputProps={{
                sx: styles.textField
              }}
              onChange={(event: {
                target: { value: React.SetStateAction<string> }
              }) => {
                setUserName(event.target.value)
              }}
            />
          </Box>
          <Box>
            <Typography sx={styles.typo}>密碼</Typography>
            <TextField
              fullWidth
              placeholder="請輸入密碼"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                sx: styles.textField,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onChange={(event: {
                target: { value: React.SetStateAction<string> }
              }) => {
                setPassword(event.target.value)
              }}
            />
          </Box>
          <FormControl fullWidth>
            <Typography sx={styles.typo}>Login to (for testing)</Typography>
            {/* <InputLabel htmlFor="user-option">Login to (for testing)</InputLabel> */}
            <Select
              id="user-option"
              value={loginTo}
              label="Age"
              onChange={(event) => setLoginTo(event.target.value)}
              input={<BootstrapInput />}
            >
              <MenuItem value={'astd'}>ASTD</MenuItem>
              <MenuItem value={'collector'}>Collector</MenuItem>
              <MenuItem value={'warehouse'}>Warehouse</MenuItem>
            </Select>
          </FormControl>
          <Box>
            <Button
              fullWidth
              onClick={() => onLoginButtonClick(userName, password)}
              sx={{
                borderRadius: '20px',
                backgroundColor: '#79ca25',
                '&.MuiButton-root:hover': { bgcolor: '#79ca25' },
                height: '40px'
              }}
              variant="contained"
            >
              登入
            </Button>
          </Box>
          <Box>
            <Button
              sx={{ color: 'grey', textDecoration: 'underline' }}
              variant="text"
              onClick={navigateToForgotPassword}
            >
              忘記密碼
            </Button>
          </Box>
        </Stack>
      </Box>
      <div
        className="sm:mt-4 w-full px-5 pt-4 text-center"
        style={{
          backgroundImage:
            'linear-gradient(157.23deg, #A8EC7E -2.71%, #7EECB7 39.61%, #3BD2F3 107.1%)'
        }}
      >
        <CustomCopyrightSection />
      </div>
    </Box>
  )
}

let styles = {
  typo: {
    color: 'grey',
    fontSize: 14
  },
  textField: {
    borderRadius: '10px',
    fontWeight: '500',
    '& .MuiOutlinedInput-input': {
      padding: '10px'
    }
  }
}

export default Login
