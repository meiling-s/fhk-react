import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import logo_company from '../../logo_company.png'
import { useNavigate } from 'react-router-dom'
import CustomCopyrightSection from '../../components/CustomCopyrightSection'
import { styles as constantStyle } from '../../constants/styles'
import { WARNING_ICON } from '../../themes/icons'

interface FormValues {
  [key: string]: string
}

const ForgetPassword = () => {
  const navigate = useNavigate()
  const titlePage = '忘記密碼'
  const submitBtn = '發送'
  const [formValues, setFormValues] = useState<FormValues>({
    username: '',
    email: ''
  })
  const formFields = [
    { name: 'username', label: '登入名稱', placeholder: '請輸入登入名稱' },
    { name: 'email', label: '電郵地址', placeholder: '請輸入電郵地址' }
  ]
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<
    { field: string; error: string }[]
  >([])
  const [erorSubmit, setErorSubmit] = useState<boolean>(false)

  useEffect(() => {
    const tempV: { field: string; error: string }[] = []

    Object.keys(formValues).forEach((fieldName) => {
      formValues[fieldName as keyof FormValues].trim() === '' &&
        tempV.push({
          field: fieldName,
          error: `fields is required`
        })
    })

    setValidation(tempV)
  }, [formValues])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value
    }))
    setErorSubmit(false)
  }

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const submitNewPassword = () => {
    console.log('Submitted:', formValues)
    if (validation.length === 0) {
      //call api
      navigate('/confirmNewPassword')
    } else {
      setTrySubmited(true)
      setErorSubmit(true)
    }
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
          {titlePage}
        </Typography>
        {erorSubmit && (
          <div className="bg-[#FDF8F8] flex items-center gap-2 p-2 text-red rounded-lg mt-2  mb-2 text-2xs">
            <WARNING_ICON />
            {'欄位為必填項'}
          </div>
        )}
        <Stack spacing={4}>
          {formFields.map((field) => (
            <Box key={field.name}>
              <Typography sx={styles.typo}>{field.label}</Typography>
              <TextField
                fullWidth
                placeholder={field.placeholder}
                name={field.name}
                value={formValues[field.name]}
                InputProps={{
                  sx: styles.textField
                }}
                sx={styles.inputState}
                onChange={handleInputChange}
                error={checkString(formValues[field.name as keyof FormValues])}
              />
            </Box>
          ))}
          <Box>
            <Button
              fullWidth
              onClick={submitNewPassword}
              sx={{
                borderRadius: '20px',
                backgroundColor: '#79ca25',
                '&.MuiButton-root:hover': { bgcolor: '#79ca25' },
                height: '40px'
              }}
              variant="contained"
            >
              {submitBtn}
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
      padding: '10px'
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

export default ForgetPassword
