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
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useTranslation } from 'react-i18next'
import { DatePicker } from '@mui/x-date-pickers'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'

import CustomTextField from '../../../components/FormComponents/CustomTextField'
import CustomField from '../../../components/FormComponents/CustomField'

import { styles } from '../../../constants/styles'
import { CAMERA_OUTLINE_ICON } from '../../../themes/icons'

import dayjs from 'dayjs'
import { createServiceInfo } from '../../../APICalls/serviceInfo'
import { ServiceInfo } from '../../../interfaces/serviceInfo'
import { ToastContainer, toast } from 'react-toastify'

import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import { STATUS_CODE, formErr } from '../../../constants/constant'
import { format } from '../../../constants/constant'
import { localStorgeKeyName } from "../../../constants/constant";
import CustomItemListBoolean from '../../../components/FormComponents/CustomItemListBoolean'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { extractError } from '../../../utils/utils'
import { useNavigate } from 'react-router-dom'

type ServiceName = 'SRV00001' | 'SRV00002' | 'SRV00003' | 'SRV00004'
const loginId = localStorage.getItem(localStorgeKeyName.username) || ""

type ServiceData = Record<
  ServiceName,
  {
    serviceId: number,
    startDate: dayjs.Dayjs
    endDate: dayjs.Dayjs
    place: string
    numberOfPeople: string
    photoImage: ImageListType
  }
>

type ErrorsServiceData = Record<
  ServiceName,
  {
    startDate: {status: boolean, message: string}
    endDate: {status: boolean, message: string}
    place: {status: boolean, message: string}
    numberOfPeople: {status: boolean, message: string}
    photoImage: {status: boolean, message: string}
  }
>

