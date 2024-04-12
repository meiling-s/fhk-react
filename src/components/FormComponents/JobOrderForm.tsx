import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { styles } from '../../constants/styles'
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab'
import CustomField from './CustomField'
import StatusCard from '../StatusCard'
import { DriverDetail, JobListOrder, Row } from '../../interfaces/JobOrderInterfaces'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { displayCreatedDate } from '../../utils/utils'
import { localStorgeKeyName } from '../../constants/constant'
import { PickupOrderDetail } from '../../interfaces/pickupOrder'
import { getPicoById } from '../../APICalls/Collector/pickupOrder/pickupOrder'
import JobOrderCard from '../JobOrderCard'
import CustomButton from './CustomButton'
import { getDriverDetailById } from '../../APICalls/jobOrder'

const JobOrderForm = ({
  onClose,
  selectedRow,
  onApproved
}: {
  onClose?: () => void
  selectedRow: Row | null
  onApproved: () => void
}) => {
  const { t } = useTranslation()
  const role = localStorage.getItem(localStorgeKeyName.role)

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // If the overlay is clicked (not its children), close the modal
      onClose && onClose()
    }
  }
  const navigate = useNavigate()

  const [selectedJobOrder, setSelectedJobOrder] = useState<Row>()
  console.log(selectedJobOrder)
  const [pickupOrderDetail, setPickUpOrderDetail] = useState<PickupOrderDetail[]>()
  const [driverDetail, setDriverDetail] = useState<DriverDetail>()

  const getPicoDetail = async() => {
    if (selectedRow?.picoId) {
      const result = await getPicoById(selectedRow?.picoId.toString())
      if(result?.data.pickupOrderDetail?.length > 0) {
        const picoDetailItem = result?.data.pickupOrderDetail.find((item: { picoDtlId: number }) => item.picoDtlId === selectedRow?.picoDtlId)
        setPickUpOrderDetail([picoDetailItem])
      }
    }
  }
  const getDriverDetail = async() => {
    if (selectedRow?.driverId) {
      const result = await getDriverDetailById(selectedRow?.driverId.toString())
      if (result?.data) {
        setDriverDetail(result.data || {})
      }
    }
  }

  useEffect(() => {
    if (selectedRow) {
      setSelectedJobOrder(selectedRow)
      getPicoDetail()
      getDriverDetail()
    }
  }, [selectedRow])

  return (
    <>
      <Box sx={localstyles.modal} onClick={handleOverlayClick}>
        <Box sx={localstyles.container}>
          <Box sx={{ display: 'flex', flex: '1', p: 4, alignItems: 'center' }}>
            <Box>
              <Typography sx={styles.header4}>{t('job_order.item.detail')}</Typography>
              <Typography sx={styles.header3}>
                {selectedJobOrder?.joId}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexShrink: 0, ml: '20px' }}>
              <StatusCard status={selectedJobOrder?.status} />
            </Box>
            <Box sx={{ marginLeft: 'auto' }}>
              {
                selectedRow?.status === 'DENY' &&
                <CustomButton text={t('job_order.table.approve')} onClick={() => {
                  onApproved()
                }}></CustomButton>
              }
              <IconButton sx={{ ml: '25px' }} onClick={onClose}>
                <KeyboardTabIcon sx={{ fontSize: '30px' }} />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <Stack spacing={2} sx={localstyles.content}>
            <Box>
              <Typography sx={localstyles.typo_header}>{t('job_order.item.shipping_info')}</Typography>
            </Box>

            <CustomField label= {t('job_order.item.date_time')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedJobOrder?.createdAt ? displayCreatedDate(selectedJobOrder?.createdAt): ''}
              </Typography>
            </CustomField>

            <CustomField label={t('job_order.item.reference_po_number')}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedJobOrder?.picoId}
              </Typography>
            </CustomField>
            <Typography sx={localstyles.typo_header}>{t('job_order.item.rec_loc_info')}</Typography>
            <JobOrderCard plateNo={selectedRow?.plateNo} pickupOrderDetail={pickupOrderDetail ?? []} driverDetail={driverDetail} />
          </Stack>
        </Box>
      </Box>
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
  // header: {
  //   display: "flex",
  //   flex: 1,
  //   p: 4,
  //   alignItems:'center'

  //
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
    letterSpacing: '1px',
  },
  typo_fieldContent: {
    fontSize: '15px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    marginTop: '2px'
  }
}

export default JobOrderForm
