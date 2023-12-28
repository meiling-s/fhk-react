import { Box, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useState } from "react";
import logo_company from "../logo_company.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { login } from "../APICalls/login";
import { localStorgeKeyName } from "../constants/constant";
import CustomCopyrightSection from "../components/CustomCopyrightSection";
import { styles as constantStyle } from '../constants/styles'

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  //const [loginTo, setLoginTo] = useState("astd");
  const [loggingIn, setLogginIn] = useState(false);
  const [warningMsg, setWarningMsg] = useState<string>(" ");
  const navigate = useNavigate();

  const onLogin = async () => {
    setLogginIn(true);
    //login for astd testing
    var realm = '';   //default realm is astd
    var loginTo = '';

    switch(userName){
      case 'astd':
        realm = 'astd';
        loginTo = 'astd';
        break;
      case 'colPt':
        realm = 'collector';
        loginTo = 'collector';
        break;
      case 'warehouse':
        realm = 'collector';
        loginTo = 'warehouse';
        break;
      case 'collectoradmin':
        realm = 'collector';
        loginTo = 'collectoradmin';
        break;
      default:
        break;
    }

    if(realm!=''){
      const result = await login({
        username: userName,
        password: password,
        realm: 'astd'
      });
      if(result){

        setWarningMsg(" ");
        //console.log(`Token: ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`);
        localStorage.setItem(localStorgeKeyName.keycloakToken, result?.access_token || '');
        localStorage.setItem(localStorgeKeyName.role, loginTo);
        localStorage.setItem(localStorgeKeyName.username, result?.username || '');
        switch(loginTo){
          case "astd":
            navigate("/astd");
            break;
          case "collector":
            navigate("/collector");
            break;
          case "warehouse":
            navigate("/warehouse");
            break;
          default:
            break;
        }
      }
    }
    
    setLogginIn(false);
    
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box
        sx={constantStyle.loginPageBg}
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          onLogin();
        }}
      >
        <Box
          sx={constantStyle.loginBox}
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
              onChange={(event: { target: { value: React.SetStateAction<string>; }; }) => {
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
              onChange={(event: { target: { value: React.SetStateAction<string>; }; }) => {
                setPassword(event.target.value);
              }}
            />
          </Box>
          {/*<FormControl fullWidth>
            <InputLabel>Login to (for testing)</InputLabel>
            <Select
              value={loginTo}
              label="Age"
              onChange={(event) => setLoginTo(event.target.value)}
            >
              <MenuItem value={"astd"}>ASTD</MenuItem>
              <MenuItem value={"collector"}>Collector</MenuItem>
              <MenuItem value={"warehouse"}>Warehouse</MenuItem>
            </Select>
            </FormControl>*/}
          <Box>
            <LoadingButton
              fullWidth
              loading={loggingIn}
              type="submit"
              sx={{
                borderRadius: "20px",
                backgroundColor: "#79ca25",
                '&.MuiButton-root:hover':{bgcolor: '#79ca25'},
                height: "40px",
              }}
              variant="contained"
            >
              登入
            </LoadingButton>
          </Box>
          {
            warningMsg!=" "&&
              <FormHelperText>
                {warningMsg}
              </FormHelperText>
          }
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
