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
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ImageUploading, { ImageListType } from 'react-images-uploading'

import logo_company from '../../logo_company.png'
import { CAMERA_OUTLINE_ICON } from '../../themes/icons'

import CustomCopyrightSection from '../../components/CustomCopyrightSection'
import CustomField from '../../components/FormComponents/CustomField'
import CustomTextField from '../../components/FormComponents/CustomTextField'

import { styles as constantStyle } from '../../constants/styles'
import { TENANT_REGISTER_CONFIGS } from '../../constants/configs'

import * as Yup from 'yup'
import { ErrorMessage, useFormik } from 'formik'
import { useTranslation } from 'react-i18next'

interface FormValues {
  [key: string]: string
}

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

const RegisterTenant = () => {
  const navigate = useNavigate()
  const titlePage = '登記'
  const submitLabel = ' 繼續'
  const { t } = useTranslation()
  const [firstForm, showFirstForm] = useState(true)
  const [secondForm, showSecondForm] = useState(false)
  const [thirdForm, showThirdForm] = useState(false)

  const validateSchema = Yup.object().shape({})

  const [formValues, setFormValues] = useState<FormValues>({
    company_category: '',
    company_cn_name: '',
    company_en_name: ''
  })
  const [secondFormValues, setSecondFormValues] = useState<FormValues>({
    company_category: ''
  })

  const [thirdFormValue, setThirdFormValues] = useState<FormValues>({
    contact_person: '',
    contact_person_number: ''
  })
  const [EDPImages, setEDPImages] = useState<ImageListType>([])
  const [BRNImages, setBRNImages] = useState<ImageListType>([])
  const [logoImages, setLogoImages] = useState<ImageListType>([])

  const firstFormFields = [
    {
      name: 'company_category',
      label: '公司類別',
      placeholder: 'Collector'
    },
    {
      name: 'company_cn_name',
      label: '公司中文名',
      placeholder: '回收公司'
    },
    {
      name: 'company_en_name',
      label: '公司英文名',
      placeholder: 'Collector Company'
    }
  ]

  const secondformFields = [
    {
      name: 'company_number',
      label: '商業登記編號',
      placeholder: 'XY123456',
      type: 'text'
    },
    {
      name: 'company_image',
      label: '',
      placeholder: '上載商業登記圖片',
      type: 'image'
    },
    {
      name: 'company_logo',
      label: '公司logo',
      placeholder: '上載圖片',
      type: 'image'
    }
  ]

  const thirdFormFields = [
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

  const onChangeFirstForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const onChangeSecondForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const onChangeThirdForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleToSecondForm = () => {
    showFirstForm(false)
    showSecondForm(true)
  }

  const handleToThirdForm = () => {
    showSecondForm(false)
    showThirdForm(true)
  }

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
    fieldType: string
  ) => {
    if (fieldType === 'company_image') {
      setBRNImages(imageList)
    } else if (fieldType === 'company_logo') {
      setLogoImages(imageList)
    }
    console.log(imageList, addUpdateIndex)
  }

  const registerTenant = () => {
    const formData = {
      ...formValues,
      company_image: ImageToBase64(BRNImages),
      company_logo: ImageToBase64(logoImages)
    }
    console.log('Submitted:', formData)
    navigate('/register/result')
  }

  const FirstFormContent = ({}) => {
    return (
      <Box>
        <Stack spacing={4}>
          {firstFormFields.map((field) => (
            <Box key={field.name}>
              <CustomField label={field.label}>
                <CustomTextField
                  id={field.label}
                  placeholder={field.placeholder}
                  rows={1}
                  onChange={onChangeFirstForm}
                  value={''}
                  sx={{ width: '100%' }}
                ></CustomTextField>
              </CustomField>
            </Box>
          ))}
          <Box>
            <Button
              fullWidth
              onClick={handleToSecondForm}
              sx={constantStyle.buttonFilledGreen}
              variant="contained"
            >
              {submitLabel}
            </Button>
          </Box>
        </Stack>
      </Box>
    )
  }

  const SecondFormContent = ({}) => {
    return (
      <Stack spacing={2}>
        {secondformFields.map((field) => (
          <Box key={field.name}>
            {field.type === 'image' ? (
              <Box>
                <Typography sx={constantStyle.labelField}>
                  {field.label}
                </Typography>
                <ImageUploading
                  multiple
                  value={
                    field.name === 'company_image' ? BRNImages : logoImages
                  }
                  onChange={(imageList, addUpdateIndex) =>
                    onImageChange(imageList, addUpdateIndex, field.name)
                  }
                  maxNumber={TENANT_REGISTER_CONFIGS.maxBRNImages}
                  maxFileSize={TENANT_REGISTER_CONFIGS.maxImageSize}
                  dataURLKey="data_url"
                >
                  {({ imageList, onImageUpload }) => (
                    <Box className="boox">
                      <Card sx={styles.cardImg}>
                        <ButtonBase
                          sx={styles.btnBase}
                          onClick={(event) => onImageUpload()}
                        >
                          <CAMERA_OUTLINE_ICON
                            style={{ color: '#ACACAC' }}
                            fontSize="large"
                          />
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
              </Box>
            ) : (
              <Box>
                <CustomField label={field.label}>
                  <CustomTextField
                    id={field.label}
                    placeholder={field.placeholder}
                    rows={1}
                    onChange={onChangeThirdForm}
                    value={formValues[field.name]}
                    sx={{ width: '100%' }}
                  ></CustomTextField>
                </CustomField>
              </Box>
            )}
          </Box>
        ))}
        <Button
          fullWidth
          onClick={handleToThirdForm}
          sx={constantStyle.buttonFilledGreen}
          variant="contained"
        >
          {submitLabel}
        </Button>
      </Stack>
    )
  }

  const ThirdFormContent = ({}) => {
    return (
      <Stack spacing={4}>
        {thirdFormFields.map((field) => (
          <Box key={field.name}>
            <Typography sx={constantStyle.labelField}>{field.label}</Typography>
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
                    <Card sx={styles.cardImg}>
                      <ButtonBase
                        sx={styles.btnBase}
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
                onChange={onChangeThirdForm}
              />
            )}
          </Box>
        ))}
        <Button
          fullWidth
          onClick={registerTenant}
          sx={constantStyle.buttonFilledGreen}
          variant="contained"
        >
          {submitLabel}
        </Button>
      </Stack>
    )
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
        {firstForm && <FirstFormContent />}
        {secondForm && <SecondFormContent />}
        {thirdForm && <ThirdFormContent />}
      </Box>
      <div className="sm:mt-4 w-full pt-4 text-center">
        <CustomCopyrightSection />
      </div>
    </Box>
  )
}

let styles = {
  textField: {
    borderRadius: '10px',
    fontWeight: '500',
    '& .MuiOutlinedInput-input': {
      padding: '10px'
    }
  },
  imagesContainer: {
    width: '100%',
    height: 'fit-content'
  },
  image: {
    aspectRatio: '1/1',
    width: '80px',
    borderRadius: 2,
  },
  cardImg: {
    borderRadius: 2,
    backgroundColor: '#F4F4F4',
    width: '100%',
    height: 150,
    boxShadow: 'none'
  },
  btnBase: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

export default RegisterTenant
