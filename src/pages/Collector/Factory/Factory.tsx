import React, { FunctionComponent, useState, useEffect, useCallback } from 'react'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridRowSpacingParams
} from '@mui/x-data-grid'

import { Box, Button, Typography, Pagination } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  ADD_ICON,
  EDIT_OUTLINED_ICON,
  DELETE_OUTLINED_ICON
} from '../../../themes/icons'

import CircularLoading from '../../../components/CircularLoading'
import { styles } from '../../../constants/styles'

import useLocaleTextDataGrid from '../../../hooks/useLocaleTextDataGrid'
import { toast, ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import DetailFactory from './DetailFactory'
import { FactoryData, FactoryWarehouseData } from '../../../interfaces/factory'
import { getAllFactories, getAllFactoriesWarehouse } from '../../../APICalls/Collector/factory'

type TableRow = {
  id: number
  [key: string]: any
}

interface PaginatedResponse {
  content: FactoryData[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

const Factory: FunctionComponent = () => {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const [selectedRow, setSelectedRow] = useState<FactoryData | null>(null)
  const [factoryDataList, setFactoryDataList] = useState<FactoryData[]>([])
  const [allFactoryDataList, setAllFactoryDataList] = useState<FactoryData[]>([])
  const [warehouseDataList, setWarehouseDataList] = useState<FactoryWarehouseData[]>([])
  const [warehouseMap, setWarehouseMap] = useState<Record<number, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const { localeTextDataGrid } = useLocaleTextDataGrid()

  useEffect(() => {
    initFactoryList()
    initWarehouseList()
    initAllFactoryList()
  }, [page])

  const initFactoryList = (async () => {
    setIsLoading(true)
    setFactoryDataList([])
    const result = await getAllFactories(page-1, pageSize)
    const data = result?.data as PaginatedResponse
  
    if (data) {
      setFactoryDataList(data.content)
      setTotalData(data.totalPages)
      setIsLoading(false)
    }   
  })

  const initAllFactoryList = (async () => {
    setIsLoading(true)
    setAllFactoryDataList([])
    const result = await getAllFactories(0, 1000)
    const data = result?.data as PaginatedResponse
  
    if (data) {
      setAllFactoryDataList(data.content)
      setIsLoading(false)
    }   
  })

  const initWarehouseList = (async () => {
    setIsLoading(true)
    setFactoryDataList([])
    const result = await getAllFactoriesWarehouse()
    const data = result?.data 
  
    if (data) {
      setWarehouseDataList(data)
      setIsLoading(false)
    }   
  })

  const getLocalizedWarehouseName = (warehouse: FactoryWarehouseData): string => {
    switch (i18n.language) {
      case 'enus':
        return warehouse.warehouseNameEng || ''
      case 'zhch':
        return warehouse.warehouseNameSchi || ''
      default:
        return warehouse.warehouseNameTchi || ''
    }
  }

  const getWarehouseNames = (factoryWarehouses: any[]): string => {
    if (!factoryWarehouses || !Array.isArray(factoryWarehouses)) return ''
    
    return factoryWarehouses.map(fw => {
      const warehouse = warehouseDataList.find(w => w.warehouseId === fw.warehouseId)
      return warehouse ? getLocalizedWarehouseName(warehouse) : ''
    }).filter(name => name).join(', ')
}

  

  const columns: GridColDef[] = [
    {
      field: 'factoryNameTchi',
      headerName: t('common.traditionalChineseName'),
      width: 200,
      type: 'string'
    },
    {
      field: 'factoryNameSchi',
      headerName: t('common.simplifiedChineseName'),
      width: 200,
      type: 'string'
    },
    {
      field: 'factoryNameEng',
      headerName: t('common.englishName'),
      width: 250,
      type: 'string'
    },
    {
      field: 'address',
      headerName: t('warehouse_page.place'),
      width: 250,
      type: 'string'
    },
    {
      field: 'factoryWarehouse',
      headerName: t('factory.warehouse'),
      width: 300,
      type: 'string',
      renderCell: (params) => {
        const warehouses = params.value
        return getWarehouseNames(warehouses)
      }
    },
    {
      field: 'actions',
      headerName: '',
      width: 300,
      filterable: false,
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
    const row = params.row 
    setAction('edit')
    setSelectedRow(row)
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
    setSelectedRow(null)
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

  const onSubmitData = (type: string, msg: string) => {
    initFactoryList()
    initWarehouseList()
    initAllFactoryList()
    setSelectedRow(null)
    if (type == 'success') {
      showSuccessToast(msg)
    } else {
      showErrorToast(msg)
    }
  }

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  return (
    <>
      <Box
        className="factory-page"
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
          <Typography fontSize={16} color="grey" fontWeight="600">
            {t('factory.factory')}
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
              setSelectedRow(null)
            }}
          >
            <ADD_ICON /> {t('top_menu.add_new')}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: '100%' }}>
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Box>
                <DataGrid
                  rows={factoryDataList}
                  getRowId={(row) => row.factoryId}
                  hideFooter
                  loading={isLoading}
                  columns={columns}
                  onRowClick={handleSelectRow}
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
                  getRowClassName={(params) =>
                    selectedRow && params.id === selectedRow.factoryId
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
        </div>
        <DetailFactory
          drawerOpen={drawerOpen}
          selectedItem={selectedRow}
          handleDrawerClose={handleDrawerClose}
          action={action}
          onSubmitData={onSubmitData}
          allFactoriesData={allFactoryDataList}
        />
      </Box>
    </>
  )
}

export default Factory
