import { Typography } from "@mui/material"

const CustomCopyrightSection = () => {
  return (
    <Typography sx={{ color: "white", marginBottom: "20px" }}>
      <div>Copyright by GreenHoop 2023</div>
      <div className="text-sm font-light">v1-0-0beta-71</div>
    </Typography>
  )
}

export default CustomCopyrightSection;
