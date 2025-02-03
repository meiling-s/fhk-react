import { FunctionComponent, SyntheticEvent, useState, useEffect } from 'react'

import {
  Box,
  Divider,
  InputAdornment,
  IconButton,
  TextField
} from '@mui/material'
import { SEARCH_ICON, ARRPW_FORWARD_ICON } from '../themes/icons'
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
import i18n from 'src/setups/i18n'
interface AddWarehouseProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  selectPicoDetail?: (
    pickupOrderDetail: PickupOrderDetail[],
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
    status: 6
  })
  const role = localStorage.getItem(localStorgeKeyName.role)
  const [selectedPico, setSelectedPico] = useState<string>('')
  const [searchInput, setSearchInput] = useState<string>('')

  const initPickupOrderRequest = async () => {
    let result = null
    if (role !== 'collectoradmin') {
      result = await getAllLogisticsPickUpOrder(0, 1000, query)
    } else {
      result = await getAllPickUpOrder(0, 1000, query)
    }
    const data = result?.data.content

    if (data && data.length > 0) {
      setPickupOrder(data)
      assignData(data)
    }
  }

  const assignData = (newData?: PickupOrder[]) => {
    const newList: any = (newData || pickupOrder)
      ?.filter((item) => !item.isRef)
      ?.flatMap((item) =>
        item?.pickupOrderDetail.map((detailPico) => ({
          type: item.picoType,
          picoId: item.picoId,
          status: item.status,
          effFrmDate: item.effFrmDate,
          effToDate: item.effToDate,
          routine: `${item.routineType}, ${item.routine.join(', ')}`,
          senderName: detailPico.senderName,
          receiver: detailPico.receiverName,
          pickupOrderDetail: detailPico,
          isRef: item.isRef
        }))
      )

    const picoDetailList = newList?.filter((picoDetail: any) =>
      picoId ? picoDetail.picoId !== picoId : true
    )

    const picoDetailListDistinguished = picoDetailList?.filter(
      (value: any, index: any, self: any[]) =>
        value.status === 'OUTSTANDING' &&
        self.map((x: any) => x.picoId).indexOf(value.picoId) === index
    )

    setPicoList(picoDetailListDistinguished)
    setFilteredPico(picoDetailListDistinguished)
    console.log('picoDetailListDistinguished', picoDetailListDistinguished)
  }

  useEffect(() => {
    initPickupOrderRequest()
  }, [i18n.language])

  useEffect(() => {
    assignData()
  }, [drawerOpen, searchInput === ''])

  useEffect(() => {
    setSearchInput('')
  }, [drawerOpen])

  useEffect(() => {
    handleSearch(searchInput)
  }, [searchInput])

  const handleSelectedPicoId = (picoId: string) => {
    const pickupOrderDetails = pickupOrder?.find(
      (value: PickupOrder) => value?.picoId === picoId
    )?.pickupOrderDetail
    if (selectPicoDetail) {
      selectPicoDetail(pickupOrderDetails || [], picoId)
    }
  }

  const handleSearch = async (searchWord: string) => {
    if (searchWord !== '') {
      const updatedQuery = {
        ...query,
        senderName: searchWord
      }

      let result = null
      if (role !== 'collectoradmin') {
        result = await getAllLogisticsPickUpOrder(0, 1000, updatedQuery)
      } else {
        result = await getAllPickUpOrder(0, 1000, updatedQuery)
      }

      const data = result?.data.content

      if (data && data.length > 0) {
        const picoDetailList =
          data
            ?.filter((it: PickupOrder) => !it.isRef)
            .flatMap((item: any) =>
              item?.pickupOrderDetail
                .filter(
                  (detailPico: any) =>
                    detailPico.senderName &&
                    detailPico.senderName
                      .toLowerCase()
                      .includes(searchWord.toLowerCase())
                )
                .map((detailPico: any) => ({
                  type: item.picoType,
                  picoId: item.picoId,
                  status: item.status,
                  effFrmDate: item.effFrmDate,
                  effToDate: item.effToDate,
                  routine: `${item.routineType}, ${item.routine.join(', ')}`,
                  senderName: detailPico.senderName,
                  receiver: detailPico.receiverName,
                  pickupOrderDetail: detailPico,
                  isRef: item.isRef
                }))
            ) ?? []

        console.log('picoDetailList', picoDetailList)

        setFilteredPico(picoDetailList)
      } else {
        setFilteredPico([])
      }
    } else {
      setFilteredPico(picoList)
      setSelectedPico('')
    }
  }

  const handleCompositionEnd = (event: SyntheticEvent) => {
    const target = event.target as HTMLInputElement
    setSearchInput(target.value)
    handleSearch(target.value)
  }

  const getPicoType = (type: string) => {
    let typeLabel = ''
    typeLabel =
      type === 'ROUTINE'
        ? t('pick_up_order.regular_shipping')
        : t('pick_up_order.one-transport')

    return typeLabel
  }

  const getRoutineLabel = (routine: string) => {
    let routineLabel = ''
    routineLabel =
      routine === 'daily'
        ? t('pick_up_order.routine.daily')
        : routine.includes('specificDate')
        ? t('pick_up_order.routine.specificDate')
        : t('pick_up_order.routine.weekly')
    return routineLabel
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
          <Divider />
          <Box sx={{ paddingX: 4, paddingY: 2 }}>
            <div className="">
              <Box>
                <div className="filter-section  mb-6">
                  <CustomAutoComplete
                    placeholder={t('pick_up_order.enter_company_name')}
                    option={
                      Array.from(
                        new Set(
                          filteredPico
                            ?.filter((item) => item.status === 'OUTSTANDING')
                            ?.map((item) => item.senderName)
                        )
                      ) ?? []
                    }
                    sx={{ width: '100%' }}
                    onChange={(_: SyntheticEvent, newValue: string | null) => {
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
                    dataTestId="astd-create-edit-pickup-order-related-po-form-choose-logistic-2149"
                  />
                </div>
                <Box>
                  {filteredPico?.map((item, index) =>
                    item.status === 'OUTSTANDING' ? (
                      <div
                        key={index}
                        onClick={() => {
                          handleSelectedPicoId(item.picoId)
                        }}
                        data-testid={
                          'astd-create-edit-pickup-order-related-po-form-choose-po-9526' +
                          index
                        }
                        className="card-pico p-4 border border-solid rounded-lg border-grey-line cursor-pointer mb-4 w-[450px]"
                      >
                        <div className="font-bold text-mini mb-2">
                          {getPicoType(item.type)}
                        </div>
                        <div className="text-smi mb-2 text-[#717171]">
                          {item.picoId}
                        </div>
                        <div className="date-type mb-2 flex items-center gap-2">
                          <div className="text-smi bg-green-200 text-green-600 px-2 py-3 rounded-[8px]">
                            {item.status === 'OUTSTANDING'
                              ? t('status.outstanding').toLocaleUpperCase()
                              : ''}
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
                            {getRoutineLabel(item.routine)}
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
