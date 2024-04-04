import { useEffect, useState } from 'react'
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
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { styles } from '../../../constants/styles'
import { CAMERA_OUTLINE_ICON } from '../../../themes/icons'

import { TENANT_REGISTER_CONFIGS } from '../../../constants/configs'
import dayjs, { Dayjs } from 'dayjs'
import { createServiceInfo } from '../../../APICalls/serviceInfo'
import { ServiceInfo } from '../../../interfaces/serviceInfo'
import { ToastContainer, toast } from 'react-toastify'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import { formErr } from '../../../constants/constant'
import { format } from '../../../constants/constant'
import { localStorgeKeyName } from "../../../constants/constant";

type ServiceName = 'SRV00005' | 'SRV00006' | 'SRV00007'
type ServiceData = Record<
  ServiceName,
  {serviceId: number, startDate: dayjs.Dayjs; photoImage: ImageListType }
>
const loginId = localStorage.getItem(localStorgeKeyName.username) || 'admin'
const OtherPict = () => {
  const { t } = useTranslation()
  const [serviceData, setServiceData] = useState<ServiceData>({
    SRV00005: {serviceId: 5, startDate: dayjs(), photoImage: [] },
    SRV00006: {serviceId: 6, startDate: dayjs(), photoImage: [] },
    SRV00007: {serviceId: 7, startDate: dayjs(), photoImage: [] }
  })

  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const serviceOthersField = [
    {
      serviceId: 'SRV00005',
      label: t('report.picturesUploadedToFacebook')
    },
    {
      serviceId: 'SRV00006',
      label: t('report.regulatedWEEESubmittedToRecyclers')
    },
    {
      serviceId: 'SRV00007',
      label: t('report.fluorescentLampsSubmittedToRecyclers')
    }
  ]

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

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
    serviceName: ServiceName
  ) => {
    setServiceData((prevData) => ({
      ...prevData,
      [serviceName]: { ...prevData[serviceName], photoImage: imageList }
    }))
  }

  const updateDateTime = (
    serviceName: ServiceName,
    property: string,
    value: dayjs.Dayjs
  ) => {
    setServiceData((prevData) => ({
      ...prevData,
      [serviceName]: {
        ...prevData[serviceName],
        [property]: value
      }
    }))
  }

  useEffect(() => {
    const validate = async () => {
      const tempV = []

      for (const key in serviceData) {
        if (serviceData.hasOwnProperty(key)) {
          const entry = serviceData[key as ServiceName]

          // Validate startDate
          if (entry.startDate?.toString() == '') {
            tempV.push({
              field: `${key} ${t('report.dateAndTime')}`,
              problem: formErr.empty,
              type: 'error'
            })
          }

          // Validate photoImage
          if (
            !Array.isArray(entry.photoImage) ||
            entry.photoImage.length === 0
          ) {
            tempV.push({
              field: `${key} ${t('report.picture')}`,
              problem: formErr.empty,
              type: 'error'
            })
          }
        }
      }

      setValidation(tempV)
    }

    validate()
  }, [serviceData])

  const formattedDate = (dateData: dayjs.Dayjs) => {
    return dateData.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  }

  const resetServiceData = () => {
    setServiceData({
      SRV00005: {serviceId: 5, startDate: dayjs(), photoImage: [] },
      SRV00006: {serviceId: 6, startDate: dayjs(), photoImage: [] },
      SRV00007: {serviceId: 7,startDate: dayjs(), photoImage: [] }
    })
  }

  const submitServiceInfo = async () => {
    let itemData = 0
    if (validation.length == 0) {
      for (const key of Object.keys(serviceData) as ServiceName[]) {
        const serviceItem = serviceData[key]
        const imgList: string[] = ImageToBase64(
          serviceItem.photoImage
        ).map((item) => {
          return item 
        })

        const formData: ServiceInfo = {
          serviceId: serviceItem.serviceId,
          address: '',
          addressGps: [0],
          serviceName: key,
          participants: 'string',
          startAt: formattedDate(serviceItem.startDate),
          endAt: formattedDate(serviceItem.startDate),
          photo: imgList,
          numberOfVisitor: 0,
          createdBy: loginId,
          updatedBy: loginId
        }
        const result = await createServiceInfo(formData)
        if (result) itemData++
      }

      if (itemData === 3) {
        console.log('itemData', itemData)
        setTrySubmited(false)
        resetServiceData()
        const toastMsg = 'created other service success'
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
    } else {
      setTrySubmited(true)
    }
  }

  const returnErrorMsg = (error: string) => {
    var msg = ''
    console.log(error)
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
    }
    return msg
  }

  return (
    <Box className="container-wrapper w-full">
      <ToastContainer></ToastContainer>
      <div className="settings-page bg-bg-primary">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          {serviceOthersField.map((item, index) => (
            <Grid
              key={index}
              container
              direction={'column'}
              spacing={2.5}
              sx={{
                width: { sm: '384px', xs: '100%' },
                marginTop: { sm: 2, xs: 6 },
                marginLeft: {
                  xs: 0
                }
              }}
              className="sm:ml-0 mt-o w-full"
            >
              <Grid item>
                <Typography sx={[styles.header2]}>{item.label}</Typography>
              </Grid>
              <Grid item>
                <Typography sx={[styles.header3, { marginBottom: 2 }]}>
                  {t('report.dateAndTime')}
                </Typography>
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Box sx={{ ...localstyles.DateItem }}>
                    <DatePicker
                      defaultValue={dayjs(
                        serviceData[item.serviceId as keyof ServiceData]
                          .startDate
                      )}
                      format={format.dateFormat2}
                      onChange={(value) =>
                        updateDateTime(
                          item.serviceId as ServiceName,
                          'startDate',
                          value!!
                        )
                      }
                      sx={{ ...localstyles.datePicker }}
                    />
                  </Box>
                  <Box sx={{ ...localstyles.timePeriodItem }}>
                    <TimePicker
                      value={
                        serviceData[item.serviceId as keyof ServiceData]
                          .startDate
                      }
                      onChange={(value) =>
                        updateDateTime(
                          item.serviceId as ServiceName,
                          'endDate',
                          value!!
                        )
                      }
                      sx={{ ...localstyles.timePicker }}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item>
                {/* image field */}
                <Box key={t('report.picture') + index}>
                  <Typography sx={styles.labelField}>
                    {t('report.picture')}
                  </Typography>
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
                        item.serviceId as ServiceName
                      )
                    }
                    maxNumber={TENANT_REGISTER_CONFIGS.maxBRNImages}
                    maxFileSize={TENANT_REGISTER_CONFIGS.maxImageSize}
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
              </Grid>
            </Grid>
          ))}
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
          <Grid item className="lg:flex sm:block text-center">
            <Button
              sx={[
                styles.buttonFilledGreen,
                localstyles.localButton,
                { marginBottom: { md: 0, xs: 2 }, marginTop: 2, marginLeft: 2 }
              ]}
              onClick={submitServiceInfo}
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

export default OtherPict
