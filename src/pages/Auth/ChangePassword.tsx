import { Box } from '@mui/material'
import CustomCopyrightSection from '../../components/CustomCopyrightSection'
import { styles as constantStyle } from '../../constants/styles'
import ChangePasswordBase from './ChangePasswordBase'

// this page is chenage for first time login
const ChangePassword = () => {
  return (
    <Box sx={constantStyle.loginPageBg}>
      <ChangePasswordBase />
      <div className="sm:mt-4 w-full pt-4 text-center">
        <CustomCopyrightSection />
      </div>
    </Box>
  )
}

export default ChangePassword
