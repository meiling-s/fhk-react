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
import { useNavigate, useParams } from "react-router-dom";
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CustomCopyrightSection from "../../components/CustomCopyrightSection";
  
const CompanyDetails = () => {
  const navigate = useNavigate();
  const { inviteID } = useParams();

  //should use the invite ID to ask for the data from DB
  var type = "", cName = "", eName = "", brn = "";    //brn = Business registration no.
  if(inviteID === "testinviteID"){
    type = "Collector";
    cName = "回收公司";
    eName = "Collector Company";
    brn = "XY123456";
  }

  const onContinueButtonClick = () => {
    navigate("/register/contact");
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
              value={cName}
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
              value={eName}
            />
          </Box>
          <Box>
            <Typography sx={styles.typo}>商業登記編號</Typography>
            <TextField
              fullWidth
              disabled
              InputProps={{
                  sx: styles.textField
              }}
              value={brn}
            />
          </Box>

          <Card sx={{
            borderRadius: 2,
            backgroundColor: "#F4F4F4",
            width: "100%",
            height: 120,
          }}>
            <ButtonBase
              disabled={ type === "" ? true : false }
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
              <Typography sx={[styles.typo,{fontWeight: "bold"}]}>上載商業登記圖片</Typography>
            </ButtonBase>
          </Card>

          <Box>
            <Button
              fullWidth
              disabled={ type === "" ? true : false }
              onClick={onContinueButtonClick}
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

export default CompanyDetails;
  