import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import { logisticList } from '../../interfaces/common';
import { getLogisticlist } from '../../APICalls/Collector/pickupOrder/pickupOrder';
import { useContainer } from 'unstated-next';
import CommonTypeContainer from '../../contexts/CommonTypeContainer';
import CustomAutoComplete from '../../components/FormComponents/CustomAutoComplete';

const Staff = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
 



  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedImage(file);
  };

  
  const fileChangedHandler = (selectedImage: File | null) => {
    if (selectedImage) {
      const maxSizeBytes = 200 * 1024; // Maximum file size in bytes (200KB)
      if (selectedImage.size > maxSizeBytes) {
        try {
          Resizer.imageFileResizer(
            selectedImage,
            300,
            300,
            'JPEG',
            100,
            0,
            (uri) => {
              // console.log(uri);
              setResizedImage(String(uri));
            },
            'base64',
            200,
            200
          );
        } catch (err) {
          console.log(err);
        }
      }
    }
  };
  
  useEffect(() => {
    fileChangedHandler(selectedImage);
  }, [selectedImage]);
  
 
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {resizedImage ? (
        <img src={resizedImage} alt="Resized" />
      ) : selectedImage && (
        <img src={URL.createObjectURL(selectedImage)} alt="Resized" />
      )}
      
      {/* <Autocomplete
        freeSolo
        disableClearable
        options={logisticList?.map((option) => option.logisticNameTchi)??[]}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search input"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )} 
      /> */}
      
    </div>
  );
};

export default Staff;