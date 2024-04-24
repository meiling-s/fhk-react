import {
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useState } from "react";
import logo_company from "../../logo_company.png";
import { ImageListType } from "react-images-uploading";
import ImageUploadCard from "../../../components/FormComponents/ImageUploadCard";
import CustomField from "../../../components/FormComponents/CustomField";
import { useNavigate } from "react-router";

const RegisterBusiness = () => {
    
  const navigate = useNavigate();
  const [BRN, setBRN] = useState(""); //brn = Business registration no.
  const [type, setType] = useState("");
  const [BRNImages, setBRNImages] = useState<ImageListType>([]);
  const [companyLogo,setCompanyLogo] = useState<ImageListType>([])

  const ImageToBase64 = (images: ImageListType) => {
    var base64: string[] = [];
    images.map((image) => {
      if (image["data_url"]) {
        var imageBase64: string = image["data_url"].toString();
        imageBase64 = imageBase64.split(",")[1];
        console.log("dataURL: ", imageBase64);
        base64.push(imageBase64);
      }
    });
    return base64;
  };

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setBRNImages(imageList);
  };
  
  const onCompanyLogoChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setCompanyLogo(imageList);
  };
  const onContinueButtonClick = () => {
    navigate("/register/contact");
  };

  return (
    <Box
      sx={{
        backgroundImage:
          "linear-gradient(157.23deg, #A8EC7E -2.71%, #7EECB7 39.61%, #3BD2F3 107.1%)",
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
          minWidth: 300,
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
            <Typography sx={styles.typo}>商業登記編號</Typography>
            <TextField
              fullWidth
              disabled
              InputProps={{
                sx: styles.textField,
              }}
              value={BRN}
            />
          </Box>
          <ImageUploadCard
            Images={BRNImages}
            onImageChange={onImageChange}
            cardHeight={150}
            text='上載商業登記圖片'
          />
          <CustomField label="公司logo">
            <ImageUploadCard
              Images={companyLogo}
              onImageChange={onCompanyLogoChange}
              cardHeight={150}
              text='上載圖片'
            />
          </CustomField>

          <Box>
            <Button
              fullWidth
              disabled={type === "" ? true : false}
              onClick={onContinueButtonClick}
              sx={{
                borderRadius: "20px",
                backgroundColor: "#79ca25",
                "&.MuiButton-root:hover": { bgcolor: "#79ca25" },

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
}

export default RegisterBusiness;
