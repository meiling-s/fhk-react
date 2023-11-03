import { Box, Grid, Typography } from '@mui/material';
import * as React from 'react';

type props = {
    children?: React.ReactNode | React.ReactNode[],
    label: string
}

function CustomField({
    children,
    label
}: props) {
  return(
    <Grid item>
        <Typography sx={localstyles.label}> {label} </Typography>
        <Box>
            {children}
        </Box>
    </Grid>
  )
}

const localstyles = {
    label: {
        fontSize: 16,
        color: "#ACACAC"
    }
}

export default CustomField;