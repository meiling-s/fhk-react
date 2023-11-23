import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import logo_company from '../../logo_company.png'
import { useNavigate } from 'react-router-dom'
import CustomCopyrightSection from '../../components/CustomCopyrightSection'
import { styles as constantStyle } from '../../constants/styles'

interface FormValues {
  [key: string]: string
}

const RegisterTenant = () => {
  const navigate = useNavigate()
  const titlePage = '登記'
  const submitBtn = ' 繼續'
  const [formValues, setFormValues] = useState<FormValues>({
    company_category: '',
    company_cn_name: '',
    company_en_name: ''
  })
  const formFields = [
    { name: 'company_category', label: '公司類別', placeholder: 'Collector' },
    { name: 'company_cn_name', label: '公司中文名', placeholder: '回收公司' },
    {
      name: 'company_en_name',
      label: '公司英文名',
      placeholder: 'Collector Company'
    }
  ]

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const registerTenant = () => {
    console.log('Submitted:', formValues)
    navigate('/register/firstStep')
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
              <Typography sx={constantStyle.labelField}>{field.label}</Typography>
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
              onClick={registerTenant}
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
  textField: {
    borderRadius: '10px',
    fontWeight: '500',
    '& .MuiOutlinedInput-input': {
      padding: '10px'
    }
  }
}

export default RegisterTenant
