import { FunctionComponent, useState, useEffect } from 'react'

import {
  Box,
  Divider,
  InputAdornment,
  IconButton,
  TextField
} from '@mui/material'
import { SEARCH_ICON } from '../themes/icons'
import RightOverlayForm from '../components/RightOverlayForm'
import {
  PickupOrder,
  PickupOrderDetail,
  PicoRefrenceList
} from '../interfaces/pickupOrder'
import { useTranslation } from 'react-i18next'

import { useContainer } from 'unstated-next'
import { getAllPickUpOrder } from '../APICalls/Collector/pickupOrder/pickupOrder'
import { queryPickupOrder } from '../interfaces/pickupOrder'
import { Languages, localStorgeKeyName } from '../constants/constant'
import { getAllLogisticsPickUpOrder } from '../APICalls/Collector/pickupOrder/pickupOrder'
import i18n from '../setups/i18n'

interface StatusPickUpOrder {
  value: string
  labelEng: string,
  labelSchi: string,
  labelTchi: string
}

interface AddWarehouseProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  selectPicoDetail?: (
    pickupOrderDetail: PickupOrderDetail,
    picoId: string
  ) => void
  picoId?: string
}

const PickupOrderList: FunctionComponent<AddWarehouseProps> = ({
  drawerOpen,
  handleDrawerClose,
  selectPicoDetail,
  picoId
}) => {
  const { t } = useTranslation()
  const [picoList, setPicoList] = useState<PicoRefrenceList[]>([])
  const [filteredPico, setFilteredPico] = useState<PicoRefrenceList[]>([])
  const [filtered, setFiltered] = useState<PicoRefrenceList[]>([])
  const [pickupOrder, setPickupOrder] = useState<PickupOrder[]>()
  const [query, setQuery] = useState<queryPickupOrder>({
    picoId: '',
    effFromDate: '',
    effToDate: '',
    logisticName: '',
    recycType: '',
    senderName: '',
    status: null
  })
  const role = localStorage.getItem(localStorgeKeyName.role)
  const [search, setSearch] = useState<string| undefined>(undefined);

  const initPickupOrderRequest = async () => {
    let result = null
    if (role != 'collectoradmin') {
      result = await getAllLogisticsPickUpOrder(0 - 1, 50, query)
    } else {
      result = await getAllPickUpOrder(0 - 1, 50, query)
    }
    const data = result?.data.content
    //console.log("pickup order content: ", data);
    if (data && data.length > 0) {
      setPickupOrder(data)
    }
  }

  useEffect(() => {
    initPickupOrderRequest()
  }, [])

  useEffect(() => {
    const picoDetailList =
      pickupOrder
        ?.flatMap((item) =>
          item?.pickupOrderDetail.map((detailPico) => ({
            type: item.picoType,
            picoId: item.picoId,
            status: detailPico.status,
            effFrmDate: item.effFrmDate,
            effToDate: item.effToDate,
            routine: `${item.routineType}, ${item.routine.join(', ')}`,
            senderName: detailPico.senderName,
            receiver: detailPico.receiverName,
            pickupOrderDetail: detailPico
          }))
        )
        ?.filter((picoDetail) => picoDetail.picoId !== picoId) ?? []
    setPicoList(picoDetailList)
    setFilteredPico(picoDetailList)
  }, [drawerOpen])

  const handleSearch = (searchWord: string) => {
    if(searchWord === '') {
      setSearch(undefined)
    } else {
      setSearch(searchWord)
    }
  }

  useEffect(() => {
    if (search) {
      const filteredData: PicoRefrenceList[] = []
      filteredPico.map((item) => {
        if (item.senderName.includes(search) || item.picoId.includes(search)) {
          filteredData.push(item)
        }
      })
      if (filteredData) {
        setFiltered(filteredData)
      }
    } else {
      setFiltered(picoList)
    }
  }, [search])

  const handleSelectedPicoId = (
    pickupOrderDetail: PickupOrderDetail,
    picoId: string
  ) => {
    if (selectPicoDetail) {
      selectPicoDetail(pickupOrderDetail, picoId)
    }
  }

  const getStatus = (status:string) :string => {
    let name = ''
  
    const statusList: StatusPickUpOrder[] = [
      {
        value: '0',
        labelEng: 'CREATED',
        labelSchi: '待处理',
        labelTchi: '待處理'
      },
      {
        value: '1',
        labelEng: 'STARTED',
        labelSchi: '处理中',
        labelTchi: '處理中'
      },
      {
        value: '2',
        labelEng: 'CONFIRMED',
        labelSchi: '已确认',
        labelTchi: '已確認'
      },
      {
        value: '3',
        labelEng: 'REJECTED',
        labelSchi: '已拒绝',
        labelTchi: '已拒絕'
      },
      {
        value: '4',
        labelEng: 'COMPLETED',
        labelSchi: '已完成',
        labelTchi: '已完成'
      },
      {
        value: '5',
        labelEng: 'CLOSED',
        labelSchi: '已取消',
        labelTchi: '已取消'
      },
      {
        value: '6',
        labelEng: 'OUTSTANDING',
        labelSchi: '已逾期',
        labelTchi: '已逾期'
      },
      {
        value: '',
        labelEng: t('localizedTexts.filterValueAny'),
        labelSchi: '任何',
        labelTchi: '任何'
      },
    ]

    const data = statusList.find(item => item.labelEng === status)
    if(data && i18n.language === Languages.ENUS){
      name = data.labelEng
    } else if(data && i18n.language === Languages.ZHCH){
      name = data.labelSchi
    } else if(data){
      name = data.labelTchi
    }
    
    return name
  }

  const onCloseDrawer = () => {
    handleDrawerClose()
    setSearch(undefined)
  }

  return (
    <>
      <div>
        <RightOverlayForm
          open={drawerOpen}
          onClose={onCloseDrawer}
          anchor={'right'}
          action="none"
          headerProps={{
            title: t('pick_up_order.select_po'),
            subTitle: '',
            onCloseHeader: onCloseDrawer
          }}
        >
          <Box>
            <Divider />
            <div className="p-6">
              <Box>
                <div className="filter-section flex justify-between items-center w-full mb-6">
                  <TextField
                    id="searchShipment"
                    onChange={(event) => handleSearch(event.target.value)}
                    sx={styles.inputState}
                    placeholder={t('pick_up_order.search_company_name')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => {}}>
                            <SEARCH_ICON style={{ color: '#79CA25' }} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </div>
                <Box>
                  {!search && filteredPico.map((item, index) =>
                    item.status != 'CLOSED' ? (
                      <div
                        key={index}
                        onClick={() => {
                          handleSelectedPicoId(
                            item.pickupOrderDetail,
                            item.picoId
                          )
                        }}
                        className="card-pico p-4 border border-solid rounded-lg border-grey-line cursor-pointer mb-4"
                      >
                        <div className="font-bold text-mini mb-2">
                          {item.type}
                        </div>
                        <div className="text-smi mb-2 text-[#717171]">
                          {item.picoId}
                        </div>
                        <div className="date-type mb-2 flex items-center gap-2">
                          <div className="text-smi bg-green-200 text-green-600 px-2 py-3 rounded-[50%]">
                            {getStatus(item.status)}
                          </div>
                          <div className="text-smi text-[#717171]">
                            {item.effFrmDate}
                          </div>
                          <div className="text-smi text-[#717171]">
                            {t('pick_up_order.to')}
                          </div>
                          <div className="text-smi text-[#717171]">
                            {item.effToDate}
                          </div>
                          <div className="text-smi text-[#717171]">
                            {item.routine}
                          </div>
                        </div>
                        <div className="mb- flex items-center gap-2">
                          <div>
                            <img src="../Delivery.svg" alt="" />
                          </div>
                          <div className="text-xs text-[#717171]">
                            {item.senderName}
                          </div>
                          <div className="text-xs text-[#717171]">
                            {item.receiver}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )
                  )}
                  {search && filtered.map((item, index) =>
                    item.status != 'CLOSED' ? (
                      <div
                        key={index}
                        onClick={() => {
                          handleSelectedPicoId(
                            item.pickupOrderDetail,
                            item.picoId
                          )
                        }}
                        className="card-pico p-4 border border-solid rounded-lg border-grey-line cursor-pointer mb-4"
                      >
                        <div className="font-bold text-mini mb-2">
                          {item.type}
                        </div>
                        <div className="text-smi mb-2 text-[#717171]">
                          {item.picoId}
                        </div>
                        <div className="date-type mb-2 flex items-center gap-2">
                          <div className="text-smi bg-green-200 text-green-600 px-2 py-3 rounded-[50%]">
                            {getStatus(item.status)}
                          </div>
                          <div className="text-smi text-[#717171]">
                            {item.effFrmDate}
                          </div>
                          <div className="text-smi text-[#717171]">
                            {t('pick_up_order.to')}
                          </div>
                          <div className="text-smi text-[#717171]">
                            {item.effToDate}
                          </div>
                          <div className="text-smi text-[#717171]">
                            {item.routine}
                          </div>
                        </div>
                        <div className="mb- flex items-center gap-2">
                          <div>
                            <img src="../Delivery.svg" alt="" />
                          </div>
                          <div className="text-xs text-[#717171]">
                            {item.senderName}
                          </div>
                          <div className="text-xs text-[#717171]">
                            {item.receiver}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )
                  )}
                </Box>
              </Box>
            </div>
          </Box>
        </RightOverlayForm>
      </div>
    </>
  )
}

let styles = {
  typo: {
    color: 'grey',
    fontSize: 14
  },
  inputState: {
    mt: 3,
    width: '100%',

    borderRadius: '10px',
    bgcolor: 'white',
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '& fieldset': {
        borderColor: '#79CA25'
      },
      '&:hover fieldset': {
        borderColor: '#79CA25'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#79CA25'
      },
      '& label.Mui-focused': {
        color: '#79CA25'
      }
    }
  }
}

export default PickupOrderList
