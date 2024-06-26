import { useEffect, useState, FunctionComponent, useCallback } from 'react'
import {
  Box,
  Typography,
  Pagination,
  Stack,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridRenderCellParams
} from '@mui/x-data-grid'
import { primaryColor, styles } from '../../../constants/styles'
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
import { format, localStorgeKeyName } from '../../../constants/constant'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { getPicoById } from '../../../APICalls/Collector/pickupOrder/pickupOrder'
import { PickupOrder } from '../../../interfaces/pickupOrder'

import { useTranslation } from 'react-i18next'
import i18n from '../../../setups/i18n'
import { SEARCH_ICON } from '../../../themes/icons'
import useDebounce from '../../../hooks/useDebounce'
import { returnApiToken } from '../../../utils/utils'
import { getAllWarehouse } from '../../../APICalls/warehouseManage'
import useLocaleTextDataGrid from '../../../hooks/useLocaleTextDataGrid'
import { InventoryQuery } from '../../../interfaces/inventory'

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
  warehouseId: number,
  recyclingNumber: string,
  recycTypeId: string,
  recycSubTypeId: string,
  packageTypeId: string,
  weight: number,
  unitId: string,
  status: string,
  createdBy: string,
  updatedBy: string,
  inventoryDetail: InvDetails[],
  createdAt: string,
  updatedAt: string,
  location: string
): InventoryItem {
  return {
    itemId,
    warehouseId,
    recyclingNumber,
    recycTypeId,
    recycSubTypeId,
    packageTypeId,
    weight,
    unitId,
    status,
    createdBy,
    updatedBy,
    inventoryDetail,
    createdAt,
    updatedAt,
    location
  }
}

const Inventory: FunctionComponent = () => {
  const { t } = useTranslation()
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
    itemId: null,
    warehouseId: null,
    recycTypeId: '',
    recycSubTypeId: ''
  })

  useEffect(() => {
    mappingRecyleItem()
  }, [recycType])

  useEffect(() => {
    if (realmApi !== 'account') {
      if (recycItem.length > 0) initInventory() //init dat when recyleitem done mapping
    }
  }, [recycItem, page, realmApi, query])

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

  const getAllPickupOrder = async (data: InventoryItem[]) => {
    const picoData: PickupOrder[] = []
    for (let index = 0; index < data.length; index++) {
      const item = data[index]
      for (let index = 0; index < item.inventoryDetail.length; index++) {
        const invDetail = item.inventoryDetail[index]
        const result = await getPicoById(invDetail.sourcePicoId)
        if (result?.data) {
          picoData.push(result.data)
        }
      }
    }

    setPicoList(picoData)
    return picoData
  }

  const initInventory = async () => {
    let result
    if (realmApi === 'account') {
      result = await astdGetAllInventory(
        page - 1,
        pageSize,
        debouncedSearchValue
      )
    } else {
      result = await getAllInventory(page - 1, pageSize, query)
    }
    const data = result?.data
    setInventoryData(data.content)

    if (data) {
      const picoData = await getAllPickupOrder(data.content)
      var inventoryMapping: InventoryItem[] = []
      data.content.map((item: any) => {
        const recy = recycItem.find(
          (re) => re.recycType.id === item.recycTypeId
        )
        const recyName = recy ? recy.recycType.name : '-'
        const subType = recy
          ? recy.recycSubType.find((sub) => sub.id == item.recycSubTypeId)
          : null
        const subName = subType ? subType.name : '-'
        const dateInHK = dayjs.utc(item.createdAt).tz('Asia/Hong_Kong')
        const createdAt = dateInHK.format(`${dateFormat} HH:mm`)

        let selectedPico: PickupOrder[] = []

        item.inventoryDetail?.map((invDetail: InvDetails) => {
          selectedPico = picoData.filter(
            (pico) => pico.picoId == invDetail.sourcePicoId
          )
        })

        inventoryMapping.push(
          createInventory(
            item?.itemId,
            item?.warehouseId,
            item?.recycTypeId,
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
            item?.location
          )
        )
      })
      setInventory(inventoryMapping)
      setFilteredInventory(inventoryMapping)
      setTotalData(data.totalPages)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: t('inventory.date'),
      width: 200,
      type: 'string'
    },
    {
      field: 'recycTypeId',
      headerName: t('inventory.recyleType'),
      width: 200,
      type: 'string'
    },
    {
      field: 'recycSubTypeId',
      headerName: t('inventory.recyleSubType'),
      width: 200,
      type: 'string'
    },
    {
      field: 'packageTypeId',
      headerName: t('inventory.package'),
      width: 200,
      type: 'string'
    },
    {
      field: 'itemId',
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

  const searchfield = [
    {
      label: t('pick_up_order.filter.search'),
      field: 'itemId',
      placeholder: t('placeHolder.enterRecyclingNumber'),
      width: '280px'
    },
    {
      label: t('placeHolder.classification'),
      options: getUniqueOptions('recycTypeId'),
      field: 'recycTypeId',
      placeholder: t('placeHolder.any')
    },
    {
      label: t('placeHolder.subclassification'),
      options: getUniqueOptions('recycSubTypeId'),
      field: 'recycSubTypeId',
      placeholder: t('placeHolder.any')
    },
    {
      label: t('placeHolder.place'),
      field: 'warehouseId',
      options: getUniqueOptions('warehouseId'),
      placeholder: t('placeHolder.any')
    }
  ]

  function getUniqueOptions(propertyName: keyof InventoryItem) {
    const optionMap = new Map()
    inventoryList.forEach((row) => {
      optionMap.set(row[propertyName], row[propertyName])
    })
    const options: Option[] = Array.from(optionMap.values()).map((option) => ({
      value: option,
      label: option
    }))
    options.push({
      value: '',
      label: t('check_in.any')
    })
    console.log("options", inventoryList)
    return options
  }

  const handleSelectRow = (params: GridRowParams) => {
    const selectedInv: InventoryItem = inventoryList.find(
      (item) => item.itemId == params.row.itemId
    )
    let selectedPicoList: PickupOrder[] = []
    selectedInv.inventoryDetail?.forEach((item) => {
      const pico = picoList.find((pico) => pico.picoId == item.sourcePicoId)
      if (pico) {
        selectedPicoList.push(pico)
      }
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

  const handleSearch = (keyName: string, value: string) => {
    updateQuery({ [keyName]: value })
  }

  const handleSearchByPoNumb = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const numericValue = event.target.value.replace(/\D/g, '')
    event.target.value = numericValue

    if (numericValue.length === 6) {
      setSearchText(numericValue)
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
    }
  }, [debouncedSearchValue, query])

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
            label={t('check_in.search')}
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
                    <SEARCH_ICON style={{ color: primaryColor }} />
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
              options={s.options || []}
              onChange={handleSearch}
            />
          ))}
        </Stack>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: '100%' }}>
            <DataGrid
              rows={filteredInventory}
              getRowId={(row) => row.itemId}
              hideFooter
              columns={columns}
              checkboxSelection={false}
              onRowClick={handleSelectRow}
              getRowSpacing={getRowSpacing}
              localeText={localeTextDataGrid}
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
          <InventoryDetail
            drawerOpen={drawerOpen}
            handleDrawerClose={() => setDrawerOpen(false)}
            selectedRow={selectedRow}
            selectedPico={selectedPico}
          />
        </div>
      </Box>
    </>
  )
}

export default Inventory
