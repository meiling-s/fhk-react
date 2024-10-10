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
import { useLocation } from "react-router-dom";
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import CustomCopyrightSection from "../../../components/CustomCopyrightSection";
import { useEffect, useState } from "react";
import ImageUploading, { ImageListType } from 'react-images-uploading';
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

const TenantRegisterForm2 = () => {

  const {state} = useLocation();
  const { BRNImages } = state;
  const [contactName, setContactName] = useState<string>("");
  const [contactNo, setContactNo] = useState<string>("");
  const [EPDImages, setEPDImages] = useState<ImageListType>([]);
  const {imgSettings} = useContainer(CommonTypeContainer)

  const onRegisterButtonClick = async () => {
    // const registerInfo: RegisterItem = {
    //   contactName: contactName,
    //   contactNo: contactNo,
    //   BRNImages: BRNImages,
    //   EPDImages: ImageToBase64(EPDImages)
    // };
    // const result = updateTenantRegInfo(registerInfo,inviteId);
    // if(result!=null){
    //   console.log("result: ",result);
    //   navigate("/register/result");
    // }
  };

  const onImageChange = (imageList: ImageListType, addUpdateIndex: number[]|undefined) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setEPDImages(imageList);
  };

  useEffect(()=>{
    console.log(BRNImages,contactName,contactNo);
  },[contactName,contactNo])

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
              onChange={(event) => setContactName(event.target.value)}
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
              onChange={(event) => setContactNo(event.target.value)}
              InputProps={{
                  sx: styles.textField
              }}
            />
          </Box>

          <Box>
              <Typography sx={styles.typo}>EPD 合約（可上傳多張合約)</Typography>
              <ImageUploading
                multiple
                value={EPDImages}
                onChange={onImageChange}
                maxNumber={imgSettings?.ImgQuantity}
                maxFileSize={imgSettings?.ImgSize}
                onError={(errors, files)=>{
                  console.log("error: ",errors);
                }}
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
                        onClick={event => onImageUpload()}>
                          <CameraAltOutlinedIcon style={{color: "#ACACAC"}}/>
                          <Typography sx={styles.typo}>上載圖片</Typography>
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
  },
  imagesContainer: {
    width: "100%",
    height: "fit-content"
  },
  image: {
    aspectRatio: '1/1'
  }
}

export default TenantRegisterForm2;
  