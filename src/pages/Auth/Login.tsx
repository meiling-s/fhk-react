import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  // InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import logo_company from "../../logo_company.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { useNavigate } from "react-router-dom";
import { login } from "../../APICalls/login";
import {
  MAINTENANCE_STATUS,
  STATUS_CODE,
  localStorgeKeyName,
} from "../../constants/constant";
import CustomCopyrightSection from "../../components/CustomCopyrightSection";
import { styles as constantStyle } from "../../constants/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import { useTranslation } from "react-i18next";
import jwtDecode from "jwt-decode";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import { setLanguage } from "../../setups/i18n";
import { extractError, returnApiToken } from "../../utils/utils";
import { getTenantById } from "../../APICalls/tenantManage";
import { parseJwtToken } from "../../constants/axiosInstance";
import NotifContainer from "../../contexts/NotifContainer";
import axios from "axios";
import { createUserActivity } from "../../APICalls/userAccount";
import { UserActivity } from "../../interfaces/common";
import JSEncrypt from "jsencrypt";
import { getUserAccountById } from "src/APICalls/Collector/userGroup";

const Login = () => {
  const { i18n } = useTranslation();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  //const [loginTo, setLoginTo] = useState('astd')
  const [loggingIn, setLogginIn] = useState(false);
  const [warningMsg, setWarningMsg] = useState<string>(" ");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const commonTypeContainer = useContainer(CommonTypeContainer);
  const { initBroadcastMessage } = useContainer(NotifContainer);
  const [publicKey, setPublicKey] = useState("");
  // overwrite select style
  //todo : make select as component
  const BootstrapInput = styled(InputBase)(({ theme }) => ({
    "label + &": {
      marginTop: theme.spacing(3),
    },
    "& .MuiInputBase-input": {
      border: "1px solid rgba(0, 0, 0, 0.23)",
      borderRadius: 8,
      padding: 8,
    },
  }));

  useEffect(() => {
    fetchPublicKey();
  }, []);

  const fetchPublicKey = async () => {
    try {
      const response = await fetch(
        `${window.baseURL.collector}api/v1/administrator/getPublicKey`
      );
      if (response.ok) {
        const publicKeyPem = await response.text();
        setPublicKey(publicKeyPem);
      } else {
        console.log("Failed to fetch public key, retrying...");
        setTimeout(fetchPublicKey, 3000); // Retry after 3 seconds
      }
    } catch (error) {
      console.log("Error fetching public key:", error);
      setTimeout(fetchPublicKey, 3000); // Retry after 3 seconds
    }
  };

  const handleEncrypt = async (userName: string, password: string) => {
    if (!userName || !password) {
      setWarningMsg("Username and password are required.");
      return;
    }
    await encryptData(userName, password);
  };

  const encryptData = async (userName: string, password: string) => {
    if (!publicKey) {
      console.log("No public key available, trying to fetch it again...");
      await fetchPublicKey();
    }

    if (publicKey) {
      const encryptor = new JSEncrypt();
      encryptor.setPublicKey(publicKey);
      const encrypted = encryptor.encrypt(password);
      if (encrypted) {
        onLoginButtonClick(userName, encrypted);
      } else {
        setWarningMsg("Encryption failed. Please try again.");
      }
    } else {
      setWarningMsg("Public key is not available. Please try again later.");
    }
  };

  const getTenantData = async () => {
    const token = returnApiToken();
    const result = await getTenantById(parseInt(token.tenantId));
    const data = result?.data;
    const lang = data?.lang || "ZH-HK";
    return lang;
  };

  const getUserDetail = async (loginId: string) => {
    const result = await getUserAccountById(loginId);
    if (result) {
      return result.data;
    }

    return null;
  };

  const removeNonJsonChar = (dataString: string) => {
    return dataString.substring(
      dataString.indexOf("{"),
      dataString.lastIndexOf("}") + 1
    );
  };

  const getIpAddress = async () => {
    const response = await axios.get("https://api.ipify.org/?format=json");
    if (response) {
      localStorage.setItem("ipAddress", response?.data?.ip);
    }
  };

  const returnErrCode = (error: any) => {
    const response = error.response.data.message;
    const errMsgString = removeNonJsonChar(response);
    const errMsgJSON = JSON.parse(errMsgString);
    if (errMsgJSON.message) {
      const errSecondInnerString = removeNonJsonChar(errMsgJSON.message);
      try {
        const result = JSON.parse(errSecondInnerString);
        return result.errorCode;
      } catch (e: any) {
        return e.response.data.status;
      }
    } else {
      return errMsgJSON.errorCode;
    }
  };

  const onLoginButtonClick = async (userName: string, password: string) => {
    try {
      setLogginIn(true);
      //login for astd testing
      var realm = "astd"; //default realm is astd
      var loginTo = "astd";

      if (realm != "") {
        const result = await login({
          username: userName.toLowerCase(),
          password: password,
        });
        //console.log(result, 'result login')
        if (result && result.access_token) {
          localStorage.setItem(localStorgeKeyName.role, result?.realm || "");
          const ipAddress = localStorage.getItem("ipAddress");
          if (ipAddress) {
            const userActivity: UserActivity = {
              operation: "Login",
              ip: ipAddress,
              createdBy: userName,
              updatedBy: userName,
            };
            createUserActivity(userName, userActivity);
          }
          // await initBroadcastMessage();
          setWarningMsg(" ");
          localStorage.setItem(
            localStorgeKeyName.keycloakToken,
            result?.access_token || ""
          );
          localStorage.setItem(
            localStorgeKeyName.refreshToken,
            result?.refresh_token || ""
          );
          localStorage.setItem(localStorgeKeyName.realm, result?.realm || "");
          localStorage.setItem(
            localStorgeKeyName.username,
            result?.username || ""
          );
          // 20240129 add function list daniel keung start
          const functionList = result?.functionList || [];
          const uniqueFunctionList = Array.from(new Set(functionList));

          localStorage.setItem(
            localStorgeKeyName.functionList,
            JSON.stringify(uniqueFunctionList)
          );
          // 20240129 add function list daniel keung end
          const decodedToken: any = jwtDecode(result?.access_token);
          const azpValue = decodedToken.azp;
          localStorage.setItem(
            localStorgeKeyName.decodeKeycloack,
            azpValue || ""
          );

          //set isAdmin status
          const userAccount = await getUserDetail(userName);
          const isAdmin = userAccount ? userAccount.userGroup.isAdmin : false;
          localStorage.setItem(localStorgeKeyName.isAdmin, isAdmin);

          // 20240129 add function list daniel keung start
          const tenantID = azpValue.substring(7);
          localStorage.setItem(localStorgeKeyName.tenantId, tenantID || "");
          loginTo = result?.realm;
          // 20240129 add function list daniel keung end
          let realmApiRoute = "";
          switch (loginTo) {
            case "astd":
              realmApiRoute = "account";
              window.location.href = "/astd";
              break;
            case "collector":
              realmApiRoute = "collectors";
              window.location.href = "/collector";
              break;
            case "logistic":
              realmApiRoute = "logistic";
              window.location.href = "/logistic/pickupOrder";
              break;
            case "manufacturer":
              realmApiRoute = "manufacturer";
              window.location.href = "/manufacturer/pickupOrder";
              break;
            case "customer":
              realmApiRoute = "customer";
              window.location.href = "/customer/account";
              break;
            default:
              realmApiRoute = "collectors";
              break;
          }
          localStorage.setItem(localStorgeKeyName.realmApiRoute, realmApiRoute);

          //set selected lang
          const tenantLang = await getTenantData();
          const selectedLang = getSelectedLanguange(tenantLang);

          localStorage.setItem(
            localStorgeKeyName.selectedLanguage,
            selectedLang
          );
          i18n.changeLanguage(selectedLang);
          setLanguage(selectedLang);

          commonTypeContainer.updateCommonTypeContainer();
        } else {
          // if(errCode === STATUS_CODE[503]){
          //   return navigate('/maintenance')
          // } else if (errCode == '004') {
          //   //navigate to reset pass firsttime login
          //   localStorage.setItem(localStorgeKeyName.firstTimeLogin, 'true')
          //   return navigate('/changePassword')
          // }
          // setWarningMsg(t(`login.err_msg_${errCode}`))
          //   if (errCode == '004') {
          //       //navigate to reset pass firsttime login
          //       localStorage.setItem(localStorgeKeyName.firstTimeLogin, 'true')
          //       return navigate('/changePassword')
          //     }
          //     setWarningMsg(t(`login.err_msg_${errCode}`))
        }
      }

      setLogginIn(false);
    } catch (error: any) {
      setLogginIn(false);
      /**Handling err for response 503 maintenance system */
      const { state } = extractError(error);
      if (state.code === STATUS_CODE[503]) {
        navigate("/maintenance");
      } else {
        /**handling err code from BE for reset PW and showing err category */
        if (error?.response) {
          const errCode = returnErrCode(error);
          if (errCode === "004" || errCode === "005") {
            localStorage.setItem(localStorgeKeyName.firstTimeLogin, "true");
            return navigate("/changePassword");
          }
          setWarningMsg(t(`login.err_msg_${errCode}`));
        }
      }
    }
  };

  const getSelectedLanguange = (lang: string) => {
    var selectedLang = "zhhk";
    switch (lang) {
      case "ZH-HK":
        selectedLang = "zhhk";
        break;
      case "ZH-CH":
        selectedLang = "zhch";
        break;
      case "EN-US":
        selectedLang = "enus";
        break;
      default:
        selectedLang = "zhhk";
        break;
    }

    return selectedLang;
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const navigateToForgotPassword = () => {
    navigate("/resetPassword");
  };

  useEffect(() => {
    const access_token =
      localStorage.getItem(localStorgeKeyName.keycloakToken) || "";
    const refresh_token =
      localStorage.getItem(localStorgeKeyName.refreshToken) || "";
    if (access_token) {
      const decodedRefreshToken = parseJwtToken(refresh_token, 1);
      const currentTime = Date.now() / 1000;
      // only need to check refresh token, bcs when refresh token expired then system can't do anything.
      // when access token expired, system can get new access token when hit any api.
      if (decodedRefreshToken.exp < currentTime) {
        localStorage.clear();
      } else {
        const role = localStorage.getItem(localStorgeKeyName.realm);
        switch (role) {
          case "astd":
            window.location.href = "/astd";
            break;
          case "collector":
            window.location.href = "/collector";
            break;
          case "logistic":
            window.location.href = "/logistic/pickupOrder";
            break;
          case "manufacturer":
            window.location.href = "/manufacturer/pickupOrder";
            break;
          case "customer":
            window.location.href = "/customer/account";
            break;
          default:
            break;
        }
      }
    }
    getIpAddress();
  }, []);

  return (
    <Box
      sx={constantStyle.loginPageBg}
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        handleEncrypt(userName, password);
      }}
    >
      <Box sx={constantStyle.loginBox}>
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
              data-testid="astd-username-input"
              fullWidth
              placeholder="請輸入用戶名稱"
              InputProps={{
                sx: styles.textField,
              }}
              onChange={(event: {
                target: { value: React.SetStateAction<string> };
              }) => {
                setUserName(event.target.value);
              }}
            />
          </Box>
          <Box>
            <Typography sx={styles.typo}>密碼</Typography>
            <TextField
              data-testid="astd-pass-input"
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
              onChange={(event: {
                target: { value: React.SetStateAction<string> };
              }) => {
                setPassword(event.target.value);
              }}
            />
          </Box>
          <Box>
            <LoadingButton
              data-testid="astd-login-btn"
              fullWidth
              loading={loggingIn}
              type="submit"
              sx={{
                borderRadius: "20px",
                backgroundColor: "#79ca25",
                "&.MuiButton-root:hover": { bgcolor: "#79ca25" },
                height: "40px",
              }}
              variant="contained"
            >
              登入
            </LoadingButton>
          </Box>
          {warningMsg != " " && (
            <FormHelperText data-testid="astd-err-login" error>
              {warningMsg}
            </FormHelperText>
          )}
          <Box>
            <Button
              sx={{ color: "grey", textDecoration: "underline" }}
              variant="text"
              onClick={navigateToForgotPassword}
            >
              忘記密碼
            </Button>
          </Box>
        </Stack>
      </Box>
      <div className="sm:mt-4 w-full pt-4 text-center">
        <CustomCopyrightSection />
      </div>
    </Box>
  );
};

let styles = {
  typo: {
    color: "grey",
    fontSize: 14,
  },
  textField: {
    borderRadius: "10px",
    fontWeight: "500",
    "& .MuiOutlinedInput-input": {
      padding: "10px",
    },
  },
};

export default Login;
