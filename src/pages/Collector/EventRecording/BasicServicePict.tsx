import { FunctionComponent, useCallback, ReactNode, useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  ButtonBase,
  ImageList,
  ImageListItem
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

import { EVENT_RECORDING } from '../../../constants/configs'
import { ServiceInfo, photoService } from '../../../interfaces/serviceInfo'
import { createServiceInfo } from '../../../APICalls/serviceInfo'
import dayjs, { Dayjs } from 'dayjs'
import { ToastContainer, toast } from "react-toastify";
import { number } from 'yup'

const BasicServicePicture = () => {
  const { t } = useTranslation()
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs('2024-01-01'))
  const [endDate, setEnddate] = useState<Dayjs | null>(dayjs('2024-01-01'))
  const [place, setPlace] = useState<string>('')
  const [numberOfPeople, setNumberOfPeople] = useState<string>('0')
  const [serviceImages, setServiceImages] = useState<ImageListType>([])
  const [trySubmited, setTrySubmited] = useState<boolean>(false)

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

  const submitServiceInfo = async () => {
    const imgList: photoService[] = ImageToBase64(serviceImages).map((item) =>{
      return { photo: item }
    })
    const formData: ServiceInfo = {
      serviceId: 1,
      address: place,
      addressGps: [
        0
      ],
      serviceName: "SRV00001",
      participants: "string",
      startAt: "2024-01-26T12:37:31.581Z",
      endAt: "2024-01-26T12:37:31.581Z",
      photo: imgList,
      numberOfVisitor: parseInt(numberOfPeople),
      createdBy: "admin",
      updatedBy: "admin"
    }

    const result = await createServiceInfo(formData)
    let toastMsg = ""
    if(result) {
      toastMsg = "event recording created"
      console.log('succes create service info', formData)
      toast.info(toastMsg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      resetData()
    } else {
      toastMsg = "failed created event recording"
      toast.error(toastMsg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setServiceImages(imageList)
    console.log(imageList, addUpdateIndex)
  }

  //validation function
  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const resetData = () => {
    setPlace('')
    setNumberOfPeople('0')
    setServiceImages([])
  }

  return (
    <Box className="container-wrapper w-full">
      <ToastContainer></ToastContainer>
      <div className="settings-page bg-bg-primary max-w-sm">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <Grid
            container
            direction={'column'}
            spacing={2.5}
            sx={{
              width: { xs: '100%' },
              marginTop: { sm: 2, xs: 6 },
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
                  value={startDate}
                  onChange={(newValue: any) => setStartDate(newValue)}
                  sx={{ ...localstyles.datePicker }}
                />
              </Box>
            </Grid>
            <Grid item>
              <Typography sx={styles.header3}>{'至'}</Typography>
              <Box sx={{ ...localstyles.DateItem }}>
                <DatePicker
                  value={endDate}
                  onChange={(newValue: any) => setEnddate(newValue)}
                  sx={{ ...localstyles.datePicker }}
                />
              </Box>
            </Grid>
            <CustomField label={'地點'}>
              <CustomTextField
                id="place"
                placeholder={'請輸入地點'}
                onChange={(event) => setPlace(event.target.value)}
                multiline={true}
                value={place}
                error={checkString(place)}
              />
            </CustomField>
            <CustomField label={'人數'}>
              <CustomTextField
                id="numberOfPeople"
                placeholder={'請輸入人數'}
                onChange={(event) => setNumberOfPeople(event.target.value)}

              />
            </CustomField>
            <Grid item>
              {/* image field */}
              <Box key={'圖片'}>
                <Typography sx={styles.labelField}>{'圖片'}</Typography>
                <ImageUploading
                  multiple
                  value={serviceImages}
                  onChange={(imageList, addUpdateIndex) =>
                    onImageChange(imageList, addUpdateIndex)
                  }
                  maxNumber={EVENT_RECORDING.maxImageNumber}
                  maxFileSize={EVENT_RECORDING.maxImageSize}
                  dataURLKey="data_url"
                >
                  {({ imageList, onImageUpload }) => (
                    <Box className="box">
                      <Card sx={localstyles.cardImg}>
                        <ButtonBase
                          sx={localstyles.btnBase}
                          onClick={(event) => onImageUpload()}
                        >
                          <CAMERA_OUTLINE_ICON style={{ color: '#ACACAC' }} />
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
            <Grid item className="lg:flex sm:block text-center">
              <Button
                sx={[
                  styles.buttonFilledGreen,
                  localstyles.localButton,
                  {
                    marginBottom: { md: 0, xs: 2 },
                    marginTop: 2,
                    marginLeft: 2
                  }
                ]}
                onClick={() => submitServiceInfo()}
              >
                {t('col.create')}
              </Button>
            </Grid>
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
    alignItems: 'center'
  }
}

export default BasicServicePicture
