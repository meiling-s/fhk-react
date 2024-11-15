import { Box, Icon, Stack, Typography } from '@mui/material'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import CommonTypeContainer from '../contexts/CommonTypeContainer'
import { t } from 'i18next'
import dayjs from 'dayjs'
import { format } from '../constants/constant'
import { useEffect, useState } from 'react'
import { useContainer } from 'unstated-next'
import i18n from '../setups/i18n'
import { Languages } from '../constants/constant'
import { getDriverDetailById } from '../APICalls/jobOrder'

export interface ShippingDataType {
  senderId: string
  receiverId: string
  senderName?: string
  receiverName?: string
  picoId: string
  logisticId: string
  logisticName?: string
  pickupAt: string
  driverTable: string
  driverId: string
  driverName?: string
  senderAddr: string
  receiverAddr: string
  plateNo: string
}

const InventoryShippingCard = ({
  shippingData
}: {
  shippingData: ShippingDataType[]
}) => {
  const { companies } = useContainer(CommonTypeContainer)
  const [shippingDataNew, setShippingDataNew] =
    useState<ShippingDataType[]>(shippingData)

  const getDriverDetail = async (driverId: string, driverTable: string) => {
    const result = await getDriverDetailById(driverId, driverTable)
    if (result?.data) {
      const driverDetail = result?.data
      if (i18n.language === Languages.ENUS) return driverDetail.driverNameEng
      if (i18n.language === Languages.ZHCH) return driverDetail.driverNameSchi
      if (i18n.language === Languages.ZHHK) return driverDetail.driverNameTchi
    }
  }

  const updateShippingDataWithDriverName = async () => {
    const updatedShippingData = await Promise.all(
      shippingData.map(async (item) => {
        if (item.driverId && item.driverTable) {
          const driverName = await getDriverDetail(
            item.driverId,
            item.driverTable
          )
          return { ...item, driverName }
        }
        return item
      })
    )

    setShippingDataNew(updatedShippingData)
  }

  useEffect(() => {
    updateShippingDataWithDriverName()
  }, [shippingData])

  shippingData.map((item: ShippingDataType) => {
    if (item.logisticId) {
      const logistic = companies.find(
        (company) => company.id?.toString() == item.logisticId
      )
      if (logistic) {
        if (i18n.language === Languages.ENUS)
          item.logisticName = logistic.nameEng
        if (i18n.language === Languages.ZHCH)
          item.logisticName = logistic.nameSchi
        if (i18n.language === Languages.ZHHK)
          item.logisticName = logistic.nameTchi
      }
    }

    if (item.receiverId) {
      const receiverName = companies.find(
        (company) => company.id?.toString() == item.receiverId
      )

      if (receiverName) {
        if (i18n.language === Languages.ENUS)
          item.receiverName = receiverName.nameEng
        if (i18n.language === Languages.ZHCH)
          item.receiverName = receiverName.nameSchi
        if (i18n.language === Languages.ZHHK)
          item.receiverName = receiverName.nameTchi
      }
    }

    if (item.senderId) {
      const senderName = companies.find(
        (company) => company.id?.toString() == item.senderId
      )

      if (senderName) {
        if (i18n.language === Languages.ENUS)
          item.senderName = senderName.nameEng
        if (i18n.language === Languages.ZHCH)
          item.senderName = senderName.nameSchi
        if (i18n.language === Languages.ZHHK)
          item.senderName = senderName.nameTchi
      }
    }
  })

  return (
    <>
      {shippingDataNew.map((shipping, index) => (
        <Stack
          key={shipping.picoId}
          borderColor="#e2e2e2"
          p={2}
          borderRadius="12px"
          sx={{ borderWidth: '1px', borderStyle: 'solid' }}
          mt={1}
          spacing={1}
        >
          <Box display="flex" alignItems={'center'} className="po-number">
            <Typography style={localstyles.name} width={'150px'}>
              {t('pick_up_order.table.pico_id')}
            </Typography>
            <Typography style={{ ...localstyles.poNumber, marginLeft: '60px' }}>
              {shipping.picoId}
            </Typography>
          </Box>
          <Box display="flex" alignItems={'center'}>
            <Box display="flex" width={'150px'} flexShrink={0}>
              <Icon
                sx={{
                  justifySelf: 'center',
                  display: 'flex',
                  mr: '5px',
                  color: '#acacac'
                }}
              >
                <LocalShippingOutlinedIcon />
              </Icon>
              <Typography style={localstyles.mini_title}>
                {t('check_out.logistic_company')}
              </Typography>
            </Box>
            <Box
              ml={'60px'}
              width={'400px'}
              sx={{ overflowWrap: 'break-word' }}
            >
              <Typography style={localstyles.mini_value}>
                {shipping?.logisticName}
              </Typography>
            </Box>
          </Box>
          <Box display="flex">
            <Box display="flex" width={'150px'} flexShrink={0}>
              <Icon
                sx={{
                  justifySelf: 'center',
                  display: 'flex',
                  mr: '5px',
                  color: '#acacac'
                }}
              >
                <Inventory2OutlinedIcon />
              </Icon>
              <Typography style={localstyles.mini_title}>
                {t('pick_up_order.card_detail.sender_and_receiver_company')}
              </Typography>
            </Box>
            <Box
              ml={'60px'}
              width={'400px'}
              sx={{ overflowWrap: 'break-word' }}
            >
              <Typography
                sx={{ overflowWrap: 'break-word' }}
                style={localstyles.mini_value}
              >
                {shipping?.senderName} → {shipping?.receiverName}
              </Typography>
            </Box>
          </Box>
          <Box display="flex">
            <Box display="flex" width={'150px'} height={'30px'} flexShrink={0}>
              <Icon
                sx={{
                  justifySelf: 'center',
                  display: 'flex',
                  mr: '5px',
                  color: '#acacac'
                }}
              >
                <PlaceOutlinedIcon />
              </Icon>
              <Typography style={localstyles.mini_title}>
                {t('pick_up_order.card_detail.sender_and_receiver_location')}
              </Typography>
            </Box>
            <Box
              ml={'60px'}
              width={'400px'}
              sx={{ overflowWrap: 'break-word' }}
            >
              <Typography style={localstyles.mini_value}>
                {shipping?.senderAddr} → {shipping.receiverAddr}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Box style={localstyles.informationContainer}>
              <Typography style={localstyles.information}>
                {t('inventory.at')}{' '}
                {dayjs(new Date(shipping.pickupAt)).format(format.dateFormat1)}{' '}
                {t('inventory.handover')}【{shipping.driverName}
                {shipping.plateNo}】
              </Typography>
            </Box>
          </Box>
        </Stack>
      ))}
    </>
  )
}

export default InventoryShippingCard

const localstyles = {
  name: {
    fontSize: 15,
    fontWeight: 700
  },
  poNumber: {
    fontSize: 13,
    fontWeight: 400,
    color: '#717171'
  },
  logisticName: {
    fontSize: 12,
    color: '#717171',
    fontWeight: 400
  },
  informationContainer: {
    marginTop: 10,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    padding: '4px 8px'
  },
  information: {
    fontSize: 12,
    fontWeight: 400,
    color: '#79CA25'
  },
  mini_title: {
    fontSize: '12px',
    color: '#acacac',
    letterSpacing: '1px'
  },
  mini_value: {
    fontSize: '13px',
    color: '#535353',
    letterSpacing: '1px'
  }
}
