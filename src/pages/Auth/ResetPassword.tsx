import { Box, Button, Stack, TextField, Typography, Modal } from '@mui/material'
import React, { useState, useEffect } from 'react'
import logo_company from '../../logo_company.png'
import { useNavigate } from 'react-router-dom'
import CustomCopyrightSection from '../../components/CustomCopyrightSection'
import { styles as constantStyle } from '../../constants/styles'
import { WARNING_ICON } from '../../themes/icons'
import { forgetPassword } from '../../APICalls/forgetPassword'
import { forgetPasswordForm } from '../../interfaces/forgetPassword'

interface FormValues {
  [key: string]: string  
}

const ForgetPassword = () => {
  const navigate = useNavigate()
  const titlePage = '忘記密碼'
  const submitBtn = '發送'
  const [formValues, setFormValues] = useState<FormValues>({
    username: '',
    contactNo: ''
  })
  const formFields = [
    { name: 'username', label: '登入名稱', placeholder: '請輸入登入名稱' },
    { name: 'contactNo', label: '聯絡電話', placeholder: '請輸入聯絡電話' }
  ]
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<
    { field: string; error: string }[]
  >([])
  const [erorSubmit, setErorSubmit] = useState<boolean>(false)
  const [showModalConfirm, setModalConfirm] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    const tempV: { field: string; error: string }[] = []
    formValues?.username.trim() === '' && tempV.push({
        field: '登入名稱',
        error: `欄位為必填項`
    })

    Number.isNaN(parseInt(formValues?.contactNo)) && tempV.push({
      field: '電郵地址',
      error: `欄位為必填項`
  })

    // Object.keys(formValues).forEach((fieldName) => {
    //   formValues[fieldName as keyof FormValues].trim() === '' &&
    //     tempV.push({
    //       field: fieldName,
    //       error: `fields is required`
    //     })
    // })

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

  const submitNewPassword = async () => {
    console.log('Submitted:', formValues)
    const formData: forgetPasswordForm = {
      loginId: 'collectoradmin',
      contactNo: 5645435,
      createdBy: formValues.username
    }

    console.log('data : ', formData)
    if (validation.length === 0) {
      const result = await forgetPassword(formData)
      const data = result?.data


      if (data) {
        navigate('/confirmNewPassword')
      }
    } else {
      setTrySubmited(true)
      setErorSubmit(true)
    }
  }

  interface ModalNotif {
    open?: boolean
    onClose?: () => void
  }

  const ModalNotification: React.FC<ModalNotif> = ({
    open = false,
    onClose
  }) => {
    return (
      <Modal id="success-modal" open={open}>
        <Box sx={modalStyle}>
          <Typography>API 尚未準備好</Typography>
          <Button
            className="float-right"
            sx={{
              borderRadius: '20px',
              backgroundColor: '#79ca25',
              '&.MuiButton-root:hover': { bgcolor: '#79ca25' },
              height: '40px'
            }}
            variant="contained"
            onClick={onClose}
          >
            好的
          </Button>
        </Box>
      </Modal>
    )
  }

  interface ModalConfirmation {
    open?: boolean
    onClose?: () => void
  }

  const ModalConfirmation: React.FC<ModalNotif> = ({
    open = false,
    onClose
  }) => {
    const handleConfirm = () => {
      if (onClose) onClose()
      setShowModal(true)
    }
    return (
      <Modal id="success-modal" open={open}>
        <Box sx={modalStyle}>
          <Typography>您確定要重設密碼嗎</Typography>
          <Box sx={{ textAlign: 'right', marginTop: '8px' }}>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={onClose}
            >
              不
            </button>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={handleConfirm}
            >
              是的
            </button>
          </Box>
        </Box>
      </Modal>
    )
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
      <ModalNotification open={showModal} onClose={() => setShowModal(false)} />
      <ModalConfirmation
        open={showModalConfirm}
        onClose={() => setModalConfirm(false)}
      />
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

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4
}

export default ForgetPassword
