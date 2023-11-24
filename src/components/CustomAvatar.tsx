import * as React from 'react';
import Avatar from '@mui/material/Avatar';
 
 
 
 
function stringAvatar(name: string, backgroundColor: string,fontColor?:string,fontSize?:string,isBold?:boolean) {
  return {
    sx: {
      bgcolor: backgroundColor,
      color:fontColor,
      fontSize:fontSize,
      fontWeight:isBold?'bold':'null'
     
     
    },
    children: name.split(' ').map(word => word[0]).join(''),
  };
}
 
export default function BackgroundLetterAvatars({ name, size, backgroundColor,fontColor,fontSize,isBold}: { name: string; size?: number; backgroundColor: string;fontColor?:string; fontSize?:string;isBold?:boolean}) {
  return (
    <Avatar {...stringAvatar(name, backgroundColor,fontColor,fontSize,isBold)} style={{ width: size, height: size }} />
  );
}