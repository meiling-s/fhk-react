import {
  Box,
  Button,
  Stack,
  Typography  } from "@mui/material";
import logo_company from "../../logo_company.png";
import { useNavigate } from "react-router-dom";
import CustomCopyrightSection from "../../components/CustomCopyrightSection";
  
const RegisterResult = () => {
  const navigate = useNavigate();

  const onClick_BackToLogin = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(to bottom, #A8EC7E, #7EECB7,#3BD2F3)",
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
            你已完成登記
          </Typography>
          <Stack spacing={4}>
              
          <Typography sx={styles.typo}>密碼將於帳戶批核後以SMS 形式傳送給你</Typography>

          <Box>
            <Button
              fullWidth
              onClick={onClick_BackToLogin}
              sx={{
                borderRadius: "20px",
                backgroundColor: "#79ca25",
                '&.MuiButton-root:hover':{bgcolor: '#79ca25'},
                height: "40px",
              }}
              variant="contained"
            >
              回到登入
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
    fontSize: 14,
    fontWeight: "bold"
  },
  textField: {
      borderRadius: "10px",
      fontWeight: "500",
      "& .MuiOutlinedInput-input": {
          padding: "10px"
      }
  }
}

export default RegisterResult;
  