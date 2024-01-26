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
import CustomDatePicker from '../../../components/FormComponents/CustomDatePicker'
import SpecificDate from '../../../components/SpecializeComponents/PicoRoutineSelect/SpecificDate/SpecificDate'

import { styles } from '../../../constants/styles'
import { CAMERA_OUTLINE_ICON } from '../../../themes/icons'

import { TENANT_REGISTER_CONFIGS } from '../../../constants/configs'
import dayjs, { Dayjs } from 'dayjs'

const AdditionalServicePict: FunctionComponent = () => {
  const { t } = useTranslation()
  // const [startDate, setStartDate] = useState<Dayjs | null>(dayjs('2022-04-17'))
  // const [endDate, setEnddate] = useState<Dayjs | null>(dayjs('2022-04-17'))
  // const [place, setPlace] = useState<string>('')
  // const [numberOfPeople, setNumberOfPeople] = useState<string>('')
  // const [EPDImages, setEDPImages] = useState<ImageListType>([])

  interface Item {
    startDate: Dayjs | null
    endDate: Dayjs | null
    place: string
    numberOfPeople: string
    // Add other fields as needed
  }

  const [dataArray, setDataArray] = useState<Item[]>([])

  const data: Array<{
    startDate: Dayjs | null
    endDate: Dayjs | null
    place: string
    numberOfPeople: string
    EPDImages: ImageListType
  }> = [
    {
      startDate: dayjs('2022-04-17'),
      endDate: dayjs('2022-04-18'),
      place: 'Location 1',
      numberOfPeople: '5',
      EPDImages: []
    },
    {
      startDate: dayjs('2022-04-19'),
      endDate: dayjs('2022-04-20'),
      place: 'Location 2',
      numberOfPeople: '8',
      EPDImages: []
    },
    {
      startDate: dayjs('2022-04-19'),
      endDate: dayjs('2022-04-20'),
      place: 'Location 2',
      numberOfPeople: '8',
      EPDImages: []
    }
    // Add more data sets as needed
  ]

  const [trySubmited, setTrySubmited] = useState<boolean>(false)

  const submitServiceInfo = () => {}

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    //setEDPImages(imageList)

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

  const updateData = (index: number, field: keyof Item, value: any) => {
    setDataArray((prevData) => {
      const newData = [...prevData]
      newData[index] = {
        ...newData[index],
        [field]: value
      }
      return newData
    })
  }

  return (
    <Box className="container-wrapper w-full">
      <div className="settings-page bg-bg-primary">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          {data.map((item, index) => (
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
                      value={item.startDate}
                      onChange={(newValue: any) => {
                        // Assuming you have a function to update the item's start date
                        updateData(index, 'startDate', newValue)
                      }}
                      sx={{ ...localstyles.datePicker }}
                    />
                  </Box>
                </Grid>
                <Grid item>
                  <Typography sx={styles.header3}>{'至'}</Typography>
                  <Box sx={{ ...localstyles.DateItem }}>
                    <DatePicker
                      value={item.endDate}
                      onChange={(newValue: any) => {
                        // Assuming you have a function to update the item's end date
                        updateData(index, 'endDate', newValue)
                      }}
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
                      updateData(index, 'place', event.target.value)
                    }}
                    multiline={true}
                    value={item.place}
                    error={checkString(item.place)}
                  />
                </CustomField>
                <CustomField label={t('col.premiseName')}>
                  <CustomTextField
                    id="numberOfPeople"
                    placeholder={t('col.enterName')}
                    onChange={(event) => {
                      // Assuming you have a function to update the item's number of people
                      updateData(index, 'numberOfPeople', event.target.value)
                    }}
                    error={checkString(item.numberOfPeople)}
                  />
                </CustomField>
                <Grid item>
                  {/* image field */}
                  <Box key={'圖片'}>
                    <Typography sx={styles.labelField}>{'圖片'}</Typography>
                    <ImageUploading
                      multiple
                      value={item.EPDImages}
                      onChange={(imageList, addUpdateIndex) =>
                        onImageChange(imageList, addUpdateIndex)
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
                { marginBottom: { md: 0, xs: 2 } }
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
