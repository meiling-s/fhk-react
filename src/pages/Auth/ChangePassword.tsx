import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import {
  VISIBILITY_ICON,
  VISIBILITY_OFF_ICON,
  WARNING_ICON
} from '../../themes/icons'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../../APICalls/changePassword'
import { localStorgeKeyName } from '../../constants/constant'
import CustomCopyrightSection from '../../components/CustomCopyrightSection'
import { styles as constantStyle } from '../../constants/styles'

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
const ChangePassword = () => {
    // todo : add key local storage for firstime login
    // direct to homepage if success
    // show msg error when failed login
  const navigate = useNavigate()
  const titlePage = '重置密碼'
  const submitLabel = '完成重置'
  const [isPassValid, setIsPassValid] = useState<boolean>(true)
  const [isPassIdentical, setIsPassIdentical] = useState<boolean>(true)
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
      label: '登入名稱',
      placeholder: '例如：chantaiman001'
    },
    {
      field: 'password',
      label: '密碼',
      placeholder: '請輸入密碼',
      type: 'password'
    },
    {
      field: 'newPassword',
      label: '新密碼',
      placeholder: '請輸入密碼',
      type: 'password',
      helperText: '密碼至少包含8 個字元，並混用英文字母、數字和符號'
    },

    {
      field: 'confirmPassword',
      label: '再次輸入新密碼',
      placeholder: '請輸入密碼',
      type: 'password',
      helperText: '您的新密碼和確認密碼不匹配'
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

  const validatePass = () => {
    const isComplexPassword = checkPassComplexity(formData.newPassword)
    const isPassDiffrent = formData.newPassword != formData.password

    setIsPassValid(isComplexPassword && isPassDiffrent)
    setIsPassIdentical(formData.newPassword === formData.confirmPassword)
  }

  const submitChangePassword = async () => {
    // localStorage.setItem(localStorgeKeyName.username, result?.username || '')
    //checkPassRequirment()
    validatePass()
    if (isPassValid && isPassIdentical) {
      // call api change pass
      const passData = {
        username: formData.userName,
        password: formData.password,
        newPassword: formData.newPassword
      }

      const resetPassword = async (passData: any) => {
        try {
          const response = await changePassword(passData)
          if (response) {
            console.log('updated', response)
          }
        } catch (error) {
          console.error(error)
        }
      }
      resetPassword(passData)
      // localStorage.setItem(localStorgeKeyName.username, result?.username || '')
    }
  }

  const handleClickShowPassword = (field: keyof ShowPasswordState) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field]
    }))
    setIsPassValid(true)
    setIsPassIdentical(true)
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }))
  }

  return (
    <Box sx={constantStyle.loginPageBg}>
      <Box sx={constantStyle.loginBox}>
        <Typography
          sx={{ marginTop: '30px', marginBottom: '30px' }}
          fontWeight="bold"
          variant="h6"
        >
          {titlePage}
        </Typography>
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
                          {showPassword ? (
                            <VISIBILITY_ICON />
                          ) : (
                            <VISIBILITY_OFF_ICON />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ) : null
                }}
              />
              {item.field === 'newPassword' && !isPassValid && (
                <div className="bg-[#FDF8F8] p-2 text-red rounded-lg mt-2 text-2xs">
                  <WARNING_ICON />
                  {item.helperText}
                </div>
              )}
              {item.field === 'confirmPassword' && !isPassIdentical && (
                <div className="bg-[#FDF8F8] p-2 text-red rounded-lg mt-2 text-2xs">
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

export default ChangePassword
