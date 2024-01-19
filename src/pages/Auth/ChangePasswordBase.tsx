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
import { localStorgeKeyName } from '../../constants/constant'
import { styles as constantStyle } from '../../constants/styles'
import { useTranslation } from 'react-i18next'

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
      placeholder: t('changePass.placeholder_username')
    },
    {
      field: 'password',
      label: t('changePass.password'),
      placeholder: t('changePass.placeholder_password'),
      type: 'password'
    },
    {
      field: 'newPassword',
      label: t('changePass.new_password'),
      placeholder: t('changePass.placeholder_new_password'),
      type: 'password',
      helperText: t('changePass.helper_new_pass')
    },

    {
      field: 'confirmPassword',
      label: t('changePass.confirm_password'),
      placeholder: t('changePass.placeholder_confirm_password'),
      type: 'password',
      helperText: t('changePass.helper_confirm_password')
    }
  ]

  const checkPassComplexity = (password: string): boolean => {
    const [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar] = [
      /[A-Z]/,
      /[a-z]/,
      /[0-9]/,
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    ]

    const length = password.length
    const isEightCharactersOrMore = length >= 8
    const isTenCharactersOrMore = length >= 10
    const containsUpperOrLowerCase =
      hasUpperCase.test(password) && hasLowerCase.test(password)
    const containsNumberOrSpecialChar =
      hasNumber.test(password) || hasSpecialChar.test(password)

    return (
      (isEightCharactersOrMore &&
        containsUpperOrLowerCase &&
        containsNumberOrSpecialChar) ||
      (isTenCharactersOrMore && containsUpperOrLowerCase)
    )
  }

  useEffect(() => {
    setRole(localStorage.getItem(localStorgeKeyName.role) || '')
    console.log(
      'First Time Login:',
      localStorage.getItem(localStorgeKeyName.firstTimeLogin)
    )
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
      formData[fieldName as keyof FormData].trim() === '' &&
        tempV.push({
          field: fieldName,
          error: `fields is required`
        })
    })

    setValidation(tempV)

    const isComplexPassword = checkPassComplexity(formData.newPassword)
    const isPassDiffrent = formData.newPassword != formData.password
    setIsPassValid(isComplexPassword && isPassDiffrent)
    setIsPassIdentical(formData.newPassword == formData.confirmPassword)
  }, [formData, isPassValid, isPassIdentical])

  const submitChangePassword = async () => {
    const isFirstLogin: boolean =
      localStorage.getItem(localStorgeKeyName.firstTimeLogin) === 'true'

    if (isPassValid && isPassIdentical && validation.length === 0) {
      const passData = {
        loginId: formData.userName,
        password: formData.password,
        newPassword: formData.newPassword
      }

      const resetPassword = async (passData: any) => {
        try {
          const response = await changePassword(passData)
          if (response) {
            if (onSuccess) return onSuccess()
            if (isFirstLogin) {
              localStorage.removeItem('firstTimeLogin')
              navigate('/warehouse/settings')
            } else {
              navigate('/')
            }
          }
        } catch (error) {
          console.error(error)
          setErrorUpdate(true)
        }
      }
      resetPassword(passData)
    } else {
      setTrySubmited(true)
      setErrorUpdate(true)
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
          {t('changePass.error')}
        </div>
      )}
      <Stack spacing={2}>
        {fields.map((item, index) => (
          <Box key={index}>
            <Typography sx={styles.typo}>{item.label}</Typography>
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
              disabled={item.field === 'userName'}
              error={checkString(formData[item.field as keyof FormData])}
            />
            {item.field === 'newPassword' && !isPassValid && trySubmited && (
              <div className="bg-[#FDF8F8] flex items-center p-2 text-red rounded-lg mt-2 text-2xs">
                <WARNING_ICON />
                {item.helperText}
              </div>
            )}
            {item.field === 'confirmPassword' &&
              !isPassIdentical &&
              trySubmited && (
                <div className="bg-[#FDF8F8] flex items-center gap-2 p-2 text-red rounded-lg mt-2 text-2xs">
                  <WARNING_ICON />
                  {item.helperText}
                </div>
              )}
          </Box>
        ))}
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
