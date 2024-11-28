import { useEffect, useState, FunctionComponent, useCallback } from 'react'
import {
  Box,
  Typography,
  Pagination,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridRenderCellParams
} from '@mui/x-data-grid'
import { styles } from '../../../constants/styles'
import CustomSearchField from '../../../components/TableComponents/CustomSearchField'
import InventoryDetail from './DetailInventory'
import { useContainer } from 'unstated-next'
import {
  InventoryItem,
  InventoryDetail as InvDetails
} from '../../../interfaces/inventory'
import { il_item } from '../../../components/FormComponents/CustomItemList'
import {
  astdGetAllInventory,
  getAllInventory
} from '../../../APICalls/Collector/inventory'
import {
  format,
  Languages,
  localStorgeKeyName,
  STATUS_CODE
} from '../../../constants/constant'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import {
  getPicoById,
  getAllLogisticsPickUpOrder,
  getAllPickUpOrder
} from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import { PickupOrder } from '../../../interfaces/pickupOrder'
import { astdSearchWarehouse } from '../../../APICalls/warehouseManage'
import { useTranslation } from 'react-i18next'
import i18n from '../../../setups/i18n'
import { SEARCH_ICON } from '../../../themes/icons'
import useDebounce from '../../../hooks/useDebounce'
import CircularLoading from '../../../components/CircularLoading'
import {
  returnApiToken,
  extractError,
  getPrimaryColor,
  debounce
} from '../../../utils/utils'
import { getAllWarehouse } from '../../../APICalls/warehouseManage'
import useLocaleTextDataGrid from '../../../hooks/useLocaleTextDataGrid'
import { InventoryQuery } from '../../../interfaces/inventory'
import { getAllPackagingUnit } from '../../../APICalls/Collector/packagingUnit'
import { PackagingUnit } from '../../../interfaces/packagingUnit'

dayjs.extend(utc)
dayjs.extend(timezone)

interface Option {
  value: string
  label: string
}

type recycItem = {
  recycType: il_item
  recycSubType: il_item[]
}

function createInventory(
  itemId: number,
  labelId: string,
  warehouseId: number,
  recyclingNumber: string,
  recycTypeId: string,
  recycSubTypeId: string,
  recyName: string,
  subName: string,
  packageTypeId: string,
  weight: number,
  unitId: string,
  status: string,
  createdBy: string,
  updatedBy: string,
  inventoryDetail: InvDetails[],
  createdAt: string,
  updatedAt: string,
  location: string,
  packageName?: string
): InventoryItem {
  return {
    itemId,
    labelId,
    warehouseId,
    recyclingNumber,
    recycTypeId,
    recycSubTypeId,
    recyName,
    subName,
    packageTypeId,
    weight,
    unitId,
    status,
    createdBy,
    updatedBy,
    inventoryDetail,
    createdAt,
    updatedAt,
    location,
    packageName
  }
}

