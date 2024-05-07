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
import UpdateCurrency from './UpdateCurrency'
import { returnApiToken } from '../../../utils/utils'
import { getTenantById } from '../../../APICalls/tenantManage'
import StatusLabel from '../../../components/StatusLabel'
import { getAllPackagingUnit } from '../../../APICalls/Collector/packagingUnit'
import CreatePackagingUnit from './CreatePackagingUnit'

interface PackagingUnit {
  packagingTypeId: string
  tenantId: string
  packagingNameTchi: string
  packagingNameSchi: string
  packagingNameEng: string
  description: string
  remark: string
  status: string
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

const GeneralSettings: FunctionComponent = () => {
  const { t } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currencyDrawerOpen, setCurrencyDrawerOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<PackagingUnit | null>(null)
  const [packagingMapping, setPackagingMapping] = useState<PackagingUnit[]>([])
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const [tenantCurrency, setTenantCurrency] = useState<string>('')

  useEffect(() => {
    getTenantData()
    initPackagingUnit()
  }, [page])

  const initPackagingUnit = async () => {
    const result = await getAllPackagingUnit(page - 1, pageSize)
    const data = result?.data

    if (data.content) {
        setPackagingMapping(data.content)
        setTotalData(data.totalPages)
    }
  }

  const getTenantData = async () => {
    const token = returnApiToken()
    const result = await getTenantById(parseInt(token.tenantId))
    const data = result?.data
    setTenantCurrency(data.monetaryValue)
  }
  const columns: GridColDef[] = [
    {
      field: 'packagingNameTchi',
      headerName: t('packaging_unit.traditional_chinese_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'packagingNameSchi',
      headerName: t('packaging_unit.simplified_chinese_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'packagingNameEng',
      headerName: t('packaging_unit.english_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'description',
      headerName: t('packaging_unit.introduction'),
      width: 150,
      type: 'string',
    },
    {
      field: 'remark',
      headerName: t('packaging_unit.remark'),
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
    setDrawerOpen(true)
  }

  const handleSelectRow = (params: GridRowParams) => {
    setAction('edit')
    setRowId(params.row.id)
    setSelectedRow(params.row)
    setDrawerOpen(true)
  }

  const onSubmitData = (type: string, msg: string) => {
    getTenantData()
    initPackagingUnit()
    if (type == 'success') {
      showSuccessToast(msg)
    } else {
      showErrorToast(msg)
    }
  }

  const showErrorToast = (msg: string) => {
    toast.error(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    })
  }

  const showSuccessToast = (msg: string) => {
    toast.info(msg, {
      position: 'top-center',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    })
  }

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  const handleOpenSidebar = (value: string) => {
    setCurrencyDrawerOpen(true)
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
            {t('general_settings.default_currency')}
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
              {tenantCurrency}
            </Typography>
            <IconButton onClick={() => handleOpenSidebar('currency')}>
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
            {t('packaging_unit.packaging_unit')}
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
              setDrawerOpen(true)
              setAction('add')
            }}
          >
            <ADD_ICON /> {t('top_menu.add_new')}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
            <DataGrid
              rows={packagingMapping}
              getRowId={(row) => row.packagingTypeId}
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
        <CreatePackagingUnit
          drawerOpen={drawerOpen}
          handleDrawerClose={() => setDrawerOpen(false)}
          action={action}
          onSubmitData={onSubmitData}
          selectedItem={selectedRow}
        />
        <UpdateCurrency
          drawerOpen={currencyDrawerOpen}
          handleDrawerClose={() => setCurrencyDrawerOpen(false)}
          action="edit"
          onSubmitData={onSubmitData}
          tenantCurrency={tenantCurrency}
        />
      </Box>
    </>
  )
}

export default GeneralSettings
