import {
  Box,
  Button,
  Container,
  IconButton,
  Input,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import styled from "styled-components";
import logo_company from "../logo_company.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const onLoginButtonClick = () => {
    navigate("/homepage");
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(to bottom, #A8EC7E, #7EECB7,#3BD2F3)",
        display: "flex",
        height: "100vh",
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          flexGrow: "1",
        }}
      />
      <Box
        sx={{
          padding: "40px",
          borderRadius: "20px",
          flexDirection: "column",
          display: "flex",
          backgroundColor: "white",
          height: "600px",
          width: "400px",
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
            <Typography sx={{ color: "grey" }}>用戶名稱</Typography>
            <TextField
              fullWidth
              placeholder="請輸入用戶名稱"
              InputProps={{
                style: {
                  borderRadius: "10px",
                },
              }}
            />
          </Box>
          <Box>
            <Typography sx={{ color: "grey" }}>密碼</Typography>
            <TextField
              fullWidth
              placeholder="請輸入密碼"
              type={showPassword ? "text" : "password"}
              InputProps={{
                style: {
                  borderRadius: "10px",
                },

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box>
            <Button
              fullWidth
              onClick={onLoginButtonClick}
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
      <Box sx={{ flexGrow: "1" }} />
      <Typography sx={{ color: "white", marginBottom: "20px" }}>
        Copyright by GreenHoop 2023
      </Typography>
    </Box>
  );
};

export default Login;
