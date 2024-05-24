import { useEffect, useState, FunctionComponent, useCallback } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Typography,
  Pagination,
  Container,
  IconButton
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridRenderCellParams
} from '@mui/x-data-grid'
import {
  ADD_ICON,
  EDIT_OUTLINED_ICON,
  DELETE_OUTLINED_ICON
} from '../../../themes/icons'
import EditIcon from '@mui/icons-material/Edit'

import { styles } from '../../../constants/styles'
// import CreateVehicle from './CreateVehicle'
import {
  Vehicle as VehicleItem,
  CreateVehicle as VehiclesForm
} from '../../../interfaces/vehicles'
import { Contract as ContractItem } from '../../../interfaces/contract'
import { getAllContract } from '../../../APICalls/Collector/contracts'
import { ToastContainer, toast } from 'react-toastify'

import { useTranslation } from 'react-i18next'
import { returnApiToken } from '../../../utils/utils'
import { getTenantById } from '../../../APICalls/tenantManage'
import StatusLabel from '../../../components/StatusLabel'
import NumberFormat from './NumberFormat'
import DateFormat from './DateFormat'
import WeightFormat from './WeightFormat'
import { getCurrencyList } from '../../../APICalls/ASTD/currrency'
import CreateCurrency from './CreateCurrency'
import { getDecimalValue } from '../../../APICalls/ASTD/decimal'
import { getDateFormat } from '../../../APICalls/ASTD/date'
import { getWeightTolerance } from '../../../APICalls/ASTD/weight'

interface CurrencyListProps {
  createdAt: string
  createdBy: string
  monetary: string
  monetaryId: number
  description: string
  remark: string
  status: string
  updatedAt: string
  updatedBy: string
}

interface DecimalValueProps {
  createdAt: string
  createdBy: string
  decimalVal: string
  decimalValId: number
  updatedAt: string
  updatedBy: string
}

interface DateFormatProps {
  createdAt: string
  createdBy: string
  dateFormat: string
  dateFormatId: number
  updatedAt: string
  updatedBy: string
}

interface WeightToleranceProps {
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
  weightVariance: string
  weightVarianceId: number
}

