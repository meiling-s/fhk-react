import { CircularProgress, Box } from '@mui/material'
import { localStorgeKeyName } from '../constants/constant'

const CircularLoading = () => {
  const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'

  return (
    <Box sx={{ textAlign: 'center', paddingY: 12 , width: '100%'}}>
      <CircularProgress
        color={
          role === 'manufacturer' || role === 'customer' ? 'primary' : 'success'
        }
      />
    </Box>
  )
}

export default CircularLoading
