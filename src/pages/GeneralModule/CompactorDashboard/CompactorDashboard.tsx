import { useEffect, useState, FunctionComponent, useCallback } from 'react'
import { Box, Button, Divider, Stack } from '@mui/material'

import CustomSearchField from '../../../components/TableComponents/CustomSearchField'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridRenderCellParams
} from '@mui/x-data-grid'
import AddProcessCompactor from './AddProcessCompactor'

import {
  getPlateNoList,
  getCompactorProcessIn,
  getCompactorProcessInItem
} from 'src/APICalls/compactorProcess'

import {
  mappingRecy,
  mappingSubRecy,
  mappingProductType,
  mappingSubProductType,
  mappingAddonsType
} from 'src/pages/Collector/ProccessOrder/utils'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { styles } from '../../../constants/styles'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTranslation } from 'react-i18next'
import {
  debounce,
  displayCreatedDate,
  getThemeColorRole
} from 'src/utils/utils'
import i18n from '../../../setups/i18n'
import dayjs from 'dayjs'
import { localStorgeKeyName } from 'src/constants/constant'
import { formValidate } from 'src/interfaces/common'
import CircularLoading from 'src/components/CircularLoading'

interface Option {
  value: string
  label: string
}

interface CompactorProcessIn {
  chkInId: number
  dropoffAt: string
  picoId: string
  driverNameEng: string
  driverNameSchi: string
  driverNameTchi: string
  senderName: string
  senderAddr: string
  receiverName: string | null
  receiverAddr: string | null
  plateNo: string
}

interface CompactorProcessInItem {
  chkInDtlId: number
  itemId: number
  recycTypeId: string
  recycSubTypeId: string
  productTypeId: string | null
  productSubTypeId: string | null
  productSubTypeRemark: string | null
  productAddonTypeId: string | null
  productAddonTypeRemark: string | null
  packagingNameEng: string
  packagingNameSchi: string
  packagingNameTchi: string
  gidLabel: string
  warehouseNameEng: string
  warehouseNameSchi: string
  warehouseNameTchi: string
  weight: number
  unitId: string
  dropoffAt: string
  chkInId: number
}

