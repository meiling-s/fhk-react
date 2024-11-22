import { Box, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

const StatusCard = ({ status }: { status: string | undefined }) => {
  const { t } = useTranslation()

  var bgColor = ''
  var fontColor = ''
  var name = ''
  switch (status) {
    case 'STARTED':
      bgColor = '#ECF5EE'
      fontColor = '#7CE495'
      name = t('status.started')
      break
    case 'CONFIRMED':
      bgColor = '#7CE495'
      fontColor = '#FFFFFF'
      name = t('status.confirmed')
      break
    case 'CREATED':
      bgColor = '#E4F6DC'
      fontColor = '#79CA25'
      name = t('status.created')
      break
    case 'ACTIVE':
      bgColor = '#E4F6DC'
      fontColor = '#79CA25'
      name = t('status.active')
      break
    case 'REJECTED':
      bgColor = '#FFF0F4'
      fontColor = '#FF4242'
      name = t('status.rejected')
      break
    case 'COMPLETED':
      bgColor = '#6BC7FF'
      fontColor = '#FFFFFF'
      name = t('status.completed')
      break
    case 'CLOSED':
      bgColor = '#ACACAC'
      fontColor = '#FFFFFF'
      name = t('status.closed')
      break
    case 'OUTSTANDING':
      bgColor = '#F4F4F4'
      fontColor = '#ACACAC'
      name = t('status.outstanding')
      break
    case 'SUSPEND':
      bgColor = '#ACACAC'
      fontColor = '#F4F4F4'
      name = t('status.suspend')
      break
    case 'INACTIVE':
      bgColor = '#F4F4F4'
      fontColor = '#ACACAC'
      name = t('status.inactive')
      break
    case 'DENY':
      bgColor = '#FFF0F4'
      fontColor = '#FF4242'
      name = t('status.deny')
      break
    case 'ASSIGNED':
      bgColor = '#E4F6DC'
      fontColor = '#79CA25'
      name = t('status.assigned')
      break
    case 'UNASSIGNED':
      bgColor = '#FFF0F4'
      fontColor = '#FF4242'
      name = t('status.unassigned')
      break
    // proccess records status
    case 'processing':
      bgColor = '#E1F4FF'
      fontColor = '#6BC7FF'
      name = t('processRecord.processing')
      break
    case 'confirmed':
      bgColor = '#6BC7FF'
      fontColor = '#FFFFFF'
      name = t('processRecord.confirmed')
      break
    case 'pending':
      bgColor = '#FFF0F4'
      fontColor = '#F5A4B7'
      name = t('processRecord.pending')
      break
    case 'rejected':
      bgColor = '#FF4242'
      fontColor = '#FFF0F4'
      name = t('processRecord.rejected')
      break
    case 'completed':
      bgColor = '#7CE495'
      fontColor = '#FFFFFF'
      name = t('processRecord.completed')
      break
    case 'cancelled':
      bgColor = '#BFBFBF'
      fontColor = '#FFFFFF'
      name = t('processRecord.cancelled')
      break
    case 'overdue':
      bgColor = '#ACACAC'
      fontColor = '#FFFFFF'
      name = t('processRecord.overdue')
      break
    default:
      break
  }
  return (
    <Box
      bgcolor={bgColor}
      width="max-width"
      height="20px"
      p={1}
      borderRadius="10px"
    >
      <Typography
        fontSize={15}
        textAlign="center"
        fontWeight="bold"
        color={fontColor}
      >
        {name}
      </Typography>
    </Box>
  )
}

export default StatusCard