const ASTDSettings: FunctionComponent = () => {
  const { t } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [numberDrawerOpen, setNumberDrawerOpen] = useState(false)
  const [dateDrawerOpen, setDateDrawerOpen] = useState(false)
  const [weightDrawerOpen, setWeightDrawerOpen] = useState(false)
  const [currencyDrawerOpen, setCurrencyDrawerOpen] = useState<boolean>(false)
  const [dateFormat, setDateFormat] = useState<DateFormatProps | null>(null)
  const [weightFormat, setWeightFormat] = useState<WeightToleranceProps | null>(
    null
  )
  const [currencyList, setCurrencyList] = useState<CurrencyListProps[]>([])
  const [selectedRow, setSelectedRow] = useState<CurrencyListProps | null>(null)
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const [tenantCurrency, setTenantCurrency] = useState<string>('')
  const [decimalValue, setDecimalValue] = useState<DecimalValueProps | null>(
    null
  )

  useEffect(() => {
    initCurrencyList()
    initDecimalValue()
    initDateFormat()
    initWeightTolerance()
  }, [page])

  const initCurrencyList = async () => {
    const result = await getCurrencyList()
    const data = result?.data

    console.log(data, 'data currency')

    setCurrencyList(data)
  }

  const initDecimalValue = async () => {
    const result = await getDecimalValue()
    const data = result?.data

    setDecimalValue(data)
  }

  const initDateFormat = async () => {
    const result = await getDateFormat()
    const data = result?.data

    setDateFormat(data)
  }

  const initWeightTolerance = async () => {
    const result = await getWeightTolerance()
    const data = result?.data

    setWeightFormat(data)
  }

  const columns: GridColDef[] = [
    {
      field: 'monetary',
      headerName: t('general_settings.name'),
      width: 150,
      type: 'string'
    },
    {
      field: 'description',
      headerName: t('general_settings.introduction'),
      width: 200,
      type: 'string'
    },
    {
      field: 'remark',
      headerName: t('common.remark'),
      width: 100,
      type: 'string'
    },
    {
      field: 'edit',
      headerName: '',
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <EDIT_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark mr-2"
              onClick={(event) => {
                event.stopPropagation()
                handleAction(params, 'edit')
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
        )
      }
    },
    {
      field: 'delete',
      headerName: '',
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <DELETE_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark"
              onClick={(event) => {
                event.stopPropagation()
                handleAction(params, 'delete')
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
        )
      }
    }
  ]

  const handleAction = (
    params: GridRenderCellParams,
    action: 'add' | 'edit' | 'delete'
  ) => {
    setAction(action)
    setRowId(params.row.id)
    setSelectedRow(params.row)
    setCurrencyDrawerOpen(true)
  }

  const handleSelectRow = (params: GridRowParams) => {
    setAction('edit')
    setRowId(params.row.id)
    setSelectedRow(params.row)
    setCurrencyDrawerOpen(true)
  }

  const onSubmitData = (type: string) => {
    if (type == 'currency') {
      initCurrencyList()
      setCurrencyDrawerOpen(false)
    } else if (type === 'decimal') {
      initDecimalValue()
      setNumberDrawerOpen(false)
    } else if (type === 'date') {
      initDateFormat()
      setDateDrawerOpen(false)
    } else if (type === 'weight') {
      initWeightTolerance()
      setWeightDrawerOpen(false)
    }
  }

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  const handleOpenSidebar = (value: string) => {
    if (value === 'number') {
      setNumberDrawerOpen(true)
    } else if (value === 'date') {
      setDateDrawerOpen(true)
    } else if (value === 'weight') {
      setWeightDrawerOpen(true)
    }
  }

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
        <ToastContainer></ToastContainer>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginY: 4
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t('general_settings.number_format')}
          </Typography>
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '5px',
              marginLeft: 0,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' // Optional: Add box shadow
            }}
          >
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {decimalValue !== null && decimalValue.decimalVal}
            </Typography>
            <IconButton onClick={() => handleOpenSidebar('number')}>
              <EditIcon />
            </IconButton>
          </Container>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginY: 4
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t('general_settings.date_format')}
          </Typography>
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '5px',
              marginLeft: 0,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' // Optional: Add box shadow
            }}
          >
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {dateFormat !== null && dateFormat?.dateFormat}
            </Typography>
            <IconButton onClick={() => handleOpenSidebar('date')}>
              <EditIcon />
            </IconButton>
          </Container>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginY: 4
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t('general_settings.weight_tolerance')}
          </Typography>
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '5px',
              marginLeft: 0,
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' // Optional: Add box shadow
            }}
          >
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {weightFormat !== null && weightFormat?.weightVariance}
            </Typography>
            <IconButton onClick={() => handleOpenSidebar('weight')}>
              <EditIcon />
            </IconButton>
          </Container>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginY: 4
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t('general_settings.currency_category')}
          </Typography>
          <Button
            sx={[
              styles.buttonOutlinedGreen,
              {
                width: 'max-content',
                height: '40px'
              }
            ]}
            variant="outlined"
            onClick={() => {
              setCurrencyDrawerOpen(true)
              setAction('add')
            }}
          >
            <ADD_ICON /> {t('top_menu.add_new')}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
            <DataGrid
              rows={currencyList}
              getRowId={(row) => row.monetaryId}
              hideFooter
              columns={columns}
              checkboxSelection
              onRowClick={handleSelectRow}
              getRowSpacing={getRowSpacing}
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
        </div>
      </Box>
      <NumberFormat
        drawerOpen={numberDrawerOpen}
        handleDrawerClose={() => setNumberDrawerOpen(false)}
        action="edit"
        onSubmitData={onSubmitData}
        numberFormat={decimalValue}
      />
      <DateFormat
        drawerOpen={dateDrawerOpen}
        handleDrawerClose={() => setDateDrawerOpen(false)}
        action="edit"
        onSubmitData={onSubmitData}
        dateformat={dateFormat}
      />
      <WeightFormat
        drawerOpen={weightDrawerOpen}
        handleDrawerClose={() => setWeightDrawerOpen(false)}
        action="edit"
        onSubmitData={onSubmitData}
        weightformat={weightFormat}
      />
      <CreateCurrency
        drawerOpen={currencyDrawerOpen}
        handleDrawerClose={() => setCurrencyDrawerOpen(false)}
        action={action}
        onSubmitData={onSubmitData}
        selectedItem={selectedRow}
      />
    </>
  )
}

export default ASTDSettings
