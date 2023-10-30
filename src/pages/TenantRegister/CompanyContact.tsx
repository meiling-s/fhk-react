import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Card,
  ButtonBase
} from "@mui/material";
import logo_company from "../../logo_company.png";
import { useNavigate } from "react-router-dom";
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CustomCopyrightSection from "../../components/CustomCopyrightSection";
  
  const TenantRegisterForm2 = () => {

    const navigate = useNavigate();
  
    const onRegisterButtonClick = () => {
      navigate("/register/result");
    };
  
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
              <Typography sx={styles.typo}>聯絡人姓名</Typography>
              <TextField
                fullWidth
                placeholder="請輸入姓名"
                InputProps={{
                    sx: styles.textField
                }}
              />
            </Box>
            <Box>
              <Typography sx={styles.typo}>聯絡人手機號碼</Typography>
              <TextField
                fullWidth
                placeholder="請輸入手機號碼"
                InputProps={{
                    sx: styles.textField
                }}
              />
            </Box>

            <Box>
                <Typography sx={styles.typo}>EPD 合約（可上傳多張合約)</Typography>
                <Card sx={{
                    borderRadius: 5,
                    backgroundColor: "#F4F4F4",
                    width: "100%",
                    height: 100,
                }}>
                    <ButtonBase
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onClick={event => {}}>
                        <CameraAltOutlinedIcon style={{color: "#ACACAC"}}/>
                        <Typography sx={styles.typo}>上載圖片</Typography>
                    </ButtonBase>
                </Card>
            </Box>

            <Box>
              <Button
                fullWidth
                onClick={onRegisterButtonClick}
                sx={{
                  borderRadius: "20px",
                  backgroundColor: "#79ca25",
                  '&.MuiButton-root:hover':{bgcolor: '#79ca25'},
                  
                  height: "40px",
                }}
                
                variant="contained"
              >
                登記
              </Button>
            </Box>
          </Stack>
        </Box>
        <CustomCopyrightSection />
      </Box>
    );
  };
  
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

  export default TenantRegisterForm2;
  