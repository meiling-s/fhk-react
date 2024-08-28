import { Box, Divider } from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import axios from 'axios'
import { AXIOS_DEFAULT_CONFIGS } from '../../../constants/configs'
import { GET_ALL_RECYCLE_TYPE } from '../../../constants/requests'
import { useEffect, useState } from 'react'
import { formatWeight, returnApiToken } from '../../../utils/utils'
import { useTranslation } from 'react-i18next'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import axiosInstance from '../../../constants/axiosInstance'
import {
  getCheckInDetailByID,
  getCheckOutDetailByID
} from '../../../APICalls/Collector/inout'

interface CheckInOutDetail {
  chkInId: number
  logisticName: string
  logisticId: string
  vehicleTypeId: string
  plateNo: string
  senderName: string
  senderId: string
  senderAddr: string
  senderAddrGps: number[]
  receiverName: string
  receiverAddr: string
  warehouseId: number
  colId: number
  status: string
  reason: string[]
  picoId: string
  signature: string
  normalFlg: boolean
  adjustmentFlg: boolean
  nightFlg: boolean
  createdBy: string
  updatedBy: string
  checkinDetail?: [
    {
      chkInDtlId: number
      recycTypeId: string
      recycSubTypeId: string
      packageTypeId: string
      weight: number
      unitId: string
      itemId: number
      picoDtlId: number | string
      checkinDetailPhoto?: [
        {
          sid: number
          photo: string
        }
      ]
      createdBy: string
      updatedBy: string
    }
  ]
  createdAt: string
  updatedAt: string
}

function unitName(unit: string) {
  var name = ''
  switch (unit?.toString()) {
    case '1':
      name = 'kg'
      break
    case '2':
      name = 'lb'
      break
  }
  return name
}

function packagingToText(packaging: string) {
  var text = ''
  switch (
    packaging //the space of circle text component can only hold 1 chinese word, need to discuss about this function
  ) {
    case 'PKG00001':
      text = '袋'
      break
    case 'PKG00002':
      text = '盒'
      break
    case 'PKG00003':
      text = '箱'
      break
  }
  return text
}

function packageTextColor(packaging: string) {
  var color = ''
  switch (packaging) {
    case 'PKG00001':
      color = '#36ABF3'
      break
    case 'PKG00002':
      color = '#ABAD30'
      break
    case 'PKG00003':
      color = '#FF4242'
      break
  }
  return color
}

function packageBgColor(packaging: string) {
  var color = ''
  switch (packaging) {
    case 'PKG00001':
      color = '#E1F4FF'
      break
    case 'PKG00002':
      color = '#F6F1DC'
      break
    case 'PKG00003':
      color = '#FFEBEB'
      break
  }
  return color
}

