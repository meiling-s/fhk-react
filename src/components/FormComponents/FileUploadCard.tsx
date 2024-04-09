import { ButtonBase, Card, ImageList, ImageListItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FileUploader } from 'react-drag-drop-files';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { useTranslation } from 'react-i18next';

type props = {
  onHandleUpload: (s: string) => void,
}

const FileUploadCard = (
  {
    onHandleUpload
  }:props
  ) => {
  const { t } = useTranslation();

  const handleChangeFile = (file: any) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const result = event?.target?.result;
        if(result){
          onHandleUpload(result.toString())
        }
    };

    reader.readAsText(file);
  };

  return (
      <FileUploader
      handleChange={handleChangeFile}
      >
        <Box sx={{width: 300}}>
          <Card sx={{
              width: "100%",
              borderRadius: 2,
              backgroundColor: '#E3E3E3',
              height: 150,
              boxShadow: 'none'
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
              >
                <CloudUploadOutlinedIcon style={{color: "#ACACAC"}}/>
                <Typography sx={styles.typo} style={{fontSize: 'large'}}>{t(`notification.upload`)}</Typography>
            </ButtonBase>
          </Card>
        </Box>
      </FileUploader>
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
export default FileUploadCard