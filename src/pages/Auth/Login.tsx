import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  // InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import logo_company from '../../logo_company.png'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import { useNavigate } from 'react-router-dom'
import { login } from '../../APICalls/login'
import { MAINTENANCE_STATUS, localStorgeKeyName } from '../../constants/constant'
import CustomCopyrightSection from '../../components/CustomCopyrightSection'
import { styles as constantStyle } from '../../constants/styles'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTranslation } from 'react-i18next'
import { jwtDecode } from 'jwt-decode'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../contexts/CommonTypeContainer'
import { setLanguage } from '../../setups/i18n'
import { returnApiToken } from '../../utils/utils'
import { getTenantById } from '../../APICalls/tenantManage'
import Maintenance from '../Common/MaintenanceCard'
import useMaintenanceMode from '../../hooks/useMaintenanceMode'

const Login = () => {
  const { i18n } = useTranslation()
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  //const [loginTo, setLoginTo] = useState('astd')
  const [loggingIn, setLogginIn] = useState(false)
  const [warningMsg, setWarningMsg] = useState<string>(' ')
  const navigate = useNavigate()
  const { t } = useTranslation()
  const commonTypeContainer = useContainer(CommonTypeContainer);
 const { maintenanceStatus, message } = useMaintenanceMode();

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

  const getTenantData = async () => {
    const token = returnApiToken()
    const result = await getTenantById(parseInt(token.tenantId))
    const data = result?.data
    return data.lang
  }

  const onLoginButtonClick = async (userName: string, password: string) => {
    setLogginIn(true)
    //login for astd testing
    var realm = 'astd' //default realm is astd
    var loginTo = 'astd'

    if (realm != '') {
      const result = await login({
        username: userName,
        password: password
      })
      console.log(result, 'result login')
      if (result && result.access_token) {
        setWarningMsg(' ')
        //console.log(`Token: ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`);
        localStorage.setItem(
          localStorgeKeyName.keycloakToken,
          result?.access_token || ''
        )
        localStorage.setItem(
          localStorgeKeyName.refreshToken,
          result?.refresh_token || ''
        )
        localStorage.setItem(localStorgeKeyName.realm, result?.realm || '')
        localStorage.setItem(localStorgeKeyName.role, result?.realm || '')
        localStorage.setItem(
          localStorgeKeyName.username,
          result?.username || ''
        )
        // 20240129 add function list daniel keung start
        const functionList = result?.functionList || []
        const uniqueFunctionList = Array.from(new Set(functionList))

        localStorage.setItem(
          localStorgeKeyName.functionList,
          JSON.stringify(uniqueFunctionList)
        )
        // 20240129 add function list daniel keung end
        const decodedToken: any = jwtDecode(result?.access_token)
        const azpValue = decodedToken.azp
        localStorage.setItem(localStorgeKeyName.decodeKeycloack, azpValue || '')
        // 20240129 add function list daniel keung start
        const tenantID = azpValue.substring(7)
        localStorage.setItem(localStorgeKeyName.tenantId, tenantID || '')
        loginTo = result?.realm
        // 20240129 add function list daniel keung end
        let realmApiRoute = ''
        switch (loginTo) {
          case 'astd':
            realmApiRoute = 'account'
            navigate('/astd')
            break
          case 'collector':
            realmApiRoute = 'collectors'
            navigate('/collector')
            break
          case 'logistic':
            realmApiRoute = 'logistic'
            navigate('/logistic/pickupOrder')
            break
          case 'manufacturer':
            realmApiRoute = 'manufacturer'
            navigate('/manufacturer/pickupOrder')
            break
          case 'customer':
            realmApiRoute = 'customer'
            navigate('/customer/account')
            break
          default:
            realmApiRoute = 'collectors'
            break
        }
        localStorage.setItem(localStorgeKeyName.realmApiRoute, realmApiRoute)

        //set selected lang
        const tenantLang = await getTenantData()
        const selectedLang = getSelectedLanguange(tenantLang)

        localStorage.setItem(localStorgeKeyName.selectedLanguage, selectedLang)
        i18n.changeLanguage(selectedLang)
        setLanguage(selectedLang)

        commonTypeContainer.updateCommonTypeContainer()
      } else {
        const errCode = result
        if (errCode == '004') {
          //navigate to reset pass firsttime login
          localStorage.setItem(localStorgeKeyName.firstTimeLogin, 'true')
          return navigate('/changePassword')
        }
        setWarningMsg(t(`login.err_msg_${errCode}`))
      }
    }

    setLogginIn(false)
  }

  const getSelectedLanguange = (lang: string) => {
    var selectedLang = 'zhhk'
    switch (lang) {
      case 'ZH-HK':
        selectedLang = 'zhhk'
        break
      case 'ZH-CH':
        selectedLang = 'zhch'
        break
      case 'EN-US':
        selectedLang = 'enus'
        break
      default:
        selectedLang = 'zhhk'
        break
    }

    return selectedLang
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const navigateToForgotPassword = () => {
    navigate('/resetPassword')
  }

  if(maintenanceStatus === MAINTENANCE_STATUS.UNDER_MAINTENANCE){
    localStorage.setItem('maintenanceStatus', MAINTENANCE_STATUS.UNDER_MAINTENANCE)
    return <Maintenance  message={message}/>
  } else {
    localStorage.setItem('maintenanceStatus', MAINTENANCE_STATUS.NOT_UNDER_MAINTENANCE)
  }

  return (
    <Box
      sx={constantStyle.loginPageBg}
      component="form"
      onSubmit={(event) => {
        event.preventDefault()
        onLoginButtonClick(userName, password)
      }}
    >
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
          {/* <FormControl fullWidth>
            <Typography sx={styles.typo}>Login to (for testing)</Typography>
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
          </FormControl> */}
          <Box>
            <LoadingButton
              fullWidth
              loading={loggingIn}
              type="submit"
              sx={{
                borderRadius: '20px',
                backgroundColor: '#79ca25',
                '&.MuiButton-root:hover': { bgcolor: '#79ca25' },
                height: '40px'
              }}
              variant="contained"
            >
              登入
            </LoadingButton>
          </Box>
          {warningMsg != ' ' && (
            <FormHelperText error>{warningMsg}</FormHelperText>
          )}
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
      <div className="sm:mt-4 w-full pt-4 text-center">
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
