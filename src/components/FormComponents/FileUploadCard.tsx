import { ButtonBase, Card, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { FileUploader } from 'react-drag-drop-files';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { useTranslation } from 'react-i18next';
import PizZip from "pizzip";
import { DOMParser } from "@xmldom/xmldom";

type props = {
  onHandleUpload: (content: string) => void,
}

const FileUploadCard = (
  {
    onHandleUpload
  }:props
  ) => {
  const { t } = useTranslation();

  const str2xml = (str: any) => {
    if (str.charCodeAt(0) === 65279) {
      str = str.substr(1);
    }
    return new DOMParser().parseFromString(str, "text/xml");
  }
  
  const getParagraphs = (content: any) => {
    const zip = new PizZip(content);
    const xml = str2xml(zip.files["word/document.xml"].asText());
    const paragraphsXml = xml.getElementsByTagName("w:p");
    const paragraphs = [];
  
    for (let index = 0, len = paragraphsXml.length; index < len; index++) {
      let fullText = "";
      const textsXml = paragraphsXml[index].getElementsByTagName("w:t");
      for (let j = 0, len2 = textsXml.length; j < len2; j++) {
        const textXml = textsXml[j];
        if (textXml.childNodes) {
          fullText += textXml.childNodes[0].nodeValue;
        }
      }
      if (fullText) {
        paragraphs.push(fullText);
      }
    }
    return paragraphs;
  }

  const handleChangeFile = (file: any) => {
    const reader = new FileReader();
    
    if(file['type'] === 'text/plain') {
      reader.onload = (event) => {
        const content = event?.target?.result;
        if(content){
          onHandleUpload(content?.toString())
        }
      };
      reader.onerror = (err) => console.error(err);
      reader.readAsText(file);
      
    } else {
      reader.onload = (event) => {
        const result = event?.target?.result;
        const content = getParagraphs(result);
        if(content){
          onHandleUpload(content.toString())
        }
        
      };
      reader.onerror = (err) => console.error(err);
      reader.readAsBinaryString(file);
    }
  };

  return (
      <FileUploader
      handleChange={handleChangeFile}
      types={['docx', 'txt']}
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
                <Typography sx={styles.typo} style={{fontSize: 'large'}}>{t(`notification.drag_drop_content`)}</Typography>
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