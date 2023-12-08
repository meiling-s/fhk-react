import { FunctionComponent, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import CheckIcon from '@mui/icons-material/Check'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ImageIcon from '@mui/icons-material/Image'
import AspectRatio from '@mui/joy/AspectRatio'

import RightOverlayForm from '../../../components/RightOverlayForm'
import { Box, Stack } from '@mui/material'

interface CheckInDetailsProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
}

const CheckInDetails: FunctionComponent<CheckInDetailsProps> = ({
  drawerOpen = false,
  handleDrawerClose
}) => {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const shippingInfo = [
    {
      label: '物流公司',
      value: '物流公司'
    },
    {
      label: '寄件公司',
      value: '寄件公司'
    },
    {
      label: '收件公司',
      value: '收件公司'
    }
  ]
  const rycleItem = [
    {
      category: '袋',
      type: '報紙',
      subtype: '廢紙',
      weight: '5',
      img: ['../Image.png', '../Image.png']
    },
    {
      category: '盒',
      type: '鋁罐',
      subtype: '金屬',
      weight: '5',
      img: ['../Image.png']
    }
  ]

  return (
    <div className="checkin-request-detail">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={'none'}
        headerProps={{
          title: '送入請求',
          subTitle: 'PO12345678',
          onCloseHeader: handleDrawerClose
        }}
      >
        <div
          style={{ borderTop: '1px solid lightgrey' }}
          className="content p-6"
        >
          <Stack spacing={4}>
            <Box>
              <div className="bg-[#FBFBFB] rounded-sm flex items-center gap-2 p-2 adjustmen-inventory">
                <CheckIcon className="text-[#79CA25]" />
                調整庫存
              </div>
            </Box>
            <Box>
              <div className="shiping-information text-base text-[#717171] font-bold">
                運輸資料
              </div>
            </Box>
            <Box>
              {shippingInfo.map((item, index) => (
                <div
                  key={index}
                  className={`wrapper ${
                    index === shippingInfo.length - 1 ? '' : 'mb-6'
                  }`}
                >
                  <div className="shiping-information text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                    {item.label}
                  </div>
                  <div className="shiping-information text-mini text-black font-bold tracking-widest">
                    {item.label}
                  </div>
                </div>
              ))}
            </Box>
            <Box>
              <div className="recyle-loc-info shiping-information text-base text-[#717171] tracking-widest font-bold">
                回收地點資料
              </div>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '10px' // Adjust the gap as needed
              }}
            >
              <div className="delivery-loc">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  送出地點
                </div>
                <div className="text-mini text-black font-bold tracking-widest">
                  綠在堅城
                </div>
              </div>
              <ArrowForwardIcon className="text-gray" />
              <div className="arrived">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  到達地點
                </div>
                <div className="text-mini text-black font-bold tracking-widest">
                  火炭
                </div>
              </div>
            </Box>
            <Box>
              <div className="recyle-type-weight text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                回收物類別及重量
              </div>
              {rycleItem.map((item, index) => (
                <div
                  key={index}
                  className="recyle-item px-4 py-3 rounded-xl border border-solid border-[#E2E2E2] mt-2"
                >
                  <div className="detail flex justify-between items-center">
                    <div className="recyle-type flex items-center gap-2">
                      <div className="category" style={categoryRecyle}>
                        {item.category}
                      </div>
                      <div className="type-item">
                        <div className="sub-type text-xs text-black font-bold tracking-widest">
                          {item.type}
                        </div>
                        <div className="type text-mini text-[#ACACAC] font-normal tracking-widest mb-2">
                          {item.subtype}
                        </div>
                      </div>
                    </div>
                    <div className="weight font-bold font-base">
                      {item.weight}kg
                    </div>
                  </div>
                  <div className="images mt-3 grid grid-cols-4 gap-4">
                    {item.img.map((img, index) => (
                      <img src={img} alt="" key={index} />
                    ))}
                  </div>
                </div>
              ))}
            </Box>
            <Box>
              <div className="message">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  訊息
                </div>
                <div className=" text-sm text-[#717171] font-medium tracking-widest">
                  [UserID] 核準於 2023/09/24 17:00，原因為 [RejectReason]
                </div>
              </div>
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

export default CheckInDetails
