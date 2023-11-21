import { Box, Button, Typography } from '@mui/material'
import logo_company from '../../logo_company.png'
import { useNavigate } from 'react-router-dom'
import CustomCopyrightSection from '../../components/CustomCopyrightSection'
import { styles as constantStyle } from '../../constants/styles'

const ConfirmNewPassword = () => {
  const navigate = useNavigate()
  const titlePage = '你已成功申請密碼重設'
  const msgConfirmation = '新密碼經批核後將以SMS 形式傳送給你'
  const backToLogin = '回到登入'

  const backToLoginPage = () => {
    navigate('/')
  }

  return (
    <Box sx={constantStyle.loginPageBg}>
      <Box sx={constantStyle.loginBox}>
        <img src={logo_company} alt="logo_company" style={{ width: '70px' }} />
        <Typography
          sx={{ marginTop: '30px', marginBottom: '15px' }}
          fontWeight="bold"
          variant="h6"
        >
          {titlePage}
        </Typography>
        <Typography
          sx={{ marginTop: '8px', marginBottom: '20px' }}
          fontWeight="light"
          fontSize="14px"
        >
          {msgConfirmation}
        </Typography>
        <Box>
          <Button
            fullWidth
            onClick={backToLoginPage}
            sx={{
              borderRadius: '20px',
              backgroundColor: '#79ca25',
              '&.MuiButton-root:hover': { bgcolor: '#79ca25' },
              height: '40px'
            }}
            variant="contained"
          >
            {backToLogin}
          </Button>
        </Box>
      </Box>
      <CustomCopyrightSection />
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

export default ConfirmNewPassword
