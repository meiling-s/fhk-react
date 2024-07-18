import { FunctionComponent, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import CheckIcon from '@mui/icons-material/Check'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ImageIcon from '@mui/icons-material/Image'
import AspectRatio from '@mui/joy/AspectRatio'
import {
  CheckOut,
  CheckoutDetail,
  CheckoutDetailPhoto
} from '../../../interfaces/checkout'

import RightOverlayForm from '../../../components/RightOverlayForm'
import { Box, Stack } from '@mui/material'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import { useContainer } from 'unstated-next'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { format } from '../../../constants/constant'
import i18n from '../../../setups/i18n'
import { localStorgeKeyName } from '../../../constants/constant'
import { formatWeight } from '../../../utils/utils'
import { getDetailCheckoutRequests } from '../../../APICalls/Collector/checkout'

dayjs.extend(utc)
dayjs.extend(timezone)

type RecycItem = {
  recycType: il_item
  recycSubtype: il_item
  weight: number
  images: CheckoutDetailPhoto[]
  packageTypeId: string
}

interface CheckOutDetailsProps {
  selectedCheckOut?: CheckOut
  drawerOpen: boolean
  handleDrawerClose: () => void
}

const CheckOutDetails: FunctionComponent<CheckOutDetailsProps> = ({
  selectedCheckOut,
  drawerOpen = false,
  handleDrawerClose
}) => {
  const { t } = useTranslation()
  const { recycType, decimalVal, dateFormat } = useContainer(CommonTypeContainer)
  const [selectedDetail, setSelectedDetail] = useState<
    CheckoutDetail[] | undefined
  >([])
  const [recycItem, setRecycItem] = useState<RecycItem[]>([])

  const poNumber =
    selectedCheckOut?.picoId != null ? `${selectedCheckOut.picoId}` : ''
  const shippingInfo = [
    {
      label: t('check_out.logistic_company'),
      value: selectedCheckOut?.logisticName
    },
    {
      label: t('check_out.shipping_company'),
      value: selectedCheckOut?.senderName
    },
    {
      label: t('check_out.receiver_company'),
      value: selectedCheckOut?.receiverName
    }
  ]

  const loginId = localStorage.getItem(localStorgeKeyName.username) || ""

  const updatedDate = selectedCheckOut?.updatedAt
    ? dayjs.utc(new Date(selectedCheckOut?.updatedAt)).tz('Asia/Hong_Kong').format(`${dateFormat} HH:mm`)
    : '-'
  const messageCheckout = `[${loginId}] ${t(
    'check_out.approved_on'
  )} ${updatedDate} ${t('check_out.reason_is')} ${selectedCheckOut?.reason}`

  useEffect(() => {
    setSelectedDetail(selectedCheckOut?.checkoutDetail)
    initCheckoutDetail(selectedCheckOut?.chkOutId)
  }, [selectedCheckOut])

  const initCheckoutDetail = async (chkOutId: number | undefined) => {
    if (chkOutId !== undefined) {
      const result = await getDetailCheckoutRequests(chkOutId)
      if (result) {
        const recycItems: RecycItem[] = []
        const data = result.data
        
        data.forEach((detail: CheckoutDetail) => {
          const matchingRecycType = recycType?.find(
            (recyc) => detail.recycTypeId === recyc.recycTypeId
          );
          if (matchingRecycType) {
            const matchrecycSubType = matchingRecycType.recycSubType?.find(
              (subtype) => subtype.recycSubTypeId === detail.recycSubTypeId
            );
            var name = "";
            switch (i18n.language) {
              case 'enus':
                name = matchingRecycType.recyclableNameEng
                break
              case 'zhch':
                name = matchingRecycType.recyclableNameSchi
                break
              case 'zhhk':
                name = matchingRecycType.recyclableNameTchi
                break
              default:
                name = matchingRecycType.recyclableNameTchi
                break
            }
            var subName = ''
            switch (i18n.language) {
              case 'enus':
                subName = matchrecycSubType?.recyclableNameEng ?? ''
                break
              case 'zhch':
                subName = matchrecycSubType?.recyclableNameSchi ?? ''
                break
              case 'zhhk':
                subName = matchrecycSubType?.recyclableNameTchi ?? ''
                break
              default:
                subName = matchrecycSubType?.recyclableNameTchi ?? '' //default fallback language is zhhk
                break
            }
            recycItems.push({
              recycType: {
                name: name,
                id: detail.chkOutDtlId.toString()
              },
              recycSubtype: {
                name: subName,
                id: detail.chkOutDtlId.toString()
              },
              weight: detail.weight,
              images: detail.checkoutDetailPhoto,
              packageTypeId: detail.packageTypeId
            })

          }
        })
        setRecycItem(recycItems)
      }
    }
  }

  return (
    <div className="checkin-request-detail">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={'none'}
        headerProps={{
          title: t('check_out.request_check_out'),
          subTitle: poNumber,
          onCloseHeader: handleDrawerClose
        }}
      >
        <div
          style={{ borderTop: '1px solid lightgrey' }}
          className="content p-6"
        >
          <Stack spacing={4}>

            {selectedCheckOut?.adjustmentFlg &&
               <Box>
               <div className="bg-[#FBFBFB] rounded-sm flex items-center gap-2 p-2 adjustmen-inventory">
                 <CheckIcon className="text-[#79CA25]" />
                 {t('check_out.stock_adjustment')}
               </div>
             </Box>
            }
            <Box>
              <div className="shiping-information text-base text-[#717171] font-bold">
                {t('check_out.shipping_info')}
              </div>
            </Box>
            <Box>
              {shippingInfo.map((item, index) => (
                <div
                  key={index}
                  className={`wrapper ${index === shippingInfo.length - 1 ? '' : 'mb-6'
                    }`}
                >
                  <div className="shiping-information text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                    {item.label}
                  </div>
                  <div className="shiping-information text-mini text-black font-bold tracking-widest">
                    {item.value}
                  </div>
                </div>
              ))}
            </Box>
            <Box>
              <div className="recyle-loc-info shiping-information text-base text-[#717171] tracking-widest font-bold">
                {t('check_out.recyc_loc_info')}
              </div>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <div className="delivery-loc">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t('check_out.delivery_location')}
                </div>
                <div className="text-mini text-black font-bold tracking-widest">
                  {selectedCheckOut?.receiverAddr}
                </div>
              </div>
              <ArrowForwardIcon className="text-gray" />
              <div className="arrived">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t('check_out.arrival_location')}
                </div>
                <div className="text-mini text-black font-bold tracking-widest">
                {selectedCheckOut?.senderAddr}
                </div>
              </div>
            </Box>
            <Box>
              <div className="recyle-type-weight text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                {t('check_out.recyclable_type_weight')}
              </div>
              {recycItem.map((item, index) => (
                <div
                  key={index}
                  className="recyle-item px-4 py-3 rounded-xl border border-solid border-[#E2E2E2] mt-2"
                >
                  <div className="detail flex justify-between items-center">
                    <div className="recyle-type flex items-center gap-2">
                      <div className="category" style={categoryRecyle}>
                        {item.packageTypeId}
                      </div>
                      <div className="type-item">
                        <div className="sub-type text-xs text-black font-bold tracking-widest">
                          {item.recycType.name}
                        </div>
                        <div className="type text-mini text-[#ACACAC] font-normal tracking-widest mb-2">
                          {item.recycSubtype.name}
                        </div>
                      </div>
                    </div>
                    <div className="weight font-bold font-base">
                      {formatWeight(item.weight, decimalVal)} kg
                    </div>
                  </div>
                  <div className="images mt-3 grid lg:grid-cols-4 sm:rid grid-cols-2 gap-4">
                    {item.images.map((img, index) => (
                      <img
                        src={img.photo}
                        alt=""
                        key={index}
                        className="w-[115px] rounded-xl"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </Box>
            <Box>
              { selectedCheckOut?.status !== 'CREATED' &&
                <div className="message">
                  <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                    {t('check_out.message')}
                  </div>
                  <div className=" text-sm text-[#717171] font-medium tracking-widest">
                    {messageCheckout}
                  </div>
                </div>
              }
              
            </Box>
          </Stack>
        </div>
      </RightOverlayForm>
    </div>
  )
}

const categoryRecyle: React.CSSProperties = {
  height: '25px',
  width: '25px',
  padding: '4px',
  textAlign: 'center',
  background: 'lightskyblue',
  lineHeight: '25px',
  borderRadius: '25px',
  color: 'darkblue'
}

export default CheckOutDetails
