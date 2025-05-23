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
import CircularLoading from '../../../components/CircularLoading'
import { useTranslation } from 'react-i18next'
import CreateContract from './CreateContract'
import UpdateCurrency from './UpdateCurrency'
import { extractError, returnApiToken } from '../../../utils/utils'
import { getTenantById } from '../../../APICalls/tenantManage'
import StatusLabel from '../../../components/StatusLabel'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useNavigate } from 'react-router-dom'
import { STATUS_CODE } from '../../../constants/constant'
import useLocaleTextDataGrid from '../../../hooks/useLocaleTextDataGrid'

dayjs.extend(utc)
dayjs.extend(timezone)

type TableRow = {
  id: number
  [key: string]: any
}

function createContract(
  id: number,
  contractNo: string,
  tenantId: string,
  contractFrmDate: string,
  contractToDate: string,
  epdFlg: boolean,
  remark: string,
  parentContractNo: string,
  status: string,
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string,
  version?: number
): ContractItem {
  return {
    id,
    contractNo,
    tenantId,
    contractFrmDate,
    contractToDate,
    epdFlg,
    remark,
    parentContractNo,
    status,
    createdBy,
    updatedBy,
    createdAt,
    updatedAt,
    version
  }
}

const GeneralSettings: FunctionComponent = () => {
  const { t } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currencyDrawerOpen, setCurrencyDrawerOpen] = useState(false)
  const [contractList, setContractList] = useState<ContractItem[]>([])
  const [selectedRow, setSelectedRow] = useState<ContractItem | null>(null)
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const [tenantCurrency, setTenantCurrency] = useState<string>('')
  const [monetaryVersion, setMonetaryVersion] = useState<number>(0)
  const { dateFormat } = useContainer(CommonTypeContainer)
  const navigate = useNavigate()
  const { localeTextDataGrid } = useLocaleTextDataGrid()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    initContractList()
    getTenantData()
  }, [page])

  const initContractList = async () => {
    setIsLoading(true)
    try {
      const result = await getAllContract(page - 1, pageSize)
      const data = result?.data.content
      if (data) {
        var contractMapping: ContractItem[] = []
        data.map((item: any, index: any) => {
          const contractFrmDate = dayjs(item.contractFrmDate).format(
            `${dateFormat}`
          )
          const contractToDate = dayjs(item.contractToDate).format(
            `${dateFormat}`
          )
          contractMapping.push(
            createContract(
              item?.id !== undefined ? item?.id : index,
              item?.contractNo,
              item?.tenantId,
              contractFrmDate,
              contractToDate,
              item?.epdFlg,
              item?.remark,
              item?.parentContractNo,
              item?.status,
              item?.createdBy,
              item?.updatedBy,
              item?.createdAt,
              item?.updatedAt,
              item?.version,
            )
          )
        })
        setContractList(contractMapping)
      }
      setTotalData(result?.data.totalPages)
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
    setIsLoading(false)
  }
  const getTenantData = async () => {
    try {
      const token = returnApiToken()
      const result = await getTenantById(parseInt(token.tenantId))
      const data = result?.data
      setTenantCurrency(data?.monetaryValue || '')
      setMonetaryVersion(data?.version || 0)
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }
  const columns: GridColDef[] = [
    {
      field: 'contractNo',
      headerName: t('general_settings.contract_number'),
      width: 250,
      type: 'string'
    },
    {
      field: 'parentContractNo',
      headerName: t('general_settings.reference_number'),
      width: 200,
      type: 'string'
    },
    {
      field: 'status',
      headerName: t('general_settings.state'),
      width: 150,
      type: 'string',
      renderCell: (params) => <StatusLabel status={params.value} />
    },
    {
      field: 'contractFrmDate',
      headerName: t('general_settings.start_date'),
      width: 170,
      type: 'string'
    },
    {
      field: 'contractToDate',
      headerName: t('general_settings.end_date'),
      width: 170,
      type: 'string'
    },
    {
      field: 'remark',
      headerName: t('common.remark'),
      width: 100,
      type: 'string'
    },
    {
      field: 'epdFlg',
      headerName: t('general_settings.whether'),
      width: 100,
      type: 'string',
      renderCell: (params) => {
        return <div>{params.value ? t('common.yes') : t('common.no')}</div>
      }
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
            />
          </div>
        )
      }
    }
  ]

  useEffect(() => {
    if (contractList.length === 0 && page > 1) {
      // move backward to previous page once data deleted from last page (no data left on last page)
      setPage((prev) => prev - 1)
    }
  }, [contractList])

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
    initContractList()
    getTenantData()
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
              width: '100%',
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
            {t('general_settings.contracts')}
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
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Box>
                {' '}
                <DataGrid
                  rows={contractList}
                  getRowId={(row) => row.id}
                  hideFooter
                  columns={columns}
                  onRowClick={handleSelectRow}
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
                  getRowClassName={(params) =>
                    selectedRow && params.id === selectedRow.id
                      ? 'selected-row'
                      : ''
                  }
                  initialState={{
                    sorting: {
                      sortModel: [{ field: 'contractNo', sort: 'desc' }]
                    }
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
        <CreateContract
          drawerOpen={drawerOpen}
          handleDrawerClose={() => {
            setDrawerOpen(false)
            setSelectedRow(null)
          }}
          action={action}
          rowId={rowId}
          selectedItem={selectedRow}
          onSubmitData={onSubmitData}
          contractList={contractList}
        />
        <UpdateCurrency
          drawerOpen={currencyDrawerOpen}
          handleDrawerClose={() => setCurrencyDrawerOpen(false)}
          action="edit"
          onSubmitData={onSubmitData}
          tenantCurrency={tenantCurrency}
          monetaryVersion={monetaryVersion}
        />
      </Box>
    </>
  )
}

export default GeneralSettings
