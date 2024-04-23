import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { styles } from '../../../constants/styles'
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab'
import CustomField from '../../../components/FormComponents/CustomField'
import StatusCard from '../../../components/StatusCard'
import PickupOrderCard from '../../../components/PickupOrderCard'
import { useNavigate } from 'react-router-dom'
import { getPurchaseOrderById } from '../../../APICalls/Manufacturer/purchaseOrder'
import { useTranslation } from 'react-i18next'
import { displayCreatedDate, getThemeColorRole, getThemeCustomList } from '../../../utils/utils'
import CustomButton from '../../../components/FormComponents/CustomButton'
import { Status, localStorgeKeyName } from '../../../constants/constant'
import {
  PurChaseOrder,
  Row,
  PurchaseOrderDetail
} from '../../../interfaces/purchaseOrder'
import PurchaseOrderCard from './PurchaseOrderCard'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { format } from '../../../constants/constant'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import RecyclablesList from '../../../components/SpecializeComponents/RecyclablesList'
import RecyclablesListSingleSelect from '../../../components/SpecializeComponents/RecyclablesListSingleSelect'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { singleRecyclable  } from '../../../interfaces/collectionPoint'
//---set custom style each role---
const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'
const colorTheme: string = getThemeColorRole(role) || '#79CA25'
const customListTheme = getThemeCustomList(role) || '#E4F6DC'
//---end set custom style each role---


