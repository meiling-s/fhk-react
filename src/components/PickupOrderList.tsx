import { FunctionComponent, SyntheticEvent, useState, useEffect } from 'react'

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
import CustomField from './FormComponents/CustomField'
import CustomAutoComplete from './FormComponents/CustomAutoComplete'
import { useContainer } from 'unstated-next'
import { getAllPickUpOrder } from '../APICalls/Collector/pickupOrder/pickupOrder'
import { queryPickupOrder } from '../interfaces/pickupOrder'
import { localStorgeKeyName } from '../constants/constant'
import { getAllLogisticsPickUpOrder } from '../APICalls/Collector/pickupOrder/pickupOrder'
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
  const [selectedPico, setSelectedPico] = useState<string>('')
  const [searchInput, setSearchInput] = useState<string>('')

  const initPickupOrderRequest = async () => {
    let result = null
    if (role != 'collectoradmin') {
      result = await getAllLogisticsPickUpOrder(0 - 1, 1000, query)
    } else {
      result = await getAllPickUpOrder(0 - 1, 1000, query)
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

  useEffect(() => {
    handleSearch(searchInput)
  }, [searchInput])

  const handleSelectedPicoId = (
    pickupOrderDetail: PickupOrderDetail,
    picoId: string
  ) => {
    if (selectPicoDetail) {
      selectPicoDetail(pickupOrderDetail, picoId)
    }
  }

  const handleSearch = async (searchWord: string) => {
    const normalizedSearchWord = searchWord
      .trim()
      .toLowerCase()
      .normalize('NFKC')

    if (normalizedSearchWord !== '') {
      // Update the query with the search term
      const updatedQuery = {
        ...query,
        senderName: normalizedSearchWord
      }

      let result = null
      if (role !== 'collectoradmin') {
        result = await getAllLogisticsPickUpOrder(0 - 1, 1000, updatedQuery)
      } else {
        result = await getAllPickUpOrder(0 - 1, 1000, updatedQuery)
      }

      const data = result?.data.content
      if (data && data.length > 0) {
        const picoDetailList =
          data.flatMap((item: any) =>
            item?.pickupOrderDetail.map((detailPico: any) => ({
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
          ) ?? []

        setFilteredPico(picoDetailList)
      } else {
        setFilteredPico([])
      }
    } else {
      setFilteredPico(picoList)
    }
  }

  const handleCompositionEnd = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement
    setSearchInput(target.value)
    handleSearch(target.value)
  }

  return (
    <>
      <div>
        <RightOverlayForm
          open={drawerOpen}
          onClose={handleDrawerClose}
          anchor={'right'}
          action="none"
          headerProps={{
            title: t('pick_up_order.select_po'),
            subTitle: '',
            onCloseHeader: handleDrawerClose
          }}
        >
          <Box sx={{ paddingX: 4 }}>
            <Divider />
            <div className="">
              <Box>
                <div className="filter-section  mb-6">
                  <CustomField
                    label={t('pick_up_order.choose_logistic')}
                    mandatory
                  >
                    <CustomAutoComplete
                      placeholder={t('pick_up_order.enter_company_name')}
                      option={
                        Array.from(
                          new Set(
                            filteredPico
                              ?.filter((item) => item.status !== 'CLOSED')
                              .map((item) => item.senderName)
                          )
                        ) ?? []
                      }
                      sx={{ width: '100%' }}
                      onChange={(
                        _: SyntheticEvent,
                        newValue: string | null
                      ) => {
                        // handleSearch(newValue || '')
                        setSearchInput(newValue || '')
                        setSelectedPico(newValue || '')
                      }}
                      onCompositionEnd={handleCompositionEnd}
                      onInputChange={(event: any, newInputValue: string) => {
                        setSearchInput(newInputValue)
                        setSelectedPico(event.target.value)
                      }}
                      value={selectedPico}
                      inputValue={selectedPico}
                    />
                  </CustomField>
                </div>
                <Box>
                  {filteredPico.map((item, index) =>
                    item.status != 'CLOSED' ? (
                      <div
                        key={index}
                        onClick={() => {
                          handleSelectedPicoId(
                            item.pickupOrderDetail,
                            item.picoId
                          )
                        }}
                        className="card-pico p-4 border border-solid rounded-lg border-grey-line cursor-pointer mb-4 w-[450px]"
                      >
                        <div className="font-bold text-mini mb-2">
                          {item.type}
                        </div>
                        <div className="text-smi mb-2 text-[#717171]">
                          {item.picoId}
                        </div>
                        <div className="date-type mb-2 flex items-center gap-2">
                          <div className="text-smi bg-green-200 text-green-600 px-2 py-3 rounded-[50%]">
                            {item.status}
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