function CheckInAndCheckOutDetails({ isShow, setIsShow, selectedRow }: any) {
  const { decimalVal } = useContainer(CommonTypeContainer)

  const [recycType, setRecycType] = useState([])
  const [checkInOutData, setCheckInOutData] = useState<CheckInOutDetail | null>(
    null
  )
  const { t } = useTranslation()

  useEffect(() => {
    initCheckinoutDetail()
  }, [selectedRow])

  const initCheckinoutDetail = async () => {
    if (selectedRow !== null && selectedRow !== undefined) {
      let result
      const token = returnApiToken()
      if (selectedRow.chkInId) {
        result = await getCheckInDetailByID(
          selectedRow.chkInId,
          token.realmApiRoute
        )
      } else if (selectedRow.chkOutId) {
        result = await getCheckOutDetailByID(
          selectedRow.chkOutId,
          token.realmApiRoute
        )
      }
      const data = result?.data

      if (data) {
        initRecycType()
        setCheckInOutData(data)
      }
    }
  }
  const initRecycType = async () => {
    const token = returnApiToken()
    const AuthToken = token.authToken

    const { data } = await axiosInstance({
      baseURL: window.baseURL.collector,
      ...GET_ALL_RECYCLE_TYPE(),
      headers: {
        AuthToken
      }
    })

    setRecycType(data)
  }

  const recycleType = (id: string) => {
    const findRecyc: any = recycType?.find(
      (item: any) => item.recycTypeId === id
    )
    return findRecyc?.recyclableNameSchi
  }

  const recycleSubType = (id: string, subId: string) => {
    const parent: any = recycType?.find((item: any) => item.recycTypeId === id)
    const findSubRecyc: any = parent?.recycSubType?.find(
      (item: any) => item.recycSubTypeId === subId
    )
    return findSubRecyc?.recyclableNameSchi
  }

  return (
    <div className="detail-inventory">
      <RightOverlayForm
        open={isShow}
        onClose={() => setIsShow(false)}
        anchor={'right'}
        action={'none'}
        headerProps={{
          title: t('checkinandcheckout.send_request'),
          subTitle: checkInOutData?.picoId,
          onCloseHeader: () => setIsShow(false)
        }}
      >
        <Divider />
        <Box sx={{ PaddingX: 2 }}>
          <div className="px-6 py-6">
            <div className="bg-light px-4 py-2 mb-4 flex items-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-4"
              >
                <path
                  d="M14 4L6 12L2 8"
                  stroke="#79CA25"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-grey-dark">
                {t('checkinandcheckout.adjust_inventory')}
              </p>
            </div>
            <div className="flex flex-col gap-y-4">
              <p className="text-grey-dark font-bold">
                {t('checkinandcheckout.shipping_info')}
              </p>
              <div className="flex flex-col">
                <p className="text-gray-middle text-smi m-0">
                  {t('checkinandcheckout.shipping_company')}
                </p>
                <p className="text-black font-bold">
                  {checkInOutData?.senderName ? checkInOutData.senderName : '-'}
                </p>
              </div>

              <div className="flex flex-col">
                <p className="text-gray-middle text-smi m-0">
                  {t('checkinandcheckout.receiver')}
                </p>
                <p className="text-black font-bold">
                  {checkInOutData?.receiverName
                    ? checkInOutData.receiverName
                    : '-'}
                </p>
              </div>

              <div className="flex flex-col">
                <p className="text-gray-middle text-smi m-0">
                  {t('checkinandcheckout.logistics_company')}
                </p>
                <p className="text-black font-bold">
                  {checkInOutData?.logisticName
                    ? checkInOutData?.logisticName
                    : '-'}
                </p>
              </div>

              <p className="text-grey-dark font-bold">
                {t('checkinandcheckout.recyle_loc_info')}
              </p>

              <div className="flex">
                <div className="flex flex-col flex-1">
                  <p className="text-gray-middle text-smi m-0">
                    {t('checkinandcheckout.delivery_location')}
                  </p>
                  <p className="text-black font-bold">
                    {checkInOutData?.senderAddr
                      ? checkInOutData?.senderAddr
                      : '-'}
                  </p>
                </div>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.2929 5.29289C12.6834 4.90237 13.3166 4.90237 13.7071 5.29289L19.7071 11.2929C20.0976 11.6834 20.0976 12.3166 19.7071 12.7071L13.7071 18.7071C13.3166 19.0976 12.6834 19.0976 12.2929 18.7071C11.9024 18.3166 11.9024 17.6834 12.2929 17.2929L16.5858 13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H16.5858L12.2929 6.70711C11.9024 6.31658 11.9024 5.68342 12.2929 5.29289Z"
                    fill="#D1D1D1"
                  />
                </svg>
                <div className="flex flex-col flex-1 ml-6">
                  <p className="text-gray-middle text-smi m-0">
                    {t('checkinandcheckout.arrived')}
                  </p>
                  <p className="text-black font-bold">
                    {checkInOutData?.receiverAddr
                      ? checkInOutData?.receiverAddr
                      : '-'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-grey-dark text-smi -mb-1">
                  {t('checkinandcheckout.recyc_loc_info')}
                </p>
                {checkInOutData?.checkinDetail?.map((detail: any) => {
                  return (
                    <div className="flex px-4 py-2 border border-solid border-grey-line rounded-xl items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-[25px] h-[25px] rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: packageBgColor(
                              detail?.packageTypeId
                            ),
                            color: packageTextColor(detail?.packageTypeId)
                          }}
                        >
                          <p className="text-blue-middle text-xxs">
                            {packagingToText(detail?.packageTypeId)}
                          </p>
                        </div>
                        <div className="flex flex-col ml-4">
                          <p className="text-black font-bold m-0">
                            {recycleType(detail?.recycTypeId)}
                          </p>
                          <p className="text-gray-middle m-0">
                            {recycleSubType(
                              detail?.recycTypeId,
                              detail?.recycSubTypeId
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-black font-bold">
                        {formatWeight(detail?.weight, decimalVal)}
                        {unitName(detail?.unitId)}{' '}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Box>
      </RightOverlayForm>
    </div>
  )
}

export default CheckInAndCheckOutDetails
