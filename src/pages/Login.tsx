import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import logo_company from "../logo_company.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { login } from "../APICalls/login";
import { localStorgeKeyName } from "../constants/constant";
import CustomCopyrightSection from "../components/CustomCopyrightSection";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const onLoginButtonClick = async (userName: string) => {
    const accessToken = await login({
      username: userName,
      password: password,
      realm: 'astd'
    });
    switch(userName){
      case "astd":
        navigate("/astd");
        break;
      case "collector":
        navigate("/collector");
        break;
      default:
        navigate("/astd");
    }
    console.log(`Token: ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`);
    localStorage.setItem(localStorgeKeyName.keycloakToken, accessToken || '');
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

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
        <img src={logo_company} alt="logo_company" style={{ width: "70px" }} />
        <Typography
          sx={{ marginTop: "30px", marginBottom: "30px" }}
          fontWeight="bold"
          variant="h6"
        >
          登入
        </Typography>
        <Stack spacing={4}>
          <Box>
            <Typography sx={styles.typo}>用戶名稱</Typography>
            <TextField
              fullWidth
              placeholder="請輸入用戶名稱"
              InputProps={{
                sx: styles.textField
              }}
              onChange={(event) => {
                setUserName(event.target.value);
              }}
            />
          </Box>
          <Box>
            <Typography sx={styles.typo}>密碼</Typography>
            <TextField
              fullWidth
              placeholder="請輸入密碼"
              type={showPassword ? "text" : "password"}
              InputProps={{
                sx: styles.textField,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </Box>
          <Box>
            <Button
              fullWidth
              onClick={() => onLoginButtonClick(userName)}
              sx={{
                borderRadius: "20px",
                backgroundColor: "#79ca25",
                '&.MuiButton-root:hover':{bgcolor: '#79ca25'},
                height: "40px",
              }}
              variant="contained"
            >
              登入
            </Button>
          </Box>
          <Box>
            <Button
              sx={{ color: "grey", textDecoration: "underline" }}
              variant="text"
            >
              忘記密碼
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

export default Login;
