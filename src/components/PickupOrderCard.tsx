import { Box, Icon, Stack, Typography } from '@mui/material'
import CustomField from './FormComponents/CustomField'
import StatusCard from './StatusCard'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined'
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import { PickupOrderDetail } from '../interfaces/pickupOrder'
import LocalizeRecyctype from './TableComponents/LocalizeRecyctype'
import { useTranslation } from 'react-i18next'
import { formatWeight } from '../utils/utils'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../contexts/CommonTypeContainer'

const PickupOrderCard = ({
  pickupOrderDetail
}: {
  pickupOrderDetail: PickupOrderDetail[]
}) => {
  const { t } = useTranslation()

  const recyc = LocalizeRecyctype(pickupOrderDetail)
  const { decimalVal } = useContainer(CommonTypeContainer)

  return (
    <>
      {pickupOrderDetail.map((podetail, index) => (
        <Stack
          key={index}
          borderColor="#e2e2e2"
          p={2}
          borderRadius="12px"
          sx={{ borderWidth: '1px', borderStyle: 'solid' }}
          spacing={1}
        >
          <Box display="flex" justifyContent="space-between">
            <Box>
              {/* {recyc
                ?.filter(
                  (item, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.recycType === item.recycType &&
                        t.recycSubType === item.recycSubType
                    )
                )
                .map((a, index) => ( */}
              {/* {recyc?.length != 0 && recyc && ( */}
              <Box key={index}>
                <CustomField
                  label={t('pick_up_order.card_detail.main_category')}
                >
                  <Typography sx={localstyles.typo_fieldContent}>
                    {recyc?.length != 0 && recyc
                      ? recyc[index]?.recycType
                      : '-'}
                  </Typography>
                </CustomField>
                <CustomField
                  label={t('pick_up_order.card_detail.subcategory')}
                  style={{ marginTop: '12px' }}
                >
                  <Typography sx={localstyles.typo_fieldContent}>
                    {recyc?.length != 0 && recyc
                      ? recyc[index].recycSubType
                      : '-'}
                  </Typography>
                </CustomField>
              </Box>
              {/* )} */}

              {/* ))} */}
            </Box>
            <Box>
              <StatusCard status={podetail?.status} />
            </Box>
          </Box>
          <Box display="flex" mt={'15px !important'}>
            <Box display="flex" width={'150px'}>
              <Icon
                sx={{
                  justifySelf: 'center',
                  display: 'flex',
                  mr: '5px',
                  color: '#acacac'
                }}
              >
                <AccessTimeIcon />
              </Icon>
              <Typography style={localstyles.mini_title}>
                {t('pick_up_order.card_detail.shipping_time')}
              </Typography>
            </Box>
            <Typography ml="60px" style={localstyles.mini_value}>
              {podetail.pickupAt}
            </Typography>
          </Box>
          <Box display="flex">
            <Box display="flex" width={'150px'}>
              <Icon
                sx={{
                  justifySelf: 'center',
                  display: 'flex',
                  mr: '5px',
                  color: '#acacac'
                }}
              >
                <MonitorWeightOutlinedIcon />
              </Icon>
              <Typography style={localstyles.mini_title}>
                {t('pick_up_order.card_detail.weight')}
              </Typography>
            </Box>
            <Typography ml="60px" style={localstyles.mini_value}>
              { formatWeight(podetail.weight, decimalVal)} kg
            </Typography>
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
                {t('pick_up_order.card_detail.shipping_receiver')}
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
                {podetail?.senderName} - {podetail?.receiverName}
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
                {t('pick_up_order.card_detail.deliver_location')}
              </Typography>
            </Box>
            <Box
              ml={'60px'}
              width={'400px'}
              sx={{ overflowWrap: 'break-word' }}
            >
              <Typography style={localstyles.mini_value}>
                {podetail?.senderAddr} --- {podetail.receiverAddr}
              </Typography>
            </Box>
          </Box>
        </Stack>
      ))}
    </>
  )
}

export default PickupOrderCard

const localstyles = {
  typo_fieldContent: {
    fontSize: '15px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    marginTop: '2px'
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
