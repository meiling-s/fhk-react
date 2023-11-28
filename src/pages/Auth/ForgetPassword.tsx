import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import logo_company from '../../logo_company.png'
import { useNavigate } from 'react-router-dom'
import CustomCopyrightSection from '../../components/CustomCopyrightSection'
import { styles as constantStyle } from '../../constants/styles'

interface FormValues {
  [key: string]: string
}

const ForgetPassword = () => {
  const navigate = useNavigate()
  const titlePage = '登入名稱'
  const submitBtn = ' 發送'
  const [formValues, setFormValues] = useState<FormValues>({
    username: '',
    email: ''
  })
  const formFields = [
    { name: 'username', label: '用戶名稱', placeholder: '請輸入登入名稱' },
    { name: 'email', label: '電郵地址', placeholder: '請輸入電郵地址' }
  ]

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const submitNewPassword = () => {
    console.log('Submitted:', formValues)
    navigate('/confirmNewPassword')
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
                onChange={handleInputChange}
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

export default ForgetPassword
