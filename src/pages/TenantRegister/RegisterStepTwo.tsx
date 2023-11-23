import { useEffect, useState } from 'react'
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
} from '@mui/material'
import logo_company from '../../logo_company.png'
import { CAMERA_OUTLINE_ICON } from '../../themes/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import CustomCopyrightSection from '../../components/CustomCopyrightSection'
import { styles as constantStyle } from '../../constants/styles'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { TENANT_REGISTER_CONFIGS } from '../../constants/configs'
import { getTenantById } from '../../APICalls/tenantManage'

interface FormValues {
  [key: string]: string
}

//move to utils
const ImageToBase64 = (images: ImageListType) => {
  var base64: string[] = []
  images.map((image) => {
    if (image['data_url']) {
      var imageBase64: string = image['data_url'].toString()
      imageBase64 = imageBase64.split(',')[1]
      //   console.log('dataURL: ', imageBase64)
      base64.push(imageBase64)
    }
  })
  return base64
}

const RegisterStepTwo = () => {
  const navigate = useNavigate()
  const titlePage = '登記'
  const submitBtn = ' 繼續'
  const [formValues, setFormValues] = useState<FormValues>({
    contact_person: '',
    contact_person_number: ''
  })
  const [EDPImages, setEDPImages] = useState<ImageListType>([])

  const formFields = [
    {
      name: 'contact_person',
      label: '聯絡人姓名',
      placeholder: '請輸入姓名',
      type: 'text'
    },
    {
      name: 'contact_person_number',
      label: '聯絡人手機號碼',
      placeholder: '請輸入手機號碼',
      type: 'text'
    },
    {
      name: 'edp_contract',
      label: 'EPD 合約（可上傳多張合約）',
      placeholder: '上載圖片',
      type: 'image'
    }
  ]

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
    fieldType: string
  ) => {
    setEDPImages(imageList)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const continueNextStep = () => {
    const formData = {
      ...formValues,
      edp_contract: ImageToBase64(EDPImages)
    }
    console.log('Submitted:', formData)
    navigate('/register/result')
  }

  return (
    <Box sx={constantStyle.loginPageBg}>
      <Box sx={constantStyle.loginBox}>
        <img src={logo_company} alt="logo_company" style={{ width: '70px' }} />
        <Typography
          sx={{ marginTop: '30px', marginBottom: '30px' }}
          fontWeight="bold"
          variant="h6"
        >
          {titlePage}
        </Typography>
        <Stack spacing={4}>
          {formFields.map((field) => (
            <Box key={field.name}>
              <Typography sx={constantStyle.labelField}>
                {field.label}
              </Typography>
              {field.type === 'image' ? (
                <ImageUploading
                  multiple
                  value={EDPImages}
                  onChange={(imageList, addUpdateIndex) =>
                    onImageChange(imageList, addUpdateIndex, field.name)
                  }
                  maxNumber={TENANT_REGISTER_CONFIGS.maxBRNImages}
                  maxFileSize={TENANT_REGISTER_CONFIGS.maxImageSize}
                  dataURLKey="data_url"
                >
                  {({ imageList, onImageUpload }) => (
                    <Box className="box">
                      <Card
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#F4F4F4',
                          width: '100%',
                          height: 150,
                          boxShadow: 'none'
                        }}
                      >
                        <ButtonBase
                          sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={(event) => onImageUpload()}
                        >
                          <CAMERA_OUTLINE_ICON style={{ color: '#ACACAC' }} />
                          <Typography
                            sx={[
                              constantStyle.labelField,
                              { fontWeight: 'bold' }
                            ]}
                          >
                            {field.placeholder}
                          </Typography>
                        </ButtonBase>
                      </Card>
                      <ImageList sx={styles.imagesContainer} cols={3}>
                        {imageList.map((image) => (
                          <ImageListItem key={image['file']?.name}>
                            
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
              ) : (
                <TextField
                  fullWidth
                  placeholder={field.placeholder}
                  name={field.name}
                  value={formValues[field.name]}
                  InputProps={{
                    sx: styles.textField
                  }}
                  onChange={handleInputChange}
                />
              )}
            </Box>
          ))}
          <Button
            fullWidth
            onClick={continueNextStep}
            sx={{
              borderRadius: '20px',
              backgroundColor: '#79ca25',
              '&.MuiButton-root:hover': { bgcolor: '#79ca25' },
              height: '40px'
            }}
            variant="contained"
          >
            {submitBtn}
          </Button>
        </Stack>
      </Box>
      <CustomCopyrightSection />
    </Box>
  )
}

let styles = {
  imagesContainer: {
    width: '100%',
    height: 'fit-content'
  },
  image: {
    aspectRatio: '1/1'
  },
  textField: {
    borderRadius: '10px',
    fontWeight: '500',
    '& .MuiOutlinedInput-input': {
      padding: '10px'
    }
  }
}

export default RegisterStepTwo