const Inventory: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [inventoryData, setInventoryData] = useState<any[]>([])
  const [inventoryList, setInventory] = useState<any[]>([])
  const [filteredInventory, setFilteredInventory] = useState<any[]>([])
  const [selectedRow, setSelectedRow] = useState<any | null>(null)
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const { recycType, dateFormat } = useContainer(CommonTypeContainer)
  const [recycItem, setRecycItem] = useState<recycItem[]>([])
  const [picoList, setPicoList] = useState<PickupOrder[]>([])
  const [selectedPico, setSelectedPico] = useState<PickupOrder[]>([])
  const [searchText, setSearchText] = useState<string>('')
  const realmApi = localStorage.getItem(localStorgeKeyName.realmApiRoute)
  const debouncedSearchValue: string = useDebounce(searchText, 1000)
  const { localeTextDataGrid } = useLocaleTextDataGrid()
  const [query, setQuery] = useState<InventoryQuery>({
    labelId: null,
    warehouseId: null,
    recycTypeId: '',
    recycSubTypeId: '',
    idleDays: null,
  })
  const [warehouseList, setWarehouseList] = useState<Option[]>([])
  const [recycList, setRecycList] = useState<Option[]>([])
  const [packagingMapping, setPackagingMapping] = useState<PackagingUnit[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'

  const initpackagingUnit = async () => {
    try {
      const result = await getAllPackagingUnit(0, 1000)
      const data = result?.data

      if (data) {
        setPackagingMapping(data.content)
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  useEffect(() => {
    mappingRecyleItem()
    initpackagingUnit()
    getAllPickupOrder()
  }, [recycType, i18n.language])

  useEffect(() => {
    if (realmApi !== 'account') {
      if (recycItem.length > 0) {
        initInventory()
        initWarehouse()
      }
    }
  }, [recycItem, page, realmApi, query, i18n.language])

  const mappingRecyleItem = () => {
    const recyleMapping: recycItem[] = []
    recycType?.forEach((re) => {
      var reItem: recycItem = {
        recycType: { name: '', id: '' },
        recycSubType: []
      }
      var subItem: il_item[] = []
      var name = ''
      switch (i18n.language) {
        case 'enus':
          name = re.recyclableNameEng
          break
        case 'zhch':
          name = re.recyclableNameSchi
          break
        case 'zhhk':
          name = re.recyclableNameTchi
          break
        default:
          name = re.recyclableNameTchi
          break
      }
      reItem.recycType = { name: name, id: re.recycTypeId }

      re.recycSubType.map((sub) => {
        var subName = ''
        switch (i18n.language) {
          case 'enus':
            subName = sub.recyclableNameEng
            break
          case 'zhch':
            subName = sub.recyclableNameSchi
            break
          case 'zhhk':
            subName = sub.recyclableNameTchi
            break
          default:
            subName = sub.recyclableNameTchi
            break
        }

        reItem.recycSubType = subItem
        subItem.push({ name: subName, id: sub.recycSubTypeId })
      })
      reItem.recycSubType = subItem
      recyleMapping.push(reItem)
    })
    setRecycItem(recyleMapping)
  }

  // const getPicoDetail = async (sourcePicoId: string) => {
  //   try {
  //     const result = await getPicoById(sourcePicoId)
  //     if (result) return result
  //   } catch (error) {
  //     return null
  //   }
  // }

  // const getAllPickupOrder = async (data: InventoryItem[]) => {
  //   const picoData: PickupOrder[] = []
  //   for (let index = 0; index < data.length; index++) {
  //     const item = data[index]
  //     for (let index = 0; index < item.inventoryDetail.length; index++) {
  //       const invDetail = item.inventoryDetail[index]
  //       const result = await getPicoDetail(invDetail.sourcePicoId)
  //       if (result?.data) {
  //         picoData.push(result.data)
  //       }
  //     }
  //   }

  //   setPicoList(picoData)
  //   return picoData
  // }

  const getAllPickupOrder = async () => {
    const result = await getAllPickUpOrder(page - 1, 1000)
    let data = result?.data.content
    if (data && data.length > 0) {
      setPicoList(data)
    }
  }

  const initInventory = async () => {
    setIsLoading(true)
    setFilteredInventory([])
    let result
    if (realmApi === 'account') {
      result = await astdGetAllInventory(page - 1, pageSize, searchText, query)
    } else {
      result = await getAllInventory(page - 1, pageSize, query)
    }
    const data = result?.data
    setInventoryData(data?.content || [])

    if (data) {
      // const picoData = await getAllPickupOrder(data.content)
      var inventoryMapping: InventoryItem[] = []
      data.content.map((item: InventoryItem) => {
        let recyName: string = '-'
        let subName: string = '-'
        item.packageName = item.packageTypeId
        const recyclables = recycType?.find(
          (re) => re.recycTypeId === item.recycTypeId
        )
        if (recyclables) {
          if (i18n.language === Languages.ENUS)
            recyName = recyclables.recyclableNameEng
          if (i18n.language === Languages.ZHCH)
            recyName = recyclables.recyclableNameSchi
          if (i18n.language === Languages.ZHHK)
            recyName = recyclables.recyclableNameTchi
          const subs = recyclables.recycSubType.find(
            (sub) => sub.recycSubTypeId === item.recycSubTypeId
          )
          if (subs) {
            if (i18n.language === Languages.ENUS)
              subName = subs.recyclableNameEng
            if (i18n.language === Languages.ZHCH)
              subName = subs.recyclableNameSchi
            if (i18n.language === Languages.ZHHK)
              subName = subs.recyclableNameTchi
          }
        }

        const packages = packagingMapping.find(
          (packageItem) => packageItem.packagingTypeId === item.packageTypeId
        )

        if (packages) {
          if (i18n.language === Languages.ENUS)
            item.packageName = packages.packagingNameEng
          if (i18n.language === Languages.ZHCH)
            item.packageName = packages.packagingNameSchi
          if (i18n.language === Languages.ZHHK)
            item.packageName = packages.packagingNameTchi
        }

        const dateInHK = dayjs.utc(item.createdAt).tz('Asia/Hong_Kong')
        const createdAt = dateInHK.format(`${dateFormat} HH:mm`)

        let selectedPico: PickupOrder[] = []

        // item.inventoryDetail?.map((invDetail: InvDetails) => {
        //   selectedPico = picoList.filter(
        //     (pico) => pico.picoId == invDetail.sourcePicoId
        //   )
        // })

        inventoryMapping.push(
          createInventory(
            item?.itemId,
            item?.labelId,
            item?.warehouseId,
            item?.recycTypeId,
            item?.recycTypeId,
            item?.recycSubTypeId,
            recyName,
            subName,
            item?.packageTypeId,
            item?.weight,
            item?.unitId,
            item?.status,
            item?.updatedBy,
            item?.createdBy,
            item?.inventoryDetail || '-',
            createdAt,
            item?.updatedAt,
            item?.location,
            item?.packageName
          )
        )
      })
      setInventory(inventoryMapping)
      setFilteredInventory(inventoryMapping)
      setTotalData(data.totalPages)
    }
    setIsLoading(false)
  }

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: t('inventory.date'),
      width: 200,
      type: 'string'
    },
    {
      field: 'recyName',
      headerName: t('inventory.recyleType'),
      width: 200,
      type: 'string'
    },
    {
      field: 'subName',
      headerName: t('inventory.recyleSubType'),
      width: 200,
      type: 'string'
    },
    {
      field: 'packageName',
      headerName: t('inventory.package'),
      width: 200,
      type: 'string'
    },
    {
      field: 'labelId',
      headerName: t('inventory.recyclingNumber'),
      width: 200,
      type: 'string'
    },
    {
      field: 'location',
      headerName: t('inventory.inventoryLocation'),
      width: 200,
      type: 'string'
    },
    {
      field: 'weight',
      headerName: t('inventory.weight'),
      width: 200,
      type: 'string',
      renderCell: (params) => {
        return <div>{params.row.weight} kg</div>
      }
    }
  ]

  const initWarehouse = async () => {
    try {
      let result
      if (realmApi === 'account') {
        result = await astdSearchWarehouse(0, 1000, searchText)
      } else {
        result = await getAllWarehouse(0, 1000)
      }
      if (result) {
        let capacityTotal = 0
        let warehouse: { label: string; value: string }[] = []
        const data = result.data.content
        data.forEach((item: any) => {
          item.warehouseRecyc?.forEach((recy: any) => {
            capacityTotal += recy.recycSubTypeCapacity
          })
          var warehouseName = ''
          switch (i18n.language) {
            case 'zhhk':
              warehouseName = item.warehouseNameTchi
              break
            case 'zhch':
              warehouseName = item.warehouseNameSchi
              break
            case 'enus':
              warehouseName = item.warehouseNameEng
              break
            default:
              warehouseName = item.warehouseNameTchi
              break
          }
          warehouse.push({
            value: item.warehouseId,
            label: warehouseName
          })
        })
        warehouse.push({
          value: '',
          label: t('check_in.any')
        })
        setWarehouseList(warehouse)
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const searchfield = [
    {
      label: t('inventory.recyclingNumber'),
      field: 'labelId',
      placeholder: t('placeHolder.enterRecyclingNumber'),
      width: '280px'
    },
    {
      label: t('placeHolder.classification'),
      options: getUniqueOptions('recyName'),
      field: 'recycTypeId',
      placeholder: t('placeHolder.any')
    },
    {
      label: t('placeHolder.subclassification'),
      options: getUniqueOptions('subName'),
      field: 'recycSubTypeId',
      placeholder: t('placeHolder.any')
    },
    {
      label: t('placeHolder.place'),
      field: 'warehouseId',
      options: warehouseList,
      placeholder: t('placeHolder.any')
    },
    {
      label: t('common.idleDays'),
      disableIcon: true,
      field: 'idleDays',
      placeholder: t('common.filledIdleDays')
    },
  ]

  function getUniqueOptions(propertyName: keyof InventoryItem) {
    const optionMap = new Map()

    if (propertyName === 'recyName') {
      inventoryList.forEach((row) => {
        if (row[propertyName]) {
          optionMap.set(row['recycTypeId'], row.recyName)
        }
      })
    } else if (propertyName === 'subName') {
      inventoryList.forEach((row) => {
        if (row[propertyName]) {
          optionMap.set(row['recycSubTypeId'], row.subName)
        }
      })
    } else {
      inventoryList.forEach((row) => {
        optionMap.set(row[propertyName], row[propertyName])
      })
    }

    const options = Array.from(optionMap.entries()).map(([key, value]) => ({
      value: key,
      label: value
    }))

    const cache: any = {}

    for (let item of options) {
      if (!(item.label in cache)) {
        const newItem = item.label
        cache[newItem] = {
          ...item
        }
      }
    }

    const filter: Option[] = Object.values(cache)

    filter.push({
      value: '',
      label: t('check_in.any')
    })

    return filter
  }

  const handleSelectRow = (params: GridRowParams) => {
    const selectedInv: InventoryItem = inventoryList.find(
      (item) => item.itemId == params.row.itemId
    )
    let selectedPicoList: PickupOrder[] = []
    // console.log('selectedInv', selectedInv)
    // console.log('selectedInv', picoList)
    selectedInv.inventoryDetail?.forEach((item) => {
      const pico = picoList.find((pico) => pico.picoId == item.sourcePicoId)
      if (pico) {
        selectedPicoList.push(pico)
      }
      console.log('pico', pico)
    })
    setSelectedRow(selectedInv)
    setSelectedPico(selectedPicoList)
    setDrawerOpen(true)
  }

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  const updateQuery = (newQuery: Partial<InventoryQuery>) => {
    setQuery({ ...query, ...newQuery })
  }

  // function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  //   let timeoutID: ReturnType<typeof setTimeout> | null

  //   return function (this: any, ...args: Parameters<T>) {
  //     if (timeoutID) {
  //       clearTimeout(timeoutID)
  //     }
  //     timeoutID = setTimeout(() => {
  //       fn.apply(this, args)
  //     }, delay)
  //   }
  // }

  const handleSearch = debounce((keyName, value) => {
    if (value.trim() === '' && query.labelId == null) {
      return
    }
    updateQuery({ [keyName]: value })
    setPage(1)
  }, 500)

  const handleSearchByPoNumb = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.value === '') {
      setFilteredInventory([])
    }
    const numericValue = event.target.value.replace(/\D/g, '')
    event.target.value = numericValue

    if (numericValue.length === 6) {
      setSearchText(`company${numericValue}`)
    } else {
      setSearchText('')
    }
  }

  useEffect(() => {
    if (debouncedSearchValue) {
      setInventory([])
      setFilteredInventory([])
      setSelectedRow(null)
      setPage(1)
      setTotalData(0)
      setPicoList([])
      setSelectedPico([])
      initInventory()
      initWarehouse()
    }
  }, [debouncedSearchValue, query, i18n.language])

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          pr: 4
        }}
      >
        {realmApi === 'account' && (
          <TextField
            id="search-tenantId-inventory"
            onChange={handleSearchByPoNumb}
            sx={styles.inputStyle}
            label={t('tenant.invite_form.company_number')}
            placeholder={t('tenant.enter_company_number')}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
              maxLength: 6
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => {}}>
                    <SEARCH_ICON style={{ color: getPrimaryColor() }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        )}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginY: 4
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t('inventory.recyclingInformation')}
          </Typography>
        </Box>
        <Stack direction="row" mt={3}>
          {searchfield.map((s, index) => (
            <CustomSearchField
              key={index}
              label={s.label}
              width={s?.width}
              placeholder={s.placeholder}
              field={s.field}
              disableIcon={s.disableIcon}
              options={s.options || []}
              onChange={handleSearch}
            />
          ))}
        </Stack>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: '100%' }}>
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Box>
                <DataGrid
                  rows={filteredInventory}
                  getRowId={(row) => row.itemId}
                  hideFooter
                  columns={columns}
                  onRowClick={handleSelectRow}
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
                  getRowClassName={(params) =>
                    selectedRow && params.row.itemId === selectedRow.itemId
                      ? 'selected-row'
                      : ''
                  }
                  sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                      border: 'none'
                    },
                    '& .MuiDataGrid-row': {
                      bgcolor: 'white',
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
                    },
                    '& .selected-row': {
                      backgroundColor: '#F6FDF2 !important',
                      border: '1px solid #79CA25'
                    }
                  }}
                />
                <Pagination
                  className="mt-4"
                  count={Math.ceil(totalData)}
                  page={page}
                  onChange={(_, newPage) => {
                    setPage(newPage)
                  }}
                />
              </Box>
            )}
          </Box>
          <InventoryDetail
            drawerOpen={drawerOpen}
            handleDrawerClose={() => {
              setDrawerOpen(false)
              setSelectedRow(null)
            }}
            selectedRow={selectedRow}
            selectedPico={selectedPico}
          />
        </div>
      </Box>
    </>
  )
}

export default Inventory
