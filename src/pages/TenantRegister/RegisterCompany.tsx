
import { Button, TextField, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import logo_company from "../../logo_company.png";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getTenantById } from '../../APICalls/tenantManage';



const RegisterCompany = () => {
const { inviteId } = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [ChiName, setChiName] = useState("");
  const [EngName, setEngName] = useState("")
  
  const onContinueButtonClick = () => {
    navigate("/register/contact");
  };
  useEffect(()=>{
    initInviteForm();
  },[]);

  async function initInviteForm() {
    console.log('invite id: '+inviteId);
    // if(inviteId){
    //   const result = await getTenantById(inviteId);
    //   const data = result?.data;
    //   setChiName(data?.companyNameTchi);
    //   setEngName(data?.companyNameEng);
    //   setType(data?.tenantType);
    //   console.log(result?.data);
    // }
  }
  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(157.23deg, #A8EC7E -2.71%, #7EECB7 39.61%, #3BD2F3 107.1%)",
        minHeight: "100vh",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          padding: "40px",
          margin: "2%",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          height: "fit-content",
          width: "20%",
          minWidth: 300
        }}
      >
        <img src={logo_company} alt="logo_company" style={{ width: "55px" }} />
        <Typography
          sx={{ marginTop: "20px", marginBottom: "20px" }}
          fontWeight="bold"
          variant="h6"
        >
          登記
        </Typography>
        <Stack spacing={4}>
          <Box>
            <Typography sx={styles.typo}>公司類別</Typography>
            <TextField
              fullWidth
              disabled
              InputProps={{
                  sx: styles.textField
              }}
              value={type}
            />
          </Box>
          <Box>
            <Typography sx={styles.typo}>公司中文名</Typography>
            <TextField
              fullWidth
              disabled
              InputProps={{
                  sx: styles.textField
              }}
              value={ChiName}
            />
          </Box>
          <Box>
            <Typography sx={styles.typo}>公司英文名</Typography>
            <TextField
              fullWidth
              disabled
              InputProps={{
                  sx: styles.textField
              }}
              value={EngName}
            />
          </Box>

          <Box>
            <Button
              fullWidth
              onClick={onContinueButtonClick}
              disabled={ type === "" ? true : false }
              sx={{
                borderRadius: "20px",
                backgroundColor: "#79ca25",
                '&.MuiButton-root:hover':{bgcolor: '#79ca25'},
                height: "40px",
              }}
              variant="contained"
            >
              繼續
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

let styles = {
    typo: {
      color: "grey",
      fontSize: 14
    },
    textField: {
      borderRadius: "10px",
      fontWeight: "500",
      "& .MuiOutlinedInput-input": {
          padding: "10px"
      }
    }
  }
  
export default RegisterCompany