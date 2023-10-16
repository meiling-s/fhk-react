import * as React from 'react';
import Avatar from '@mui/material/Avatar';




function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: '#79ca25',
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export default function BackgroundLetterAvatars({name,size}:{name:string,size?:number}) {
  return (
      <Avatar {...stringAvatar(name)} style= {{width:size,height:size}} />
  );
}