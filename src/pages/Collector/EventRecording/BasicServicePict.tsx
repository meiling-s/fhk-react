import { useState, useEffect } from 'react'
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
import ImageUploading, {ImageListType} from 'react-images-uploading'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useTranslation } from 'react-i18next'
import { DatePicker } from '@mui/x-date-pickers'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import CustomField from '../../../components/FormComponents/CustomField'
import { styles } from '../../../constants/styles'
import { CAMERA_OUTLINE_ICON } from '../../../themes/icons'
import { ServiceInfo } from '../../../interfaces/serviceInfo'
import { createServiceInfo } from '../../../APICalls/serviceInfo'
import dayjs from 'dayjs'
import { ToastContainer, toast } from 'react-toastify'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import { formErr } from '../../../constants/constant'
import { format } from '../../../constants/constant'
import { localStorgeKeyName } from "../../../constants/constant";
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'

const BasicServicePicture = () => {
  const { t } = useTranslation()
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs())
  const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs())
  const [place, setPlace] = useState<string>('')
  const [numberOfPeople, setNumberOfPeople] = useState<string>('')
  const [serviceImages, setServiceImages] = useState<ImageListType>([])
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const loginId = localStorage.getItem(localStorgeKeyName.username)
  const {imgSettings, dateFormat} = useContainer(CommonTypeContainer)

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

  const resetData = () => {
    setPlace('')
    setNumberOfPeople('')
    setServiceImages([])
  }

  useEffect(() => {
    const validate = async () => {
      setValidation([])
      //do validation here
      const tempV: formValidate[] = []
      startDate?.toString() == '' &&
        tempV.push({
          field: t('report.dateAndTime'),
          problem: formErr.empty,
          type: 'error'
        })
      endDate?.toString() == '' &&
        tempV.push({
          field: t('report.to'),
          problem: formErr.empty,
          type: 'error'
        })
      place?.toString() == '' &&
        tempV.push({
          field: t('report.address'),
          problem: formErr.empty,
          type: 'error'
        })
      Number.isNaN(parseInt(numberOfPeople)) && !(numberOfPeople == '')
        ? tempV.push({
            field: t('report.numberOfPeople'),
            problem: formErr.wrongFormat,
            type: 'error'
          })
        : !Number.isNaN(parseInt(numberOfPeople)) &&
          parseInt(numberOfPeople) < 0 &&
          tempV.push({
            field: t('report.numberOfPeople'),
            problem: formErr.numberSmallThanZero,
            type: 'error'
          })
      serviceImages.length == 0 &&
        tempV.push({
          field: t('report.picture'),
          problem: formErr.empty,
          type: 'error'
        })

        if(dayjs(startDate).format('YYYY-MM-DD HH:mm') >= dayjs(endDate).format('YYYY-MM-DD HH:mm')) {
          tempV.push({
            field: `${t('report.collectionPoints')} ${t('report.dateAndTime')}`,
            problem: formErr.startDateBehindEndDate,
            type: 'error'
          })
        }
      setValidation(tempV)
    }

    validate()
  }, [startDate, endDate, place, serviceImages,numberOfPeople])

  const formattedDate = (dateData: dayjs.Dayjs) => {
    return dateData.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  }

  const submitServiceInfo = async () => {
    // console.log(formattedDate(startDate))
    // console.log(formattedDate(endDate))
    if (validation.length == 0) {
      const imgList: string[] = ImageToBase64(serviceImages).map(
        (item) => {
          return item
        }
      )

      const formData: ServiceInfo = {
        serviceId: 0,
        address: place,
        addressGps: [0],
        serviceName: 'SRV00001',
        participants: 'string',
        startAt: formattedDate(startDate),
        endAt: formattedDate(endDate),
        photo: ImageToBase64(serviceImages),
        numberOfVisitor: parseInt(numberOfPeople),
        createdBy: loginId || 'admin',
        updatedBy: loginId || 'admin'
      }

      const result = await createServiceInfo(formData)
      if (result) {
        showSuccessToast()
        setTrySubmited(false)
        resetData()
      } else {
        showErrorToast()
      }
    } else {
      setTrySubmited(true)
    }
    
  }

  const showErrorToast = () => {
    const toastMsg = 'failed created event recording'
    toast.error(toastMsg, {
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

  const showSuccessToast = () => {
    const toastMsg = 'event recording created'
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

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setServiceImages(imageList)
    // console.log(imageList, addUpdateIndex)
  }

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const checkNumber = (n: string) => {
    if (!trySubmited) {
      return false
    }
    return (
      Number.isNaN(parseInt(n)) ||
      n == '' ||
      (!Number.isNaN(parseInt(n)) && parseInt(n) < 0)
    )
  }

  const returnErrorMsg = (error: string) => {
    var msg = ''
    // console.log(error)
    switch (error) {
      case formErr.empty:
        msg = t('form.error.shouldNotBeEmpty')
        break
      case formErr.wrongFormat:
        msg = t('form.error.isInWrongFormat')
        break
      case formErr.numberSmallThanZero:
        msg = t('form.error.shouldNotSmallerThanZero')
        break
      case formErr.wrongFormat:
        msg = t('form.error.isInWrongFormat')
        break
      case formErr.startDateBehindEndDate:
        msg = t('form.error.startDateBehindEndDate')
        break
    }
    return msg
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
              <Typography sx={styles.header2}>
                {t('report.collectionPoints')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={styles.header3}>
                {t('report.dateAndTime')}
              </Typography>
              <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Box sx={{ ...localstyles.DateItem }}>
                  <DatePicker
                    defaultValue={dayjs(startDate)}
                    format={dateFormat}
                    onChange={(value) => setStartDate(value!!)}
                    sx={{ ...localstyles.datePicker }}
                    maxDate={dayjs(endDate)}
                  />
                </Box>
                <Box sx={{ ...localstyles.timePeriodItem }}>
                  <TimePicker
                    value={startDate}
                    onChange={(value) => setStartDate(value!!)}
                    sx={{ ...localstyles.timePicker }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Typography sx={styles.header3}>{t('report.to')}</Typography>
              <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Box sx={{ ...localstyles.DateItem }}>
                  <DatePicker
                    defaultValue={dayjs(endDate)}
                    format={dateFormat}
                    onChange={(value) => setEndDate(value!!)}
                    sx={{ ...localstyles.datePicker }}
                    minDate={dayjs(startDate)}
                  />
                </Box>
                <Box sx={{ ...localstyles.timePeriodItem }}>
                  <TimePicker
                    value={endDate}
                    onChange={(value) => setEndDate(value!!)}
                    sx={{ ...localstyles.timePicker }}
                  />
                </Box>
              </Box>
            </Grid>
            <CustomField label={t('report.address')}>
              <CustomTextField
                id="place"
                placeholder={t('report.pleaseEnterAddress')}
                onChange={(event) => setPlace(event.target.value)}
                multiline={true}
                value={place}
                error={checkString(place)}
              />
            </CustomField>
            <CustomField label={t('report.numberOfPeople')}>
              <CustomTextField
                id="numberOfPeople"
                placeholder={t('report.pleaseEnterNumberOfPeople')}
                value={numberOfPeople}
                onChange={(event) => setNumberOfPeople(event.target.value)}
                error={checkNumber(numberOfPeople)}
              />
            </CustomField>
            <Grid item>
              {/* image field */}
              <Box key={t('report.picture')}>
                <Typography sx={styles.labelField}>
                  {t('report.picture')}
                </Typography>
                <ImageUploading
                  multiple
                  value={serviceImages}
                  onChange={(imageList, addUpdateIndex) =>
                    onImageChange(imageList, addUpdateIndex)
                  }
                  maxNumber={imgSettings?.ImgQuantity}
                  maxFileSize={imgSettings?.ImgSize}
                  dataURLKey="data_url"
                >
                  {({ imageList, onImageUpload }) => (
                    <Box className="box">
                      <Card
                        sx={{
                          ...localstyles.cardImg,
                          ...(trySubmited &&
                            imageList.length === 0 &&
                            localstyles.imgError)
                        }}
                      >
                        <ButtonBase
                          sx={localstyles.btnBase}
                          onClick={(event) => onImageUpload()}
                        >
                          <CAMERA_OUTLINE_ICON style={{ color: '#ACACAC' }} />
                          <Typography
                            sx={[styles.labelField, { fontWeight: 'bold' }]}
                          >
                            {t('report.uploadPictures')}
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
              <Grid item sx={{ width: '100%' }}>
                {trySubmited &&
                  validation.map((val, index) => (
                    <FormErrorMsg
                      key={index}
                      field={t(val.field)}
                      errorMsg={returnErrorMsg(val.problem)}
                      type={val.type}
                    />
                  ))}
              </Grid>
            </Grid>
            <Grid item className="lg:flex sm:block text-center">
              <Button
                sx={[
                  styles.buttonFilledGreen,
                  localstyles.localButton,
                  {
                    marginBottom: { md: 0, xs: 2 },
                    marginTop: 2
                  }
                ]}
                onClick={() => submitServiceInfo()}
              >
                {t('report.save')}
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
  },
  imgError: {
    border: '1px solid red'
  },
  timePicker: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: 'white',
    '& fieldset': {
      borderWidth: 0
    },
    '& input': {
      paddingX: 0
    },
    '& .MuiIconButton-edgeEnd': {
      color: '#79CA25'
    }
  },
  timePeriodItem: {
    display: 'flex',
    height: 'fit-content',
    paddingX: 2,
    alignItems: 'center',
    backgroundColor: 'white',
    border: 2,
    borderRadius: 3,
    borderColor: '#E2E2E2'
  }
}

export default BasicServicePicture