const PurchaseOrderFormCreateOrEdit = ({
  onClose,
  selectedRow,
  isEdit,
  createdDate,
  arrived,
  index,
  onChangePurchaseOrder
}: {
  onClose?: () => void
  selectedRow?: PurchaseOrderDetail | null,
  isEdit?: boolean,
  createdDate?: string,
  arrived: string | undefined,
  index?: number,
  onChangePurchaseOrder?: (index: number, orderDetail: PurchaseOrderDetail, type: string, value: string, type2?: string, value2?: string) => void
}) => {
  const { t } = useTranslation() 
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs())
  const { recycType } = useContainer(CommonTypeContainer)
  const [defaultRecyc, setDefaultRecyc] = useState<singleRecyclable>({recycTypeId: selectedRow?.recycTypeId || '', recycSubTypeId: selectedRow?.recycSubTypeId || ''})
  const [receiverAddr, setReceiverAddr] = useState(arrived)
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurChaseOrder>()
  const [pickupOrderDetail, setPickUpOrderDetail] =  useState<PurchaseOrderDetail>()
  
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // If the overlay is clicked (not its children), close the modal
      onClose && onClose()
    }
  }
  
  useEffect(() => {
    if (selectedRow) {
      setPickUpOrderDetail(selectedRow)
      setDefaultRecyc({
        recycTypeId: selectedRow?.recycTypeId,
        recycSubTypeId: selectedRow?.recycSubTypeId
      })
    }
    if(createdDate){
      setStartDate(dayjs(createdDate))
    }
  }, [selectedRow])
  
  const onChangeData = (value: string, type: string) => {
    setPickUpOrderDetail((prev: any) => {
      return{
        ...prev,
        [type]: value
      }
    })
  }

  const onChangeRecycable = (recycTypeId: string, recycSubTypeId: string) => {
    setDefaultRecyc({
      recycTypeId,
      recycSubTypeId
    })
  };

  const onHandleUpdate = () => {
    if(index !== undefined && pickupOrderDetail && receiverAddr){
      let updateOrder = {
        ...pickupOrderDetail,
        recycTypeId: defaultRecyc?.recycTypeId,
        recycSubTypeId: defaultRecyc?.recycSubTypeId
      }
      
      onChangePurchaseOrder && onChangePurchaseOrder(index, updateOrder, 'receiverAddr', receiverAddr, 'createdAt',  dayjs(startDate).format('YYYY/MM/DD hh:mm'))
      onClose && onClose()
    }
  }
  
  return (
    <>
     <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
      <Box sx={localstyles.modal} onClick={handleOverlayClick}>
        <Box sx={localstyles.container}>
          <Box sx={{ display: 'flex', flex: '1', p: 4, alignItems: 'center' }}>
            <Box>
              <Typography sx={styles.header4}>
                {isEdit ? t('purchase_order_customer.createOrEdit.edit') : t('purchase_order_customer.createOrEdit.new')}
              </Typography>
              <Typography sx={styles.header3}>
                {selectedPurchaseOrder?.poId}
              </Typography>
            </Box>

            <Box sx={{ marginLeft: 'auto', display: 'flex' }}>
              <Grid sx={{display: 'flex', columnGap: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Button
                  onClick={onHandleUpdate}
                  sx={{
                    borderRadius: "20px",
                    backgroundColor: "#6BC7FF",
                    '&.MuiButton-root:hover':{bgcolor: '#6BC7FF'},
                    width:'fit-content',
                    height: "40px",
                    marginLeft:'20px'
                  }}
                  variant='contained'
                >
                  {t("purchase_order_customer.createOrEdit.finish")}
                </Button>

                <Button
                  onClick={onClose}
                  sx={{
                    borderRadius: "20px",
                    backgroundColor: "#6BC7FF",
                    '&.MuiButton-root:hover':{bgcolor: '#6BC7FF'},
                    width:'fit-content',
                    height: "40px",
                    marginLeft:'20px'
                  }}
                  variant='contained'
                >
                  {t("purchase_order_customer.createOrEdit.cancel")}
                </Button>
              </Grid>
              <IconButton sx={{ ml: '20px' }} onClick={onClose}>
                <KeyboardTabIcon sx={{ fontSize: '30px' }} />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <Stack spacing={2} sx={localstyles.content}>
            <Box>
              <Typography sx={localstyles.typo_header}>
                {t('purchase_order_customer.createOrEdit.receipt_date_and_time')}
              </Typography>
              <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Box sx={{ ...localstyles.DateItem }}>
                  <DatePicker
                    defaultValue={dayjs(startDate)}
                    format={format.dateFormat2}
                    onChange={(value) => setStartDate(value!!)}
                    sx={{ ...localstyles.datePicker }}
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
            </Box>

            <CustomField label={t('purchase_order_customer.createOrEdit.recycling_category')} mandatory>
              <RecyclablesListSingleSelect
                recycL={recycType ?? []}
                setState={(values) => {
                  onChangeRecycable(values?.recycTypeId, values.recycSubTypeId)
                }}
                itemColor={{
                  bgColor: customListTheme ? customListTheme.bgColor : '#E4F6DC',
                  borderColor: customListTheme ? customListTheme.border: '79CA25'
                }}
                defaultRecycL={defaultRecyc}
                key="proccess-typeid"
              />
            </CustomField>

            <CustomField
              label={t('purchase_order_customer.createOrEdit.estimated_weight')}
              mandatory
            >
              <CustomTextField
                id="weight"
                placeholder={t('userAccount.pleaseEnterNumber')}
                onChange={(event) => onChangeData(event.target.value, 'weight')}
                value={pickupOrderDetail?.weight}
                sx={{ width: '100%' }}
                endAdornment={
                  <InputAdornment position="end">kg</InputAdornment>
                }
              ></CustomTextField>
            </CustomField>

            <CustomField
              label={t('purchase_order_customer.createOrEdit.arrived')}
              mandatory
            >
              <CustomTextField
                id={'arrived'}
                placeholder={t('purchase_order_customer.createOrEdit.arrived')}
                rows={4}
                onChange={(event) => setReceiverAddr(event.target.value)}
                value={receiverAddr}
                sx={{ width: '100%' }}
              />
            </CustomField>
          </Stack>
        </Box>
      </Box>
      </LocalizationProvider>
    </>
  )
}

let localstyles = {
  modal: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    justifyContent: 'flex-end'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '40%',
    bgcolor: 'white',
    overflowY: 'scroll'
  },

  button: {
    borderColor: 'lightgreen',
    color: 'green',
    width: '100px',
    height: '35px',
    p: 1,
    borderRadius: '18px',
    mr: '10px'
  },

  content: {
    flex: 9,
    p: 4
  },
  typo_header: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#717171',
    letterSpacing: '1px',
    mt: '10px'
  },
  typo_fieldTitle: {
    fontSize: '13px',
    color: '#ACACAC',
    letterSpacing: '1px'
  },
  typo_fieldContent: {
    fontSize: '15px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    marginTop: '2px'
  },
  typo_fieldContentGray: {
    fontSize: '15px',
    fontWeight: '400',
    letterSpacing: '0.5px',
    marginTop: '2px',
    color: '#717171'
  },
  DateItem: {
    display: 'flex',
    height: 'fit-content',
    alignItems: 'center'
  },
  datePicker: {
    ...styles.textField,
    maxWidth: '370px',
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
}

export default PurchaseOrderFormCreateOrEdit