const CompactorDashboard: FunctionComponent = () => {
  const { t } = useTranslation()
  const { recycType, productType, getProductType } =
    useContainer(CommonTypeContainer)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [licensePlate, setLicensePlate] = useState<string[]>([])
  const [selectedCheckInIds, setSelectedItem] = useState<number[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedPlate, setSelectedPlate] = useState<string>('')
  const [compactorProcessIn, setCompactorProcessIn] = useState<
    CompactorProcessIn[]
  >([])
  const [compactorProcessInItem, setCompactorProcessInItem] = useState<
    CompactorProcessInItem[]
  >([])
  const [page, setPage] = useState<number>(1)
  const size = 10
  const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'
  const colorTheme: string = getThemeColorRole(role) || '#79CA25'

  const columns: GridColDef[] = [
    {
      field: 'dropoffAt',
      headerName: t('compactor.table.date'),
      width: 200,
      type: 'string',
      renderCell: (params) => {
        const dropoffAtTime = displayCreatedDate(params.row.dropoffAt)

        return dropoffAtTime
      }
    },
    {
      field: 'productTypeId',
      headerName: t('compactor.table.itemCategory'),
      width: 150,
      type: 'string',
      renderCell: (params) => {
        const itemCategory =
          params.row.productTypeId != null && params.row.productTypeId != ''
            ? t('processOrder.create.product')
            : t('processOrder.create.recycling')
        return itemCategory
      }
    },
    {
      field: 'recycTypeId',
      headerName: t('compactor.table.mainCategory'),
      width: 150,
      type: 'string',
      renderCell: (params) => {
        let name = '-'
        if (params.row.recycTypeId != '') {
          name = mappingRecy(params.row.recycTypeId, recycType)
        } else {
          name = mappingProductType(params.row.productTypeId, productType)
        }
        return name
      }
    },
    {
      field: 'recycSubTypeId',
      headerName: t('compactor.table.subcategory'),
      width: 150,
      type: 'string',
      renderCell: (params) => {
        let name = '-'
        if (params.row.itemCategory != 'product') {
          name = mappingSubRecy(
            params.row.recycTypeId,
            params.row.recycSubTypeId,
            recycType
          )
        } else {
          name = mappingSubProductType(
            params.row.productTypeId,
            params.row.productSubTypeId,
            productType
          )
        }
        return name
      }
    },
    {
      field: 'productAddonTypeId',
      headerName: t('compactor.table.addCategory'),
      width: 150,
      type: 'string',
      renderCell: (params) => {
        let name = ''
        if (params.row.productAddonTypeId != '') {
          name = mappingAddonsType(
            params.row.productTypeId,
            params.row.productSubTypeId,
            params.row.productAddonTypeId,
            productType
          )
        }
        return name
      }
    },
    {
      field: 'packagingNameEng',
      headerName: t('compactor.table.package'),
      width: 80,
      type: 'string',
      renderCell: (params) => {
        const packageName =
          i18n.language === 'zhhk'
            ? params.row.packagingNameTchi
            : i18n.language === 'zhch'
            ? params.row.packagingNameSchi
            : params.row.packagingNameEng
        return packageName
      }
    },
    {
      field: 'gidLabel',
      headerName: t('compactor.table.itemNumber'),
      width: 200,
      type: 'string'
    },
    {
      field: 'inStock',
      headerName: t('compactor.table.inStock'),
      width: 100,
      type: 'string',
      renderCell: (params) => {
        return '-'
      }
    },
    {
      field: 'weight',
      headerName: t('compactor.table.weight'),
      width: 100,
      type: 'string'
    }
  ]

  useEffect(() => {
    initLicensePlate()
    getProductType()
    setCurrDate()
  }, [])

  useEffect(() => {
    initLicensePlate()
  }, [selectedDate])

  const setCurrDate = () => {
    const currentDate = dayjs().format('YYYY-MM-DD')
    setSelectedDate(currentDate)
  }

  const initLicensePlate = async () => {
    setSelectedPlate('')
    const result = await getPlateNoList(selectedDate)
    if (result.data) {
      setLicensePlate(result.data)
    }
  }

  const getProcessInData = async () => {
    setIsLoading(true)
    const result = await getCompactorProcessIn(selectedDate, selectedPlate)

    if (result.data.length > 0) {
      setCompactorProcessIn(result.data)
    } else {
      setCompactorProcessIn([])
    }
    setIsLoading(false)
  }

  const getItemsCompactor = async (ids?: number[]) => {
    const result = await getCompactorProcessInItem(
      page - 1,
      size,
      ids ? ids : selectedCheckInIds
    )
    if (result.data?.content.length > 0) {
      setCompactorProcessInItem(result.data?.content)
    } else {
      setCompactorProcessInItem([])
    }
  }

  const getOptions = () => {
    const optionMap = new Map()

    licensePlate.forEach((val) => {
      optionMap.set(val, val)
    })

    let options: Option[] = Array.from(optionMap.values()).map((option) => ({
      value: option,
      label: option
    }))

    return options
  }

  const searchfield = [
    {
      label: t('compactor.processingDate'),
      placeholder: t('check_in.search'),
      field: 'currDate',
      inputType: 'date',
      width: '300px'
    },
    {
      label: t('compactor.plateNumber'),
      placeholder: t('check_in.search'),
      field: 'plateNumber',
      options: getOptions()
    }
  ]

  const handleSearch = debounce((keyName: string, value: string) => {
    if (keyName === 'currDate') {
      setSelectedDate(value)
    } else {
      setSelectedPlate(value)
    }
  }, 1000)

  const selectCard = (id: number) => {
    setSelectedItem((prevSelected) => {
      const updatedSelected = prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]

      if (updatedSelected.length > 0) {
        getItemsCompactor(updatedSelected)
      } else {
        setCompactorProcessInItem([])
      }

      return updatedSelected
    })
  }

  const onSubmitProcessOutItem = () => {
    setSelectedPlate('')
    initLicensePlate()
    setCompactorProcessInItem([])
    setCompactorProcessIn([])
  }

  const formattedTime = (value: string) => {
    const dateObject = dayjs.utc(value).tz('Asia/Hong_Kong').format(`HH:mm`)

    return dateObject
  }

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  return (
    <>
      <Box
        sx={{
          maxWidth: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 5,
          pr: 4
        }}
      >
        <h2>{t('compactor.compactorTruckHandling')}</h2>
        {/* SECTION 1 */}
        <Box sx={{ marginBottom: 10 }}>
          <div className="bg-[#7CE495] w-max px-[20px] py-[10px] text-white font-bold rounded-t-xl">
            {t('compactor.unloadRecord')}
          </div>
          <Box
            sx={{
              width: '100%',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px',
              borderBottomLeftRadius: '12px',
              background: 'white',
              height: '704px'
            }}
          >
            <Box
              sx={{
                padding: 4,
                display: 'flex',
                alignItems: 'baseline'
              }}
            >
              <Stack direction="row" mt={3}>
                {searchfield.map((s) => (
                  <CustomSearchField
                    key={s.field}
                    label={s.label}
                    placeholder={s?.placeholder}
                    field={s.field}
                    isUseCurrDate={true}
                    inputType={s.inputType}
                    options={s.options ?? []}
                    width="500px"
                    onChange={handleSearch}
                  />
                ))}
              </Stack>
              <Button
                sx={[
                  styles.buttonFilledGreen,
                  {
                    backgroundColor: colorTheme,
                    width: 'max-content',
                    height: '40px'
                  }
                ]}
                disabled={selectedDate === '' || selectedPlate === ''}
                onClick={() => {
                  getProcessInData()
                }}
              >
                {t('compactor.show')}
              </Button>
            </Box>
            <Divider></Divider>
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Box sx={{ paddingY: '24px', paddingX: '40px' }}>
                <div className="grid grid-cols-2 gap-4 justify-items-start w-full max-w-[980px]">
                  {compactorProcessIn.map((item) => (
                    <div
                      className={`relative card-wrapper col-span-1 max-w-[450px] w-full flex items-center space-x-6 py-4 px-4 rounded-lg border-solid cursor-pointer ${
                        selectedCheckInIds.includes(item.chkInId)
                          ? 'border-[2px] border-[#79CA25]'
                          : 'border-[1px] border-[#C6C6C6]'
                      }`}
                      onClick={() => selectCard(item.chkInId)}
                    >
                      <div className="text-left">
                        <div className="mb-2 text-[#717171] text-xs font-medium">
                          {t('compactor.unloadTime')}
                        </div>
                        <div className="mb-2 text-black font-bold text-base">
                          {formattedTime(item.dropoffAt)}
                        </div>
                        <div className="mb-2 text-[#717171] text-sm font-medium">
                          {item.picoId}
                        </div>
                      </div>
                      <div className="flex flex-col border-l border-[#E2E2E2]">
                        <div className="flex items-center mb-2">
                          <PersonOutlineOutlinedIcon
                            fontSize="small"
                            className=" text-[#ACACAC] text-sm mr-1"
                          />
                          <div className="text-[#ACACAC] text-sm font-medium">
                            {t('driver.tabs.driver')}
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          <Inventory2OutlinedIcon
                            fontSize="small"
                            className=" text-[#ACACAC] text-sm mr-1"
                          />
                          <div className="text-[#ACACAC] text-sm font-medium">
                            {t('pick_up_order.card_detail.shipping_receiver')}
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          <LocationOnOutlinedIcon
                            fontSize="small"
                            className=" text-[#ACACAC] text-sm mr-1"
                          />
                          <div className="text-[#ACACAC] text-sm font-medium">
                            {t('pick_up_order.card_detail.deliver_location')}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 text-[#535353] text-sm font-medium">
                          {i18n.language === 'zhhk'
                            ? item.driverNameTchi
                            : i18n.language === 'zhch'
                            ? item.driverNameSchi
                            : item.driverNameEng}
                        </div>
                        <div className="mb-2">
                          <div className="text-[#535353] text-sm font-medium">
                            {item.senderName ?? 'N/A'} ➔{' '}
                            {item.receiverName ?? 'N/A'}
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="text-[#535353] text-sm font-medium">
                            {item.senderAddr ?? 'N/A'} ➔{' '}
                            {item.receiverAddr ?? 'N/A'}
                          </div>
                        </div>
                      </div>
                      {selectedCheckInIds.includes(item.chkInId) && (
                        <CheckCircleIcon className="absolute top-[-8px] right-[-8px] text-[#79CA25] w-6 h-6" />
                      )}
                    </div>
                  ))}
                </div>
              </Box>
            )}
          </Box>
        </Box>
        {/* SECTION 2 */}
        <Box sx={{ marginBottom: 10 }}>
          <div className="bg-[#7CE495] w-max px-[20px] py-[10px] text-white font-bold rounded-t-xl">
            {t('compactor.selectedItems')}{' '}
            {`(` + selectedCheckInIds.length + `)`}
          </div>
          <Box
            sx={{
              width: '100%',
              maxWidth: '1280px',
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px',
              borderBottomLeftRadius: '12px',
              background: 'white',
              height: '448px',
              padding: 4
            }}
          >
            <DataGrid
              rows={compactorProcessInItem}
              getRowId={(row) => row.chkInId}
              hideFooter
              columns={columns}
              onRowClick={() => {}}
              getRowSpacing={getRowSpacing}
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  border: 'none'
                },
                '& .MuiDataGrid-row': {
                  bgcolor: '#FBFBFB',
                  borderRadius: '10px'
                },
                '&>.MuiDataGrid-main': {
                  '&>.MuiDataGrid-columnHeaders': {
                    borderBottom: 'none'
                  }
                },
                '.MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold !important',
                  overflow: 'visible !important'
                }
              }}
            />
          </Box>
        </Box>
        {/* SECTION 3 */}
        {selectedCheckInIds.length > 0 && (
          <Box>
            <div className="bg-[#7CE495] px-[20px] py-[10px] w-max text-white font-bold rounded-t-xl">
              {t('compactor.processCompress')}
            </div>
            <Box
              sx={{
                width: '100%',
                maxWidth: '1380px',
                borderTopRightRadius: '12px',
                borderBottomRightRadius: '12px',
                borderBottomLeftRadius: '12px',
                background: 'white',
                height: 'max-content'
              }}
            >
              <AddProcessCompactor
                chkInIds={selectedCheckInIds}
                inItemId={compactorProcessInItem.map((item) => item.itemId)}
                onSubmit={onSubmitProcessOutItem}
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  )
}

export default CompactorDashboard
