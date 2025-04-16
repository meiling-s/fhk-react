import { Box, Grid, Typography } from "@mui/material";
import * as React from "react";
import { styles } from "../../constants/styles";
type props = {
  children?: React.ReactNode | React.ReactNode[];
  label: string;
  mandatory?: boolean;
  customKey?: string;
  className?: string;
  style?: object;
  placeholder?: string;
};
function CustomField({
  children,
  label,
  mandatory,
  customKey,
  className,
  style,
}: props) {
  return (
    <Grid item key={customKey ? customKey : ""} className={className} sx={style}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Typography sx={styles.header3}> {label} </Typography>
        {mandatory && <Typography sx={localstyles.mandatory}>*</Typography>}
      </Box>
      <>{children}</>
    </Grid>
  );
}
const localstyles = {
  mandatory: {
    color: "red",
    ml: 0.5,
    fontSize: 18,
  },
};
export default CustomField;
