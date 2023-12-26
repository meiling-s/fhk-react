import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import React, { useState } from 'react'
import { styles } from '../../../constants/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { t } from 'i18next'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useNavigate } from 'react-router-dom'
import { TYPE } from 'react-toastify/dist/utils'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomSwitch from '../../../components/FormComponents/CustomSwitch'
import CustomPeriodSelect from '../../../components/FormComponents/CustomPeriodSelect'
import { openingPeriod } from '../../../interfaces/collectionPoint'
import dayjs from 'dayjs'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { useFormik } from 'formik'
import CustomItemList, {
  il_item
} from '../../../components/FormComponents/CustomItemList'
import CustomDatePicker2 from '../../../components/FormComponents/CustomDatePicker2'
import { createPickUpOrder } from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import { useTranslation } from 'react-i18next'

const CreatePickupOrder = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleHeaderOnClick = () => {
    console.log('Header click')
    navigate(-1) //goback to last page
  }

  // {
  //   "tenantId": 0,
  //   "picoType": "AD_HOC",
  //   "effFrmDate": "2023-12-26",
  //   "effToDate": "2023-12-26",
  //   "routineType": "daily",
  //   "routine": [
  //     "string"
  //   ],
  //   "logisticId": "string",
  //   "logisticName": "string",
  //   "vehicleTypeId": "string",
  //   "platNo": "string",
  //   "contactNo": "string",
  //   "status": "CREATED",
  //   "reason": "string",
  //   "normalFlg": true,
  //   "contractNo": "string",
  //   "createdBy": "string",
  //   "updatedBy": "string",
  //   "createPicoDetail": [
  //     {
  //       "senderId": "string",
  //       "senderName": "string",
  //       "senderAddr": "string",
  //       "senderAddrGps": [
  //         0
  //       ],
  //       "receiverId": "string",
  //       "receiverName": "string",
  //       "receiverAddr": "string",
  //       "receiverAddrGps": [
  //         0
  //       ],
  //       "pickupAt": "23:59:59",
  //       "status": "CREATED",
  //       "createdBy": "string",
  //       "updatedBy": "string",
  //       "item": {
  //         "recycType": "string",
  //         "recycSubType": "string",
  //         "weight": 0,
  //         "picoHisId": 0
  //       }
  //     }
  //   ]
  // }
  const carType: il_item[] = [
    {
      id: '1',
      name: '小型货车'
    },
    {
      id: '2',
      name: '大型货车'
    }
  ]
  const DropOffReason: il_item[] = [
    {
      id: '1',
      name: '坏车'
    },
    {
      id: '2',
      name: '货物过剩'
    }
  ]
  const formik = useFormik({
    initialValues: {
      logistic: '',
      carNumber: '',
      contactNumber: '',
      carType: '',
      Date: {
        startDate: '',
        endDate: ''
      },
      DropOff: ''
    },
    onSubmit: async (values) => {
      const result = await createPickUpOrder(values)
      const data = result?.data.content
      if (data) {
        navigate('/collector/pickupOrder')
      }
      //alert(JSON.stringify(values, null, 2))
    }
  })
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={styles.innerScreen_container}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="zh-cn"
          >
            <Grid
              container
              direction={'column'}
              spacing={2.5}
              sx={{ ...styles.gridForm }}
            >
              <Grid item>
                <Button
                  sx={[styles.headerSection]}
                  onClick={handleHeaderOnClick}
                >
                  <ArrowBackIosIcon sx={{ fontSize: 15, marginX: 0.5 }} />
                  <Typography sx={styles.header1}>
                    {t('pick_up_order.create_pick_up_order')}
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Typography sx={styles.header2}>
                  {t('pick_up_order.shipping_info')}
                </Typography>
              </Grid>
              <Grid item>
                <CustomField
                  label={t('pick_up_order.select_shipping_category')}
                >
                  <CustomSwitch
                    onText={t('pick_up_order.regular_shipping')}
                    offText={t('pick_up_order.one-transport')}
                    defaultValue={true}
                    setState={(value) => formik.setFieldValue('carType', value)}
                    value={formik.values.carType}
                  />
                </CustomField>
              </Grid>
              <Grid item display="flex">
                <CustomDatePicker2
                  pickupOrderForm={true}
                  setDate={(values) => formik.setFieldValue('Date', values)}
                />
              </Grid>
              <Grid item>
                <CustomField label={t('pick_up_order.choose_logistic')}>
                  <CustomTextField
                    id="logistic"
                    placeholder={t('pick_up_order.enter_comapy_name')}
                    onChange={formik.handleChange}
                    value={formik.values.logistic}
                  ></CustomTextField>
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={t('pick_up_order.vehicle_category')}>
                  <CustomItemList
                    items={carType}
                    multiSelect={(values) =>
                      formik.setFieldValue('carType', values)
                    }
                    value={formik.values.carType}
                  />
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={t('pick_up_order.plat_number')}>
                  <CustomTextField
                    id="carNumber"
                    placeholder={t('pick_up_order.enter_plat_number')}
                    onChange={formik.handleChange}
                    value={formik.values.carNumber}
                  ></CustomTextField>
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={t('pick_up_order.contact_number')}>
                  <CustomTextField
                    id="contactNumber"
                    placeholder={t('pick_up_order.enter_contact_number')}
                    onChange={formik.handleChange}
                    value={formik.values.contactNumber}
                  ></CustomTextField>
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={t('pick_up_order.reason_get_off')}>
                  <CustomItemList
                    items={DropOffReason}
                    multiSelect={(values) =>
                      formik.setFieldValue('DropOff', values)
                    }
                    value={formik.values.carType}
                  />
                </CustomField>
              </Grid>
              <Grid item>
                <CustomField label={t('pick_up_order.recyle_loc_info')}>
                  <Typography>P012345678</Typography>
                </CustomField>
              </Grid>

              <Grid item>
                <Stack direction={'row'} spacing={10}>
                  <Typography sx={localstyles.txtHeader}>
                    {'运送时间'}
                  </Typography>
                  <Typography sx={localstyles.txtHeader}>{'主类别'}</Typography>
                  <Typography sx={localstyles.txtHeader}>{'次类别'}</Typography>
                  <Typography sx={localstyles.txtHeader}>{'重量'}</Typography>
                  <Typography sx={localstyles.txtHeader}>
                    {'寄件公司'}
                  </Typography>
                  <Typography sx={localstyles.txtHeader}>
                    {'收件公司'}
                  </Typography>
                  <Typography sx={localstyles.txtHeader}>
                    {'回收地点'}
                  </Typography>
                  <Typography sx={localstyles.txtHeader}>
                    {'到达地点'}
                  </Typography>
                </Stack>
              </Grid>

              <Grid item>
                <Button
                  type="submit"
                  sx={[styles.buttonFilledGreen, localstyles.localButton]}
                >
                  {t('pick_up_order.finish')}
                </Button>
                <Button
                  sx={[styles.buttonOutlinedGreen, localstyles.localButton]}
                  onClick={handleHeaderOnClick}
                >
                  {t('col.cancel')}
                </Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Box>
      </form>
    </>
  )
}
let localstyles = {
  btn_WhiteGreenTheme: {
    borderRadius: '20px',
    borderWidth: 1,
    borderColor: '#79ca25',
    backgroundColor: 'white',
    color: '#79ca25',
    fontWeight: 'bold',
    '&.MuiButton-root:hover': {
      bgcolor: '#F4F4F4',
      borderColor: '#79ca25'
    }
  },
  table: {
    minWidth: 750,
    borderCollapse: 'separate',
    borderSpacing: '0px 10px'
  },
  headerRow: {
    //backgroundColor: "#97F33B",
    borderRadius: 10,
    mb: 1,
    'th:first-child': {
      borderRadius: '10px 0 0 10px'
    },
    'th:last-child': {
      borderRadius: '0 10px 10px 0'
    }
  },
  row: {
    backgroundColor: '#FBFBFB',
    borderRadius: 10,
    mb: 1,
    'td:first-child': {
      borderRadius: '10px 0 0 10px'
    },
    'td:last-child': {
      borderRadius: '0 10px 10px 0'
    }
  },
  headCell: {
    border: 'none',
    fontWeight: 'bold'
  },
  bodyCell: {
    border: 'none'
  },
  typo: {
    color: 'grey',
    fontSize: 14,
    fontWeight: 'bold',
    display: 'flex'
  },
  textField: {
    borderRadius: '10px',
    fontWeight: '500',
    '& .MuiOutlinedInput-input': {
      padding: '10px'
    }
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '34%',
    height: 'fit-content',
    padding: 4,
    backgroundColor: 'white',
    border: 'none',
    borderRadius: 5
  },
  textArea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    borderColor: '#ACACAC',
    borderRadius: 5
  },
  formButton: {
    width: '150px',
    borderRadius: 5,
    backgroundColor: '#79CA25',
    color: 'white',
    '&.MuiButton-root:hover': {
      backgroundColor: '#7AD123'
    }
  },
  localButton: {
    width: '200px',
    fontSize: 18,
    mr: 3
  },
  gridContainer: {
    width: '100%'
  },
  gridRow: {
    width: '100%',
    flexDirection: 'row',
    marginY: 1
  },
  dataRow: {
    backgroundColor: '#FBFBFB',
    borderRadius: 5,
    paddingX: 2
  },
  txtHeader: {
    ...styles.header3,
    pl: 1
  },
  tableCell: {
    display: 'flex',
    alignSelf: 'center'
  }
}

export default CreatePickupOrder
