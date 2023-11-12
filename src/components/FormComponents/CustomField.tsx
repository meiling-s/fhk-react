import { Box, Grid, Typography } from '@mui/material';
import * as React from 'react';
import { styles } from '../../constants/styles';
type props = {
    children?: React.ReactNode | React.ReactNode[],
    label: string,
    mandatory?: boolean
}
function CustomField({
    children,
    label,
    mandatory
}: props) {
  return(
    <Grid item>
        <Box sx={{display: "flex", flexDirection: "row"}}>
          <Typography sx={styles.header3}> {label} </Typography>
          {
            mandatory&&
              <Typography sx={localstyles.mandatory}>*</Typography>
          }
        </Box>
        <Box>
          {children}
        </Box>
    </Grid>
  )
}
const localstyles = {
  mandatory: {
    color: "red",
    ml: 0.5,
    fontSize: 18
  }
}
export default CustomField;