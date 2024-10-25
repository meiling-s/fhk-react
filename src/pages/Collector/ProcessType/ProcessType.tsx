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
import StatusCard from '../../../components/StatusCard'

import { styles } from '../../../constants/styles'
import { ToastContainer, toast } from 'react-toastify'
import CircularLoading from '../../../components/CircularLoading'
import { useTranslation } from 'react-i18next'
import { extractError, returnApiToken } from '../../../utils/utils'
import { STATUS_CODE } from '../../../constants/constant'
import { useNavigate } from 'react-router-dom'
import useLocaleTextDataGrid from '../../../hooks/useLocaleTextDataGrid'
import { ProcessTypeData, ProcessTypeItem } from '../../../interfaces/processType'
import CreateProcessType from './CreateProcessType'
import { getWeightUnit } from '../../../APICalls/ASTD/recycling'
import { WeightUnit } from '../../../interfaces/weightUnit'
import { getProcessTypeData } from '../../../APICalls/Collector/processType'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'


const ProcessType: FunctionComponent = () => {
  const { t, i18n } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const {weightUnits} = useContainer(CommonTypeContainer)
  const [processTypeData, setProcessTypeData] = useState<ProcessTypeData[]>(
    []
  )
  const [selectedRow, setSelectedRow] = useState<ProcessTypeData | null>(null)
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const navigate = useNavigate()
  const { localeTextDataGrid } = useLocaleTextDataGrid()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [weightUnit, setWeightUnit] = useState<WeightUnit[]>([])

  useEffect(() => {
    initProcessTypeData()
    initWeightUnit()
  }, [page])

  const initProcessTypeData = async () => {
    try {
      const result = await getProcessTypeData(page - 1, pageSize)
      const data = result?.data
      if (data) {
        var processTypeMapping: ProcessTypeData[] = []
  
        data.content.map((item: ProcessTypeData) => {
          const selectedWeightUnit = weightUnits.find(value => value.unitId === item?.processingWeightUnitId)
          const weightUnitLang = i18n.language === 'enus' ? selectedWeightUnit?.unitNameEng : i18n.language === 'zhhk' ? selectedWeightUnit?.unitNameTchi : selectedWeightUnit?.unitNameSchi
          const selectedTimeUnit = item?.processingTimeUnit === 'D' ? 'Day' : item?.processingTimeUnit === 'h' ? 'Hour' : item?.processingTimeUnit === 'm' ? 'Minute' : 'Second'
          processTypeMapping.push({
            processTypeNameEng: item?.processTypeNameEng,
            processTypeNameSchi: item?.processTypeNameSchi,
            processTypeNameTchi: item?.processTypeNameTchi,
            processTypeId: item?.processTypeId,
            description: item?.description,
            remark: item?.remark,
            createdAt: item?.createdAt,
            createdBy: item?.createdBy,
            updatedAt: item?.updatedAt,
            updatedBy: item?.updatedBy,
            processingTime: item?.processingTime,
            processingTimeUnit: item?.processingTimeUnit,
            processingWeightUnitId: item?.processingWeightUnitId,
            status: item?.status,
            processingStructure: `${item?.processingTime} ${selectedTimeUnit} / ${weightUnitLang}`,
            version: item?.version
          })
        })

        setProcessTypeData(processTypeMapping)
        setTotalData(data.totalPages)
      }

    } catch (error) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const initWeightUnit = async () => {
    try {
      const result = await getWeightUnit(0, 1000)
      const data = result?.data

      setWeightUnit(data)
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'processTypeNameTchi',
      headerName: t('process_type.traditional_chinese_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'processTypeNameSchi',
      headerName: t('process_type.simplified_chinese_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'processTypeNameEng',
      headerName: t('process_type.english_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'processingStructure',
      headerName: t('process_type.time'),
      width: 300,
      type: 'string'
    },
    {
      field: 'description',
      headerName: t('common.description'),
      width: 250,
      type: 'string'
    },
    {
      field: 'remark',
      headerName: t('common.remark'),
      width: 170,
      type: 'string'
    },
    {
      field: 'edit',
      headerName: t('pick_up_order.item.edit'),
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
              data-testId='astd-product-type-edit-button-4166'
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <DELETE_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark"
              onClick={(event) => {
                event.stopPropagation()
                handleAction(params, 'delete')
              }}
              style={{ cursor: 'pointer' }}
              data-testId='astd-product-type-delete-button-4927'
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
    initProcessTypeData()
    if (type == 'success') {
      showSuccessToast(msg)
    } else {
      showErrorToast(msg)
    }
  }

  useEffect(() => {
    if (processTypeData.length === 0 && page > 1) {
      // move backward to previous page once data deleted from last page (no data left on last page)
      setPage((prev) => prev - 1)
    }
  }, [processTypeData])

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
            alignItems: 'center',
            gap: '16px',
            marginY: 4
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t('process_type.process_type')}
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
            data-testid='astd-product-type-new-button-4297'
          >
            <ADD_ICON /> {t('top_menu.add_new')}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Box>
                <DataGrid
                  rows={processTypeData}
                  getRowId={(row) => row.processTypeId}
                  hideFooter
                  columns={columns}
                  onRowClick={handleSelectRow}
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
                  getRowClassName={(params) =>{
                    if (selectedRow && params.id === selectedRow.processTypeId) {
                      return 'selectedRow'
                    }
                    return ''
                  }}
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
        <CreateProcessType
          drawerOpen={drawerOpen}
          handleDrawerClose={() => {
            setDrawerOpen(false)
            setSelectedRow(null)
          }}
          action={action}
          rowId={rowId}
          onSubmitData={onSubmitData}
          weightUnit={weightUnit}
          selectedItem={selectedRow}
        />
      </Box>
    </>
  )
}

export default ProcessType
