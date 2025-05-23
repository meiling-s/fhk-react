import React, {
  useEffect,
  useState,
  FunctionComponent,
  useCallback
} from 'react'
import {
  Box,
  Button,
  Typography,
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

import { styles } from '../../../constants/styles'
import { ToastContainer, toast } from 'react-toastify'

import { useTranslation } from 'react-i18next'
import { extractError } from '../../../utils/utils'
import CircularLoading from '../../../components/CircularLoading'
import { getVehicleData } from '../../../APICalls/ASTD/recycling'
import CreateVehicle from './CreateVehicle'
import { useNavigate } from 'react-router-dom'
import { STATUS_CODE } from '../../../constants/constant'
import useLocaleTextDataGrid from '../../../hooks/useLocaleTextDataGrid'

interface VehicleDataProps {
  createdAt: string
  createdBy: string
  description: string
  remark: string
  status: string
  updatedAt: string
  updatedBy: string
  vehicleTypeId: string
  vehicleTypeNameEng: string
  vehicleTypeNameSchi: string
  vehicleTypeNameTchi: string
  vehicleTypeLimit: string
  version: number
}

const Vehicle: FunctionComponent = () => {
  const { t, i18n } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<VehicleDataProps | null>(null)
  const [vehicleData, setVehicleData] = useState<VehicleDataProps[]>([])
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [totalData, setTotalData] = useState<number>(0)
  const navigate = useNavigate()
  const { localeTextDataGrid } = useLocaleTextDataGrid()

  useEffect(() => {
    initVehicleData()
  }, [page])

  const initVehicleData = async () => {
    setIsLoading(true)
    try {
      const result = await getVehicleData()
      const data = result?.data

      setVehicleData(data)
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
    setIsLoading(false)
  }

  const columns: GridColDef[] = [
    {
      field: 'vehicleTypeNameTchi',
      headerName: t('packaging_unit.traditional_chinese_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'vehicleTypeNameSchi',
      headerName: t('packaging_unit.simplified_chinese_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'vehicleTypeNameEng',
      headerName: t('packaging_unit.english_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'vehicleTypeLimit',
      headerName: t('vehicle.loading_capacity'),
      width: 200,
      type: 'string'
    },
    {
      field: 'description',
      headerName: t('packaging_unit.introduction'),
      width: 250,
      type: 'string'
    },
    {
      field: 'remark',
      headerName: t('packaging_unit.remark'),
      width: 170,
      type: 'string'
    },
    {
      field: 'edit',
      headerName: t('pick_up_order.item.edit'),
      filterable: false,
      renderCell: (params) => {
        return (
          <div 
            data-testid={`astd-vehicles-edit-button-9487` + params.id}
            style={{ display: 'flex', gap: '8px' }}
          >
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
      headerName: t('pick_up_order.item.delete'),
      filterable: false,
      renderCell: (params) => {
        return (
          <div 
            data-testid={`astd-vehicles-delete-button-8790` + params.id}
            style={{ display: 'flex', gap: '8px' }}
          >
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

  const onSubmitData = (type: string) => {
    initVehicleData()
    setDrawerOpen(false)
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

  return (
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
          alignItems: 'center',
          gap: '16px',
          marginY: 4
        }}
      >
        <Typography fontSize={16} color="black" fontWeight="bold">
          {t(`top_menu.vehicles`)}
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
          data-testid={`astd-vehicles-new-button-7594`}
        >
          <ADD_ICON /> {t('top_menu.add_new')}
        </Button>
      </Box>
      <div className="table-vehicle">
        <Box pr={4} sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
          {isLoading ? (
            <CircularLoading />
          ) : (
            <DataGrid
              rows={vehicleData}
              getRowId={(row) => row.vehicleTypeId}
              hideFooter
              columns={columns}
              onRowClick={handleSelectRow}
              getRowSpacing={getRowSpacing}
              localeText={localeTextDataGrid}
              getRowClassName={(params) =>
                selectedRow && params.id === selectedRow.vehicleTypeId
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
          )}
        </Box>
      </div>
      <CreateVehicle
        drawerOpen={drawerOpen}
        handleDrawerClose={() => {
          setDrawerOpen(false)
          setSelectedRow(null)
        }}
        action={action}
        selectedItem={selectedRow}
        onSubmit={onSubmitData}
      />
    </Box>
  )
}

export default Vehicle
