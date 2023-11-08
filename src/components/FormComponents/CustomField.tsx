import { Box, Grid, Typography } from '@mui/material';
import * as React from 'react';
import { styles } from '../../constants/styles';
type props = {
    children?: React.ReactNode | React.ReactNode[],
    label: string,
    necessary?: boolean
}
function CustomField({
    children,
    label,
    necessary
}: props) {
  return(
    <Grid item>
        <Box sx={{display: "flex", flexDirection: "row"}}>
          <Typography sx={styles.header3}> {label} </Typography>
          {
            necessary&&
              <Typography sx={localstyles.necessary}>*</Typography>
          }
        </Box>
        <Box>
          {children}
        </Box>
    </Grid>
  )
}
const localstyles = {
  necessary: {
    color: "red",
    ml: 0.5,
    fontSize: 18
  }
}
export default CustomField;