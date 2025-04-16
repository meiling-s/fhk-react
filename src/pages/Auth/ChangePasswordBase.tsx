import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
  VISIBILITY_ICON,
  VISIBILITY_OFF_ICON,
  WARNING_ICON
} from '../../themes/icons'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../../APICalls/changePassword'
import { STATUS_CODE, localStorgeKeyName } from '../../constants/constant'
import { styles as constantStyle } from '../../constants/styles'
import { useTranslation } from 'react-i18next'
import CustomField from '../../components/FormComponents/CustomField'
import JSEncrypt from 'jsencrypt';
import { AxiosError } from 'axios'

interface FormData {
  userName: string
  password: string
  newPassword: string
  confirmPassword: string
}

interface ShowPasswordState {
  password: boolean
  newPassword: boolean
  confirmPassword: boolean
}

type OnSuccessCallback = () => void

interface ChangePasswordBaseProps {
  onSuccess?: OnSuccessCallback
}

// this page is for change page if already login
const ChangePasswordBase: React.FC<ChangePasswordBaseProps> = ({
  onSuccess
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const titlePage = t('changePass.titlePage')
  const submitLabel = t('changePass.submitPassword')
  const [role, setRole] = useState('')
  const [isFirstLogin, setFirstLogin] = useState<boolean>(false)
  const [isPassValid, setIsPassValid] = useState<boolean>(false)
  const [isPassIdentical, setIsPassIdentical] = useState<boolean>(false)
  const [erorUpdate, setErrorUpdate] = useState<boolean>(false)
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [publicKey, setPublicKey] = useState('');
  const [validation, setValidation] = useState<
    { field: string; error: string }[]
  >([]) //validation for required field
  const [formData, setFormData] = useState<FormData>({
    userName: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState<ShowPasswordState>({
    password: false,
    newPassword: false,
    confirmPassword: false
  })
  const fields = [
    {
      field: 'userName',
      label: t('changePass.username'),
      placeholder: t('changePass.placeholder_username'),
      helperText: t('form.error.shouldNotBeEmpty'),
    },
    {
      field: 'password',
      label: t('changePass.password'),
      placeholder: t('changePass.placeholder_password'),
      type: 'password',
      helperText: t('form.error.shouldNotBeEmpty')
    },
    {
      field: 'newPassword',
      label: t('changePass.new_password'),
      placeholder: t('changePass.placeholder_new_password'),
      type: 'password',
      helperText: t('login.err_msg_002')
    },

    {
      field: 'confirmPassword',
      label: t('changePass.confirm_password'),
      placeholder: t('changePass.placeholder_confirm_password'),
      type: 'password',
      helperText: t('changePass.helper_confirm_password')
    }
  ]

  useEffect(() => {
    fetchPublicKey();
  }, []);

  const fetchPublicKey = async () => {
    try {
      // const response = await fetch(`http://6d7e3a6.r20.cpolar.top/api/v1/collectors/getPublicKey`)
      const response = await fetch(`${window.baseURL.administrator}api/v1/administrator/getPublicKey`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const publicKeyPem = await response.text();
      setPublicKey(publicKeyPem);
    } catch (error) {
      console.error('Error fetching public key:', error);
    }
  };

  const checkPassComplexity = (password: string): boolean => {
    const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
    return passwordRegex.test(password);
  }

  const returnErrMessage = (errorString: string) => {
    setErrorMessage(errorString);
    setErrorUpdate(true)
  };

  useEffect(() => {
    setRole(localStorage.getItem(localStorgeKeyName.role) || '')
    // console.log(
    //   'First Time Login:',
    //   localStorage.getItem(localStorgeKeyName.firstTimeLogin)
    // )
    setFirstLogin(
      localStorage.getItem(localStorgeKeyName.firstTimeLogin) === 'true'
    )
    const username = localStorage.getItem(localStorgeKeyName.username)

    if (username) {
      setFormData((prevData) => ({
        ...prevData,
        userName: username
      }))
    }
  }, [])

  useEffect(() => {
    const tempV: { field: string; error: string }[] = []

    Object.keys(formData).forEach((fieldName) => {
      if (fieldName === 'confirmPassword') {
        if (formData.newPassword !== formData.confirmPassword) {
          tempV.push({
            field: fieldName,
            error: `fields is required`
          })
        }
      } else {
        formData[fieldName as keyof FormData].trim() === '' &&
          tempV.push({
            field: fieldName,
            error: `fields is required`
          })
      }
    })

    setValidation(tempV)

    setIsPassValid(checkPassComplexity(formData.newPassword))
    setIsPassIdentical(formData.newPassword == formData.confirmPassword)

  }, [formData, isPassValid, isPassIdentical])

  const removeNonJsonChar = (dataString: string) => {
    return dataString.substring(
      dataString.indexOf('{'),
      dataString.lastIndexOf('}') + 1,
    )
  }

  const returnErrCode = (error: any) => {
    const response = error?.response?.data?.message || ''
    const errMsgString = removeNonJsonChar(response)
    const errMsgJSON = JSON.parse(errMsgString)
    let message = null
    if(errMsgJSON.errorCode && Number.isInteger(Number(errMsgJSON.errorCode))){
      message = null
    } else if(errMsgJSON.message){
      message = errMsgJSON.message
    } else if (errMsgJSON.errorMessage){
      message = errMsgJSON.errorMessage
    }
    if (message) {
      const errSecondInnerString = removeNonJsonChar(message)
      try {
        const result = JSON.parse(errSecondInnerString)
        return result.errorCode
      } catch (e) {
        const axiosError = e as AxiosError
        return axiosError.status
      }
    } else {
      return errMsgJSON.errorCode
    }
  }

  const submitChangePassword = async () => {
    const isFirstLogin: boolean =
      localStorage.getItem(localStorgeKeyName.firstTimeLogin) === 'true'

    if(formData.password === formData.newPassword){
      returnErrMessage(t('changePass.old_new_password_same'))
    } else if (isPassValid && isPassIdentical && validation.length === 0) {
      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(publicKey);
      const encryptedPassword = encryptor.encrypt(formData.password);
      const encryptedNewPassword = encryptor.encrypt(formData.newPassword)
      if (encryptedPassword !== false && encryptedNewPassword !== false) {
        const passData = {
          loginId: formData.userName,
          password: encryptedPassword,
          newPassword: encryptedNewPassword,
        }
        const resetPassword = async (passData: any) => {
          try {
            const response = await changePassword(passData)
            if (response) {
              if (onSuccess) return onSuccess()
              if (isFirstLogin) {
                localStorage.removeItem('firstTimeLogin')
                navigate('/')
              }
            }
          } catch (error: any) {
            const axiosError = error as AxiosError
            console.log("axios error: ",axiosError)
            if (axiosError.status === STATUS_CODE[503]) {
              return navigate('/maintenance')
            } else {
              if (axiosError?.response) {
                const errCode = returnErrCode(axiosError)
                if (errCode === '002') {
                  returnErrMessage(t('userAccount.passwordPolicy'))
                } else if (errCode === '001'){
                  returnErrMessage(t('userAccount.passwordIncorrect'))
                } else if (errCode === '007'){
                  returnErrMessage(t('login.err_msg_007'))
                } else {
                  const response = error?.response?.data?.message || ''
                  const errMsgString = removeNonJsonChar(response)
                  const errMsgJSON = JSON.parse(errMsgString)
                  returnErrMessage(errMsgJSON)
                }
              }
            }
          }
        }
        resetPassword(passData)
      } else {
        console.error('Encryption failed.')
      }
    } else {
      setTrySubmited(true)
    }
  }

  const handleClickShowPassword = (field: keyof ShowPasswordState) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field]
    }))
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }))
    setErrorUpdate(false)
  }

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  return (
    <Box sx={constantStyle.loginBox}>
      <Typography
        sx={{ marginTop: '30px', marginBottom: '30px' }}
        fontWeight="bold"
        variant="h6"
      >
        {titlePage}
      </Typography>
      {erorUpdate && (
        <div className="bg-[#FDF8F8] flex items-center gap-2 p-2 text-red rounded-lg mt-2  mb-2 text-2xs">
          <WARNING_ICON />
          {errorMessage}
        </div>
      )}
      <Stack spacing={2}>
        {fields.map((item, index) => {
          return (
            <Box key={index}>
              <CustomField
                label={item.label}
                mandatory
              >
                <TextField
                  fullWidth
                  placeholder={item.placeholder}
                  type={
                    item.type !== 'password'
                      ? 'text'
                      : showPassword[item.field as keyof ShowPasswordState]
                        ? 'text'
                        : 'password'
                  }
                  onChange={(event) =>
                    handleInputChange(
                      item.field as keyof FormData,
                      event.target.value
                    )
                  }
                  value={formData[item.field as keyof FormData]}
                  sx={styles.inputState}
                  InputProps={{
                    sx: styles.textField,
                    endAdornment:
                      item.type === 'password' ? (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              handleClickShowPassword(
                                item.field as keyof ShowPasswordState
                              )
                            }
                          >
                            {showPassword[item.field as keyof ShowPasswordState] ? (
                              <VISIBILITY_ICON />
                            ) : (
                              <VISIBILITY_OFF_ICON />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ) : null
                  }}
                  disabled={item.field === 'userName' && !isFirstLogin}
                  error={checkString(formData[item.field as keyof FormData])}
                />

              </CustomField>
              {validation.map((value) => {
                if (item.field === 'userName' || item.field === 'password') {
                  if (value.field === item.field && value.error !== '' && trySubmited) {
                    return (
                      <div className="bg-[#FDF8F8] flex items-center p-2 text-red rounded-lg mt-2 text-2xs">
                        <WARNING_ICON />
                        {item.label} {item.helperText}
                      </div>
                    )
                  }
                } else if (item.field === 'newPassword') {
                  //console.log("value ",value.field, " ",item.field, " ", isPassValid, " ", trySubmited)
                  if (!isPassValid && trySubmited) {
                    return (
                      <div className="bg-[#FDF8F8] flex items-center p-2 text-red rounded-lg mt-2 text-2xs">
                        <WARNING_ICON />
                        {item.helperText}
                      </div>
                    )
                  }
                } else if (item.field === 'confirmPassword') {
                  if (value.field === item.field && !isPassIdentical && trySubmited) {
                    return (
                      <div className="bg-[#FDF8F8] flex items-center gap-2 p-2 text-red rounded-lg mt-2 text-2xs">
                        <WARNING_ICON />
                        {item.helperText}
                      </div>
                    )
                  }
                }
              })}
            </Box>
          )
        })}
        <Box>
          <Button
            fullWidth
            onClick={() => submitChangePassword()}
            sx={{
              marginTop: '16px',
              borderRadius: '20px',
              backgroundColor: '#79ca25',
              '&.MuiButton-root:hover': { bgcolor: '#79ca25' },
              height: '40px'
            }}
            variant="contained"
          >
            {submitLabel}
          </Button>
          {isFirstLogin && (
            <div
              className="text-gray text-mini mt-4 text-center cursor-pointer"
              onClick={() => navigate(`/${role}`)}
            >
              {t('changePass.skip_btn')}
            </div>
          )}
        </Box>
      </Stack>
    </Box>
  )
}

let styles = {
  typo: {
    color: 'grey',
    fontSize: 14,
    marginBottom: '4px'
  },
  textField: {
    borderRadius: '10px',
    fontWeight: '500',
    '& .MuiOutlinedInput-input': {
      padding: '15px 20px'
    }
  },
  inputState: {
    '& .MuiOutlinedInput-root': {
      margin: 0,
      '&:not(.Mui-disabled):hover fieldset': {
        borderColor: '#79CA25'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#79CA25'
      }
    }
  }
}

export default ChangePasswordBase