const AdditionalServicePict = () => {
  const { t } = useTranslation()
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const initialServiceData = {
    SRV00001: {
      serviceId: 1,
      startDate: dayjs(),
      endDate: dayjs(),
      place: '',
      numberOfPeople: '',
      photoImage: []
    },
    SRV00002: {
      serviceId: 2,
      startDate: dayjs(),
      endDate: dayjs(),
      place: '',
      numberOfPeople: '',
      photoImage: []
    },
    SRV00003: {
      serviceId: 3,
      startDate: dayjs(),
      endDate: dayjs(),
      place: '',
      numberOfPeople: '',
      photoImage: []
    },
    SRV00004: {
      serviceId: 4,
      startDate: dayjs(),
      endDate: dayjs(),
      place: '',
      numberOfPeople: '',
      photoImage: []
    }
  }

  const initialErrors = {
    SRV00001: {
      startDate: {status: false, message: ''},
      endDate: {status: false, message: ''},
      place: {status: false, message: ''},
      numberOfPeople: {status: false, message: ''},
      photoImage: {status: false, message: ''}
    },
    SRV00002: {
      startDate: {status: false, message: ''},
      endDate: {status: false, message: ''},
      place: {status: false, message: ''},
      numberOfPeople: {status: false, message: ''},
      photoImage: {status: false, message: ''}
    },
    SRV00003: {
      startDate: {status: false, message: ''},
      endDate: {status: false, message: ''},
      place: {status: false, message: ''},
      numberOfPeople: {status: false, message: ''},
      photoImage: {status: false, message: ''}
    },
    SRV00004: {
      startDate: {status: false, message: ''},
      endDate: {status: false, message: ''},
      place: {status: false, message: ''},
      numberOfPeople: {status: false, message: ''},
      photoImage: {status: false, message: ''}
    }
  }
  const [serviceData, setServiceData] =
    useState<ServiceData>(initialServiceData)
  const [errors, setErrors] = useState<ErrorsServiceData>(initialErrors)
  const [eventName, setEventName] = useState<string>('')
  const [activeObj, setActiveObj] = useState<string>('')
  const [nature, setNature] = useState<string>('')
  const [speaker, setSpeaker] = useState<string>('')
  const {imgSettings} = useContainer(CommonTypeContainer)
  const [errorsOptions, setErrorOptions] = useState(
    {
      targetParticipants: {status: false, message: ''}, 
      eventName: {status: false, message: ''},
      nature: {status: false, message: ''},
      speaker: {status: false, message: ''}
    }
  )
  const [serviceFlg, setServiceFlg] = useState<number>(0)
  const AdditionalService = [
    {
      serviceName: 'SRV00001',
      label: t('report.otherPictures')
    },
    {
      serviceName: 'SRV00002',
      label: t('report.otherCollectionPoint')
    },
    {
      serviceName: 'SRV00003',
      label: t('report.communityCollectionPoint')
    },
    {
      serviceName: 'SRV00004',
      label: t('report.promotionalAndEducationalEventLocations')
    }
  ]

  const navigate = useNavigate();

  useEffect(() => {
    const validate = async () => {
      const tempV = []

      for (const key in serviceData) {
        if (serviceData.hasOwnProperty(key)) {
          const entry = serviceData[key as ServiceName]

          if (entry.startDate?.toString() == '') {
            tempV.push({
              field: `${key} ${t('report.dateAndTime')}`,
              problem: formErr.empty,
              type: 'error'
            })
          }

          if (entry.startDate?.toString() == '') {
            tempV.push({
              field: `${key} ${t('report.to')}`,
              problem: formErr.empty,
              type: 'error'
            })
          }

          if (entry.place == '') {
            tempV.push({
              field: `${key} ${t('report.address')}`,
              problem: formErr.empty,
              type: 'error'
            })
          }

          Number.isNaN(parseInt(entry.numberOfPeople)) &&
          !(entry.numberOfPeople == '')
            ? tempV.push({
                field: `${key} ${t('report.numberOfPeople')}`,
                problem: formErr.wrongFormat,
                type: 'error'
              })
            : !Number.isNaN(parseInt(entry.numberOfPeople)) &&
              parseInt(entry.numberOfPeople) < 0 &&
              tempV.push({
                field: `${key} ${t('report.numberOfPeople')}`,
                problem: formErr.numberSmallThanZero,
                type: 'error'
              })

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

  const onHandleError = (serviceName: ServiceName, property: string, value: any, message: string) => {
    const entry = serviceData[serviceName as ServiceName];
    const errorService = errors[serviceName as ServiceName];
    
    if(message === 'succeed') {
      setErrors(prev => {
        return{
          ...prev,
          [serviceName] :
            { 
              ...prev[serviceName], [property]: {status: false, message} 
            }
        }
      })
    } else {
      setErrors(prev => {
        return{
          ...prev,
          [serviceName] :
            { 
              ...prev[serviceName], [property]: {status: true, message} 
            }
        }
      })
    }
    
  };

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
    ServiceName: ServiceName,
  ) => {
    setServiceData((prevData) => ({
      ...prevData,
      [ServiceName]: { ...prevData[ServiceName], photoImage: imageList }
    }))
    // console.log(`Updated image list for ${serviceId}:`, imageList)
  }

  const updateData = (serviceName: ServiceName, property: string, value: any) => {
    if(value === '' || value === 0) {
      const message = returnErrorMsg(formErr.empty)
      onHandleError(serviceName, property, value, message)
    } else {
      setServiceData((prevData) => ({
        ...prevData,
        [serviceName]: {
          ...prevData[serviceName],
          [property]: value
        }
      }))
      onHandleError(serviceName, property, value, 'succeed')
    }
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

  //validation function
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
    console.log('error type', error)
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
        break;
      case formErr.startDateBehindEndDate:
        msg = t('form.error.startDateBehindEndDate')
        break
    }
    return msg
  }

  const formattedDate = (dateData: dayjs.Dayjs) => {
    return dateData.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
  }

  const resetServiceData = () => {
    setServiceData(initialServiceData)
  }

  const submitServiceInfo = async () => {
    let itemData = 0

    for (const key of Object.keys(errors) as ServiceName[]) {
      const error = errors[key];
      const serviceItem = serviceData[key];
     if(
      !(error.endDate.status || serviceItem.endDate.toString() === '') && 
      !(error.startDate.status || serviceItem.startDate.toString() === '') && 
      !(error.numberOfPeople.status || serviceItem.numberOfPeople === '') && 
      !(error.place.status || serviceItem.place === '') && 
      !(error.photoImage.status || serviceItem.photoImage.length === 0)
      ){
        const imgList: string[] = ImageToBase64(
          serviceItem.photoImage
        ).map((item) => {
          return item
        })
  
        const formData: ServiceInfo = {
          serviceId: serviceItem.serviceId,
          address: serviceItem.place,
          addressGps: [0],
          serviceName: serviceItem.serviceId === 4 ? eventName: '',
          participants: activeObj,
          startAt: formattedDate(serviceItem.startDate),
          endAt: formattedDate(serviceItem.endDate),
          photo: imgList,
          numberOfVisitor: parseInt(serviceItem.numberOfPeople),
          createdBy: loginId,
          updatedBy: loginId,
          nature: serviceItem.serviceId === 4 ? nature : '',
          speaker: serviceItem.serviceId === 4 ? speaker : '',
          additionalFlg: serviceItem.serviceId === 4 && serviceFlg === 0 ? true : false
        }
        
        try {
          const result = await createServiceInfo(formData)
          if (result) {
            itemData++
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
        } catch (error) {
          const {state, realm} = extractError(error);
          if(state.code === STATUS_CODE[503]){
            navigate('/maintenance')
          }
        }
     }
    }

    // if (validation.length == 0) {
    //   for (const key of Object.keys(serviceData) as ServiceName[]) {
    //     const serviceItem = serviceData[key]
    //     const imgList: string[] = ImageToBase64(
    //       serviceItem.photoImage
    //     ).map((item) => {
    //       return item
    //     })

    //     const formData: ServiceInfo = {
    //       serviceId: serviceItem.serviceId,
    //       address: serviceItem.place,
    //       addressGps: [0],
    //       serviceName: serviceItem.serviceId === 4 ? eventName: '',
    //       participants: activeObj,
    //       startAt: formattedDate(serviceItem.startDate),
    //       endAt: formattedDate(serviceItem.endDate),
    //       photo: imgList,
    //       numberOfVisitor: parseInt(serviceItem.numberOfPeople),
    //       createdBy: loginId,
    //       updatedBy: loginId
    //     }
    //     const result = await createServiceInfo(formData)
    //     if (result) itemData++
    //   }

    //   if (itemData === 4) {
    //     setTrySubmited(false)
    //     // console.log('itemData', itemData)
    //     const toastMsg = 'created additional service success'
    //     toast.info(toastMsg, {
    //       position: 'top-center',
    //       autoClose: 3000,
    //       hideProgressBar: true,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: 'light'
    //     })
    //   }
    // } else {
    //   setTrySubmited(true)
    // }
    resetServiceData()
  }

  const serviceTypeList = [
    {
      id: 'additional',
      name: t('report.additional')
    },
    {
      id: 'other_services',
      name: t('report.other_services')
    },
  ]

  return (
    <Box className="container-wrapper w-full">
      <ToastContainer></ToastContainer>
      <div className="settings-page bg-bg-primary">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          {AdditionalService.map((item, index) => (
            <Grid
              key={index}
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
                  <Typography sx={styles.header2}>{item.label}</Typography>
                </Grid>
                <Grid item>
                  <Typography sx={styles.header3}>
                    {t('report.dateAndTime')}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <Box sx={{ ...localstyles.DateItem }}>
                      <DatePicker
                        defaultValue={dayjs(
                          serviceData[item.serviceName as keyof ServiceData]
                            .startDate
                        )}
                        maxDate={serviceData[item.serviceName as keyof ServiceData].endDate}
                        format={format.dateFormat2}
                        onChange={(value) =>
                          updateDateTime(
                            item.serviceName as ServiceName,
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
                          serviceData[item.serviceName as keyof ServiceData]
                            .startDate
                        }
                        onChange={(value) =>
                          updateDateTime(
                            item.serviceName as ServiceName,
                            'startDate',
                            value!!
                          )
                        }
                        sx={{ ...localstyles.timePicker }}
                      />
                    </Box>
                  </Box>
                  <Typography style={{color: 'red', fontWeight: '500'}}>
                    {errors[item.serviceName as keyof ErrorsServiceData].startDate.status ? errors[item.serviceName as keyof ErrorsServiceData].startDate.message : ''}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography sx={styles.header3}>{t('report.to')}</Typography>
                  <Box
                    sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <Box sx={{ ...localstyles.DateItem }}>
                      <DatePicker
                        defaultValue={dayjs(
                          serviceData[item.serviceName as keyof ServiceData]
                            .startDate
                        )}
                        format={format.dateFormat2}
                        minDate={serviceData[item.serviceName as keyof ServiceData].startDate}
                        onChange={(value) =>
                          updateDateTime(
                            item.serviceName as ServiceName,
                            'endDate',
                            value!!
                          )
                        }
                        sx={{ ...localstyles.datePicker }}
                      />
                    </Box>
                    <Box sx={{ ...localstyles.timePeriodItem }}>
                      <TimePicker
                        value={
                          serviceData[item.serviceName as keyof ServiceData]
                            .endDate
                        }
                        onChange={(value) =>
                          updateDateTime(
                            item.serviceName as ServiceName,
                            'endDate',
                            value!!
                          )
                        }
                        sx={{ ...localstyles.timePicker }}
                      />
                    </Box>
                  </Box>
                  <Typography style={{color: 'red', fontWeight: '500'}}>
                    {errors[item.serviceName as keyof ErrorsServiceData].endDate.status ? errors[item.serviceName as keyof ErrorsServiceData].endDate.message : ''}
                  </Typography>
                </Grid>
                <Grid item style={{display: 'flex', flexDirection: 'column'}}>
                  <CustomField label={t('report.address')}>
                    <CustomTextField
                      id="place"
                      placeholder={t('report.address')}
                      onChange={(event) => {
                        updateData(
                          item.serviceName as ServiceName,
                          'place',
                          event.target.value
                        )
                      }}
                      multiline={true}
                      error={checkString(
                        serviceData[item.serviceName as keyof ServiceData].place
                      )}
                    />
                  </CustomField>
                  <Typography style={{color: 'red', fontWeight: '500'}}>
                    {errors[item.serviceName as keyof ErrorsServiceData].place.status ? errors[item.serviceName as keyof ErrorsServiceData].place.message : ''}
                  </Typography>
                </Grid>
                {index === 3 && (
                  <Grid item>
                    <div className="mb-4">
                      <CustomField label={t('report.eventName')}>
                        <CustomTextField
                          id="eventName"
                          placeholder={t('report.eventName')}
                          onChange={(event) => {
                            if(event.target.value){
                              setEventName(event.target.value)
                              setErrorOptions(prev => {
                                return{
                                  ...prev,
                                  eventName: {status: false, message: ''}
                                }
                              })
                            } else {
                             
                              setErrorOptions(prev => {
                                return{
                                  ...prev,
                                  eventName: {status: true, message: t('form.error.shouldNotBeEmpty')}
                                }
                              })
                            }
                          }}
                          error={checkString(eventName)}
                        />
                      </CustomField>
                      <Typography style={{color: 'red', fontWeight: '500'}}>
                        {errorsOptions.eventName.status ? errorsOptions.eventName.message : ''}
                      </Typography>
                    </div>

                    <div className="mb-4">
                      <CustomField label={t('report.nature')}>
                        <CustomTextField
                          id="nature"
                          placeholder={t('report.please_enter') + ' ' + t('report.nature')}
                          onChange={(event) => {
                            if(event.target.value){
                              setNature(event.target.value)
                              setErrorOptions(prev => {
                                return{
                                  ...prev,
                                  nature: {status: false, message: ''}
                                }
                              })
                            } else {
                             
                              setErrorOptions(prev => {
                                return{
                                  ...prev,
                                  nature: {status: true, message: t('form.error.shouldNotBeEmpty')}
                                }
                              })
                            }
                          }}
                          error={checkString(nature)}
                        />
                      </CustomField>
                      <Typography style={{color: 'red', fontWeight: '500'}}>
                        {errorsOptions.nature.status ? errorsOptions.nature.message : ''}
                      </Typography>
                    </div>

                    <div className="mb-4">
                      <CustomField label={t('report.speaker')}>
                        <CustomTextField
                          id="speaker"
                          placeholder={t('report.please_enter') + ' ' + t('report.speaker')}
                          onChange={(event) => {
                            if(event.target.value){
                              setSpeaker(event.target.value)
                              setErrorOptions(prev => {
                                return{
                                  ...prev,
                                  speaker: {status: false, message: ''}
                                }
                              })
                            } else {
                             
                              setErrorOptions(prev => {
                                return{
                                  ...prev,
                                  speaker: {status: true, message: t('form.error.shouldNotBeEmpty')}
                                }
                              })
                            }
                          }}
                          error={checkString(speaker)}
                        />
                      </CustomField>
                      <Typography style={{color: 'red', fontWeight: '500'}}>
                        {errorsOptions.speaker.status ? errorsOptions.speaker.message : ''}
                      </Typography>
                    </div>

                   <Grid item style={{display: 'flex', flexDirection: 'column'}}>
                      <CustomField label={t('report.targetParticipants')}>
                        <CustomTextField
                          id="targetParticipants"
                          placeholder={t('report.pleaseEnterTargetParticipants')}
                          onChange={(event) => {
                            if(event.target.value){
                              setActiveObj(event.target.value)
                              setErrorOptions(prev => {
                                return{
                                  ...prev,
                                  targetParticipants: {status: false, message: ''}
                                }
                              })
                            } else {
                              setErrorOptions(prev => {
                                return{
                                  ...prev,
                                  targetParticipants: {status: true, message: t('form.error.shouldNotBeEmpty')}
                                }
                              })
                            }
                           
                          }}
                          error={checkString(activeObj)}
                        />
                      </CustomField>
                      <Typography style={{color: 'red', fontWeight: '500'}}>
                      {errorsOptions.targetParticipants.status ? errorsOptions.targetParticipants.message : ''}
                    </Typography>
                   </Grid>
                  </Grid>
                )}
                <Grid item style={{display: 'flex', flexDirection: 'column'}}>
                  <CustomField label={t('report.numberOfPeople')}>
                    <CustomTextField
                      id="numberOfPeople"
                      placeholder={t('report.pleaseEnterNumberOfPeople')}
                      onChange={(event) => {
                        updateData(
                          item.serviceName as ServiceName,
                          'numberOfPeople',
                          parseInt(event.target.value, 10) || 0
                        )
                      }}
                      error={checkNumber(
                        serviceData[item.serviceName as keyof ServiceData]
                          .numberOfPeople
                      )}
                    />
                  </CustomField>
                  <Typography style={{color: 'red', fontWeight: '500'}}>
                    {errors[item.serviceName as keyof ErrorsServiceData].numberOfPeople.status ? errors[item.serviceName as keyof ErrorsServiceData].numberOfPeople.message : ''}
                  </Typography>
                </Grid>

                { index === 3 && (
                  <CustomField label={t('col.serviceType')}>
                    <CustomItemListBoolean
                      items={serviceTypeList}
                      setServiceFlg={setServiceFlg}
                      value={serviceFlg}
                    ></CustomItemListBoolean>
                  </CustomField>
                )

                }
                <Grid item style={{display: 'flex', flexDirection: 'column'}}>
                  {/* image field */}
                  <Box key={t('report.picture') + index}>
                    <Typography sx={styles.labelField}>
                      {t('report.picture')}
                    </Typography>
                    <ImageUploading
                      multiple
                      value={
                        serviceData[item.serviceName as keyof ServiceData]
                          .photoImage
                      }
                      onChange={(imageList, addUpdateIndex) =>
                        onImageChange(
                          imageList,
                          addUpdateIndex,
                          item.serviceName as ServiceName,
                        )
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
                                serviceData[item.serviceName as keyof ServiceData]
                                  .photoImage.length === 0 &&
                                localstyles.imgError)
                            }}
                          >
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
                  <Typography style={{color: 'red', fontWeight: '500'}}>
                    {errors[item.serviceName as keyof ErrorsServiceData].photoImage.status ? errors[item.serviceName as keyof ErrorsServiceData].photoImage.message : ''}
                  </Typography>
                </Grid>
              </Grid>
              <Divider />
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

export default AdditionalServicePict
