import { ButtonBase, Card, ImageList, ImageListItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { useContainer } from 'unstated-next';
import CommonTypeContainer from '../../contexts/CommonTypeContainer'


const ImageUploadCard = ({Images,onImageChange,cardHeight,text}:{Images:ImageListType, onImageChange :(imageList: ImageListType, addUpdateIndex: number[]|undefined)=> void,cardHeight?:number,text?:string}) => {
  const {imgSettings} = useContainer(CommonTypeContainer)
  return (
    <Box>
    {/* <Typography sx={styles.typo}>EPD 合約（可上傳多張合約)</Typography> */}
    <ImageUploading
      multiple
      value={Images}
      onChange={onImageChange}
      maxNumber={imgSettings?.ImgQuantity}
      maxFileSize={imgSettings?.ImgSize}
      onError={(errors, files)=>{
        console.log("error: ",errors);
      }}
      dataURLKey="data_url"
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
              height:cardHeight,
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
                <Typography sx={styles.typo}>{text}</Typography>
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
  )
}

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
export default ImageUploadCard