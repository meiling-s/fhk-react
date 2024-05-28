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
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ImageUploading, {
  ImageListType,
  ImageType
} from 'react-images-uploading'
import logo_company from '../../logo_company.png'
import { CAMERA_OUTLINE_ICON } from '../../themes/icons'
import CustomCopyrightSection from '../../components/CustomCopyrightSection'
import CustomField from '../../components/FormComponents/CustomField'
import CustomTextField from '../../components/FormComponents/CustomTextField'
import { getTenantById, updateTenantRegInfo } from '../../APICalls/tenantManage'
import { styles as constantStyle } from '../../constants/styles'
import { RegisterItem } from '../../interfaces/account'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../contexts/CommonTypeContainer'
import { extractError } from '../../utils/utils'
import { STATUS_CODE } from '../../constants/constant'

interface FormValues {
  [key: string]: string
}

const ImageToBase64 = (images: ImageListType) => {
  var base64: string[] = []
  images.map((image) => {
    if (image['data_url']) {
      var imageBase64: string = image['data_url'].toString()
      imageBase64 = imageBase64.split(',')[1]
      base64.push(imageBase64)
    }
  })
  return base64
}

const RegisterTenant = () => {
  const navigate = useNavigate()
  const titlePage = '登記'
  const submitLabel = ' 繼續'
  const { tenantId } = useParams()
  const [tenantIdNumber, setTenantIdNumber] = useState(null)
  const [firstForm, showFirstForm] = useState(true)
  const [secondForm, showSecondForm] = useState(false)
  const [thirdForm, showThirdForm] = useState(false)
  const [formValues, setFormValues] = useState<FormValues>({
    company_category: '',
    company_cn_name: '',
    company_en_name: '',
    company_number: '',
    contact_person: '',
    contact_person_number: ''
  })
  const [BRNImages, setBRNImages] = useState<ImageListType>([])
  const [EPDImages, setEDPImages] = useState<ImageListType>([])
  const [logoImage, setLogoImage] = useState<string | ImageType[]>([])
  const {imgSettings} = useContainer(CommonTypeContainer)

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

  useEffect(() => {
    initRegisterForm()
  }, [])

  async function initRegisterForm() {
    try {
      if (tenantId) {
        const result = await getTenantById(parseInt(tenantId))
        const data = result?.data
        console.log('initRegisterForm', data)
        setTenantIdNumber(data?.tenantId)
        setFormValues({
          company_category: data?.tenantType,
          company_cn_name: data?.companyNameTchi,
          company_en_name: data?.companyNameEng,
          company_number: data?.brNo
        })
        setEDPImages(data?.EPDImages)
        console.log(result?.data)
      }
    } catch (error:any) {
      const {state, realm} = extractError(error);
      if(state.code === STATUS_CODE[503] || !error?.response){
        return navigate('/maintenance')
      }
    }
  }

  const onChangeTextInput = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const firstImage = imageList.length > 0 ? imageList[0].data_url : ''
      setLogoImage(firstImage)
    } else if (fieldType === 'edp_contract') {
      setEDPImages(imageList)
    }
    console.log(imageList, addUpdateIndex)
  }

  const registerTenant = () => {
    if (tenantIdNumber) {
      const registerInfo: RegisterItem = {
        contactName: formValues.contact_person,
        contactNo: formValues.contact_person_number,
        // brImages: ImageToBase64(BRNImages),
        // companyLogo: Array.isArray(logoImage)
        //   ? logoImage[0]?.data_url || ''
        //   : logoImage,
        // epdImages: ImageToBase64(EPDImages)
        brImages: ['string'],
        companyLogo: 'string',
        epdImages: ['string']
      }

      const result = updateTenantRegInfo(registerInfo, tenantIdNumber)
      if (result != null) {
        console.log('result: ', result)
        navigate('/register/result')
      }
    }
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
                  onChange={onChangeTextInput}
                  value={formValues[field.name]}
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
                    field.name === 'company_image'
                      ? BRNImages
                      : typeof logoImage === 'string'
                      ? [{ data_url: logoImage }]
                      : logoImage
                  }
                  onChange={(imageList, addUpdateIndex) =>
                    onImageChange(imageList, addUpdateIndex, field.name)
                  }
                  maxNumber={imgSettings?.ImgQuantity}
                  maxFileSize={imgSettings?.ImgSize}
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
                    onChange={onChangeTextInput}
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
                value={EPDImages}
                onChange={(imageList, addUpdateIndex) =>
                  onImageChange(imageList, addUpdateIndex, field.name)
                }
                maxNumber={imgSettings?.ImgQuantity}
                maxFileSize={imgSettings?.ImgSize}
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
                onChange={onChangeTextInput}
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
    borderRadius: 2
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
