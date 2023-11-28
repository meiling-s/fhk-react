import { Alert, Box } from '@mui/material';
import React, { ChangeEvent, useState } from 'react'

import BackgroundLetterAvatars from '../../components/CustomAvatar';

const Report = () => {
  const [images, setImages] = useState<File[]>([]);
    const [showAlert, setShowAlert] = useState<boolean>(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (files.length > 3) {
        setShowAlert(true)
        return; // Exit the function if more than 3 images are selected
      }

      const selectedImages = Array.from(files);
      setImages(selectedImages);
    }
  };
  return (
    <div>
      <Box>
      <BackgroundLetterAvatars
            name='2'
            size={23}
            backgroundColor='green'
            fontColor='white'
            fontSize="15px"
            isBold={true}
          />
      </Box>
    {showAlert && (
      <Alert severity="error" onClose={() => setShowAlert(false)}>
        You can only upload a maximum of three images.
      </Alert>
    )}
    <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
    {images.map((image, index) => (
      <img key={index} src={URL.createObjectURL(image)} alt={`uploaded-${index}`} />
    ))}
  
  </div>
  )
}

export default Report
