import { Box } from '@mui/material'
import CustomCopyrightSection from '../../components/CustomCopyrightSection'
import { styles as constantStyle } from '../../constants/styles'
import ChangePasswordBase from './ChangePasswordBase'
import useMaintenanceMode from '../../hooks/useMaintenanceMode'
import { MAINTENANCE_STATUS } from '../../constants/constant'
import Maintenance from '../Common/MaintenanceCard'

// this page is chenage for first time login
const ChangePassword = () => {
  const { maintenanceStatus, message } = useMaintenanceMode();

  if(MAINTENANCE_STATUS.UNDER_MAINTENANCE === maintenanceStatus){
    return <Maintenance message={message} />
  }
  
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
