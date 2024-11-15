import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  Card,
  ButtonBase,
  ImageList,
  ImageListItem
} from "@mui/material";
import logo_company from "../../logo_company.png";
import { useNavigate, useParams } from "react-router-dom";
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CustomCopyrightSection from "../../../components/CustomCopyrightSection";
import { useEffect, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'

const ImageToBase64 = (images: ImageListType) => {
  var base64: string[] = [];
  images.map((image) => {
    if(image['data_url']){
      var imageBase64: string = image['data_url'].toString();
      imageBase64 = imageBase64.split(',')[1];
      console.log("dataURL: ",imageBase64);
      base64.push(imageBase64);
    }
  })
  return base64;
}

const CompanyDetails = () => {

  const navigate = useNavigate();
  const { inviteId } = useParams();
  const [type, setType] = useState("");
  const [ChiName, setChiName] = useState("");
  const [EngName, setEngName] = useState("");
  const [BRN, setBRN] = useState("");   //brn = Business registration no.
  const [BRNImages, setBRNImages] = useState<ImageListType>([]);
  const {imgSettings} = useContainer(CommonTypeContainer)

  const onImageChange = (imageList: ImageListType, addUpdateIndex: number[]|undefined) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setBRNImages(imageList);
  };

  useEffect(()=>{
    initInviteForm();
  },[]);

  async function initInviteForm() {
    console.log('invite id: '+inviteId);
    // if(inviteId){
    //   const result = await getTenantById());
    //   const data = result?.data;
    //   setChiName(data?.companyNameTchi);
    //   setEngName(data?.companyNameEng);
    //   setBRN(data?.brNo);
    //   setType(data?.tenantType);
    //   console.log(result?.data);
    // }
  }

  const formData = () => {
    const item = {
      //type, ChiName, EngName, BRN doesn't require to upload to the server
      BRNImages: ImageToBase64(BRNImages),
      inviteId: inviteId
    }
    return item;
  }

  const onContinueButtonClick = () => {
    navigate("/register/contact",{state:formData()});
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
            <Typography sx={styles.typo}>商業登記編號</Typography>
            <TextField
              fullWidth
              disabled
              InputProps={{
                  sx: styles.textField
              }}
              value={BRN}
            />
          </Box>

          <ImageUploading
            multiple
            value={BRNImages}
            onChange={onImageChange}
            maxNumber={imgSettings?.ImgQuantity}
            maxFileSize={imgSettings?.ImgSize}
            dataURLKey="data_url"
            acceptType={['jpg', 'jpeg', 'png']}
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              <Box>
                <Card sx={{
                  borderRadius: 2,
                  backgroundColor: "#F4F4F4",
                  width: "100%",
                  height: 120,
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
                    onClick={event => onImageUpload()}>
                    <CameraAltOutlinedIcon style={{color: "#ACACAC"}}/>
                    <Typography sx={[styles.typo,{fontWeight: "bold"}]}>上載商業登記圖片</Typography>
                  </ButtonBase>
                </Card>
                <ImageList sx={styles.imagesContainer} cols={3} >
                  {imageList.map((image) => (
                    <ImageListItem  key={image['file']?.name}>
                      <img
                        style={styles.image}
                        src={image['data_url']}
                        alt={image['file']?.name}
                        loading="lazy"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}
          </ImageUploading>
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
  },
  imagesContainer: {
    width: "100%",
    height: "fit-content"
  },
  image: {
    aspectRatio: '1/1'
  }
}

export default CompanyDetails;
  