import { FunctionComponent, useCallback, ReactNode, useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  ButtonBase,
  ImageList,
  ImageListItem,
  Divider
} from '@mui/material'
import ImageUploading, {
  ImageListType,
  ImageType
} from 'react-images-uploading'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useTranslation } from 'react-i18next'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import CustomTextField from '../../../components/FormComponents/CustomTextField'
import CustomField from '../../../components/FormComponents/CustomField'

import { styles } from '../../../constants/styles'
import { CAMERA_OUTLINE_ICON } from '../../../themes/icons'

import { TENANT_REGISTER_CONFIGS } from '../../../constants/configs'
import dayjs, { Dayjs } from 'dayjs'
import { Field } from 'formik'
import { createServiceInfo } from '../../../APICalls/serviceInfo'
import { ServiceInfo, photoService } from '../../../interfaces/serviceInfo'
import { ToastContainer, toast } from 'react-toastify'

type ServiceId = 'SRV00002' | 'SRV00003' | 'SRV00004' | 'SRV00005'
type ServiceData = Record<
  ServiceId,
  {
    startDate: Dayjs | null
    endDate: Dayjs | null
    place: string
    numberOfPeople: number
    photoImage: ImageListType
  }
>

const AdditionalServicePict: FunctionComponent = () => {
  const { t } = useTranslation()
  const [serviceData, setServiceData] = useState<ServiceData>({
    SRV00002: {
      startDate: dayjs('2023-01-01'),
      endDate: dayjs('2023-01-01'),
      place: '',
      numberOfPeople: 0,
      photoImage: []
    },
    SRV00003: {
      startDate: dayjs('2023-01-01'),
      endDate: dayjs('2023-01-01'),
      place: '',
      numberOfPeople: 0,
      photoImage: []
    },
    SRV00004: {
      startDate: dayjs('2023-01-01'),
      endDate: dayjs('2023-01-01'),
      place: '',
      numberOfPeople: 0,
      photoImage: []
    },
    SRV00005: {
      startDate: dayjs('2023-01-01'),
      endDate: dayjs('2023-01-01'),
      place: '',
      numberOfPeople: 0,
      photoImage: []
    }
  })

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
    serviceId: ServiceId
  ) => {
    setServiceData((prevData) => ({
      ...prevData,
      [serviceId]: { ...prevData[serviceId], photoImage: imageList }
    }))
    console.log(`Updated image list for ${serviceId}:`, imageList)
  }

  const updateData = (serviceId: ServiceId, property: string, value: any) => {
    setServiceData((prevData) => ({
      ...prevData,
      [serviceId]: {
        ...prevData[serviceId],
        [property]: value
      }
    }))
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

  const AdditionalService = [
    {
      serviceId: 'SRV00002',
      label: '回收點'
    },
    {
      serviceId: 'SRV00003',
      label: '其他回收地點'
    },
    {
      serviceId: 'SRV00004',
      label: '社區回收地點'
    },
    {
      serviceId: 'SRV00005',
      label: '宣傳及教育活動地點'
    }
  ]

  const [trySubmited, setTrySubmited] = useState<boolean>(false)

  //validation function
  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const submitServiceInfo = async () => {
    let itemData = 0
    for (const key of Object.keys(serviceData) as ServiceId[]) {
      const serviceItem = serviceData[key]
      const imgList: photoService[] = ImageToBase64(serviceItem.photoImage).map(
        (item) => {
          return { photo: item }
        }
      )

      const formData: ServiceInfo = {
        serviceId: 3,
        address: serviceItem.place,
        addressGps: [0],
        serviceName: key,
        participants: 'string',
        startAt: '2024-01-26T12:37:31.581Z',
        endAt: '2024-01-26T12:37:31.581Z',
        photo: imgList,
        numberOfVisitor: serviceItem.numberOfPeople,
        createdBy: 'admin',
        updatedBy: 'admin'
      }
      const result = await createServiceInfo(formData)
      if (result) itemData++
    }

    if (itemData === 4) {
      console.log('itemData', itemData)
      const toastMsg = 'created additional service success'
      toast.info(toastMsg, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      })
    }
  }

  return (
    <Box className="container-wrapper w-full">
      <ToastContainer></ToastContainer>
      <div className="settings-page bg-bg-primary">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          {AdditionalService.map((item, index) => (
            <Grid
              container
              direction={'column'}
              spacing={2.5}
              sx={{
                width: { sm: '100%', xs: '100%' },
                marginTop: { sm: 1, xs: 6 },
                marginLeft: {
                  xs: 0
                }
              }}
              className="sm:ml-0 mt-o w-full"
            >
              <Grid
                container
                direction={'column'}
                spacing={2.5}
                sx={{
                  width: { sm: '384px', xs: '100%' },
                  marginTop: { sm: 1, xs: 6 },
                  marginLeft: {
                    xs: 0
                  }
                }}
                className="sm:ml-0 mt-o w-full"
              >
                <Grid item>
                  <Typography sx={styles.header2}>{'回收點'}</Typography>
                </Grid>
                <Grid item>
                  <Typography sx={styles.header3}>{'日期及時間'}</Typography>
                  <Box sx={{ ...localstyles.DateItem }}>
                    <DatePicker
                      value={
                        serviceData[item.serviceId as keyof ServiceData]
                          .startDate
                      }
                      //onChange={(newValue: any) => setStartDate(newValue)}
                      sx={{ ...localstyles.datePicker }}
                    />
                  </Box>
                </Grid>
                <Grid item>
                  <Typography sx={styles.header3}>{'至'}</Typography>
                  <Box sx={{ ...localstyles.DateItem }}>
                    <DatePicker
                      value={
                        serviceData[item.serviceId as keyof ServiceData].endDate
                      }
                      //onChange={(newValue: any) => setStartDate(newValue)}
                      sx={{ ...localstyles.datePicker }}
                    />
                  </Box>
                </Grid>
                <CustomField label={'地點'}>
                  <CustomTextField
                    id="place"
                    placeholder={'請輸入地點'}
                    onChange={(event) => {
                      // Assuming you have a function to update the item's place
                      updateData(
                        item.serviceId as ServiceId,
                        'place',
                        event.target.value
                      )
                    }}
                    multiline={true}
                    value={
                      serviceData[item.serviceId as keyof ServiceData].place
                    }
                  />
                </CustomField>
                <CustomField label={'人數'}>
                  <CustomTextField
                    id="numberOfPeople"
                    placeholder={'請輸入人數'}
                    onChange={(event) => {
                      // Assuming you have a function to update the item's number of people
                      updateData(
                        item.serviceId as ServiceId,
                        'numberOfPeople',
                        parseInt(event.target.value, 10) || 0
                      )
                    }}
                    value={
                      serviceData[item.serviceId as keyof ServiceData]
                        .numberOfPeople
                    }
                  />
                </CustomField>
                <Grid item>
                  {/* image field */}
                  <Box key={'圖片'}>
                    <Typography sx={styles.labelField}>{'圖片'}</Typography>
                    <ImageUploading
                      multiple
                      value={
                        serviceData[item.serviceId as keyof ServiceData]
                          .photoImage
                      }
                      onChange={(imageList, addUpdateIndex) =>
                        onImageChange(
                          imageList,
                          addUpdateIndex,
                          item.serviceId as ServiceId
                        )
                      }
                      maxNumber={TENANT_REGISTER_CONFIGS.maxBRNImages}
                      maxFileSize={TENANT_REGISTER_CONFIGS.maxImageSize}
                      dataURLKey="data_url"
                    >
                      {({ imageList, onImageUpload }) => (
                        <Box className="box">
                          <Card sx={localstyles.cardImg}>
                            <ButtonBase
                              sx={localstyles.btnBase}
                              onClick={(event) => onImageUpload()}
                            >
                              <CAMERA_OUTLINE_ICON
                                style={{ color: '#ACACAC' }}
                              />
                              <Typography
                                sx={[styles.labelField, { fontWeight: 'bold' }]}
                              >
                                {'上載圖片'}
                              </Typography>
                            </ButtonBase>
                          </Card>
                          <ImageList sx={localstyles.imagesContainer} cols={3}>
                            {imageList.map((image) => (
                              <ImageListItem key={image['file']?.name}>
                                <img
                                  style={localstyles.image}
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
                </Grid>
              </Grid>
              <Divider />
            </Grid>
          ))}
          <Grid item className="lg:flex sm:block text-center">
            <Button
              sx={[
                styles.buttonFilledGreen,
                localstyles.localButton,
                { marginBottom: { md: 0, xs: 2 }, marginTop: 2 }
              ]}
              onClick={() => submitServiceInfo()}
            >
              {t('col.create')}
            </Button>
          </Grid>
        </LocalizationProvider>
      </div>
    </Box>
  )
}

const localstyles = {
  localButton: {
    width: '200px',
    fontSize: 18,
    mr: 3
  },
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
    backgroundColor: '#E3E3E3',
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
  },
  datePicker: {
    ...styles.textField,
    maxWidth: '370px',
    '& .MuiIconButton-edgeEnd': {
      color: '#79CA25'
    }
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 10
  },
  DateItem: {
    display: 'flex',
    height: 'fit-content',
    // paddingX: 1,
    // mr: 1,
    // marginY: 2,
    alignItems: 'center'
  }
}

export default AdditionalServicePict
