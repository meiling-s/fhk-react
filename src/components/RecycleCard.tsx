import { Box, Modal, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import BackgroundLetterAvatars from './CustomAvatar'
import { styles } from '../constants/styles';
interface RecycleCardProps {
    name: string;
  }

const RecycleCard = ({ name, bgcolor,fontcolor,showImage,recycleName,recycleType}: { name: string, bgcolor :string , fontcolor:string,showImage:boolean,recycleName:string,recycleType:string}) => {
    
  const [open, setOpen] = useState<boolean>(false);

  const fakeImagae =[
    {imageUrl:'https://thanam.com.my/wp-content/uploads/2022/07/newspapers-g19e6b2746_1920.png'},
    {imageUrl:'https://thanam.com.my/wp-content/uploads/2022/07/newspapers-g19e6b2746_1920.png'},
    {imageUrl:'https://thanam.com.my/wp-content/uploads/2022/07/newspapers-g19e6b2746_1920.png'},
  ];
  

  return (
    <Box
    sx={{
      height: showImage?"160px":'50px',
      borderRadius: "10px",
      borderColor: "#cacaca",
      borderWidth: "1px",
      borderStyle: "solid",
      p: 2,
    }}
  >
  
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box flexDirection="row" display="flex">
        <Box alignSelf="center" sx={{ mr: "15px" }}>
          <BackgroundLetterAvatars
            name={name}
            size={33}
            backgroundColor={bgcolor}
            fontColor={fontcolor}
            fontSize="15px"
            isBold={true}
          />
        </Box>
        <Box>
          <Typography  fontWeight='bold' fontSize='20px'>{recycleName} </Typography>
          <Typography color ='#9f9f9f'>{recycleType} </Typography>
        </Box>
      </Box>
      <Box alignSelf="center">5kg</Box>
    </Box>
    {showImage&&(<Stack mt="10px" spacing={3} direction="row">
     {
        fakeImagae.map((i)=>(
          <Box
          height="100px"
          bgcolor="red"
          width="100px"
          borderRadius="10px"
        >
          <img
          src={i.imageUrl}
          alt="Example Image"
          style={{ objectFit: "cover", width: "100%", height: "100%" ,borderRadius:'5px'}}
          onClick={()=>{
            setOpen(true)
          }}
        />

        <Modal  open={open} onClose={()=>{
            setOpen(false)
          }}>
      <Box sx={styles.imageContainer}>
          <img src={i.imageUrl}  style={{ width: "100%", height: "100%" }} alt="Example Image" />
          
        </Box>
        </Modal>
      </Box>
        )
          
        )
      }
        
    </Stack>)}
 
  </Box>
  )
}

export default RecycleCard