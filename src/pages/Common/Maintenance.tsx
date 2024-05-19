import {Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import logo_company from '../../logo_company.png'

const PageNotFound = () => {
const { t } = useTranslation()

return (
    <Box sx={styles.maintenancePage}>
        <Box sx={styles.maintenanceBox}>
            <img src={logo_company} alt="logo_company" style={{ width: '70px' }} className='p-[10px]'/>
            <Typography style={{fontSize: '22px', fontWeight: 700, color: '#000000', padding: '10px'}}>
                {t('common.maintenance')}
            </Typography>
        </Box>
    </Box>
)
}
  
let styles = {
    maintenanceBox: {
        paddingX: 4,
        paddingY: 5,
        margin: {
          sm: '0 auto',
          md: 'auto'
        },
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        height: 'fit-content',
        // width: '20%',
        minHeight: 200,
        minWidth: 430,
        transition: 'height 0.3s ease-in-out',
        gap: '20px'
    },
    maintenancePage: {
        backgroundImage:
          'linear-gradient(157.23deg, #A8EC7E -2.71%, #7EECB7 39.61%, #3BD2F3 107.1%)',
        minHeight: '100vh',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: {
          sm: 'flex-start',
          md: 'center'
        }
      },
}

export default PageNotFound
  