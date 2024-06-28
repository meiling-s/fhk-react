import { useCallback, useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useTranslation } from 'react-i18next'
import { ToastContainer } from 'react-toastify'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams
} from '@mui/x-data-grid'
import DownloadAreaModal from './DownloadAreaModal'
import { getStaffID, getUserAccountById } from '../../../APICalls/Collector/userGroup'
import { Roles, localStorgeKeyName } from '../../../constants/constant'
import { primaryColor } from '../../../constants/styles'
import useLocaleTextDataGrid from '../../../hooks/useLocaleTextDataGrid'

interface reportItem {
  id: number
  report_name: string
  typeFile: string
  reportId: string
  dateOption?: string // daterange, datetime, none
  manualTenantId: boolean,
  tenantId?:string,
  loginId?: string
}

const DownloadArea = () => {
  const { t } = useTranslation()
  const [openModal, setOpenModal] = useState(false)
  const [staffId, setStaffId] = useState('')
  const [selectedRow, setSelectedRow] = useState<reportItem>({
    id: 0,
    report_name: '',
    typeFile: '',
    reportId: '',
    dateOption: '',
    manualTenantId: false,
    tenantId: '',
  })
  const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
  const role = localStorage.getItem(localStorgeKeyName.role)
  const { localeTextDataGrid } = useLocaleTextDataGrid();

  const columns: GridColDef[] = [
    {
      field: 'report_name',
      headerName: t('generate_report.report_name'),
      width: 900,
      type: 'string'
    },
    {
      field: 'download',
      headerName: t('pick_up_order.item.download'),
      filterable: false,
      width: 200,
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              style={{
                backgroundColor: primaryColor,
                color: '#fff',
                borderColor: '#7CE495',
                borderRadius: '20px',
                fontSize: '13px',
                height: '32px',
                fontWeight: '700'
              }}
              onClick={(event) => {
                event.stopPropagation()
                onHandleModal(params)
              }}
            >
              {t('generate_report.download')}
            </Button>
          </div>
        )
      }
    }
  ]

  //report for each role

  const collectorsRows: reportItem[] = [
    // {
    //   id: 1,
    //   report_name: t('generate_report.recycling_point_record'),
    //   typeFile: 'XLS',
    //   reportId: ''
    // },
    // {
    //   id: 2,
    //   report_name: t('generate_report.Waste_ecords_daily_'),
    //   typeFile: 'XLS',
    //   reportId: ''
    // },
    // {
    //   id: 3,
    //   report_name: t('generate_report.recycling_plant_request_records'),
    //   typeFile: 'XLS',
    //   reportId: ''
    // },
    // {
    //   id: 4,
    //   report_name: t('generate_report.recycling_classification_processing'),
    //   typeFile: 'XLS',
    //   reportId: ''
    // },
    // {
    //   id: 5,
    //   report_name: t('generate_report.recycling_classification_statistics'),
    //   typeFile: 'XLS',
    //   reportId: ''
    // },
    {
      id: 6,
      report_name: t('generate_report.recycling_point_establishment'),
      typeFile: 'WORD',
      reportId: '',
      manualTenantId: false
    },
    {
      id: 7,
      report_name: t('generate_report.collection_point_establishment'),
      typeFile: 'XLS',
      reportId: '',
      manualTenantId: false
    },
    {
      id: 8,
      report_name: t('generate_report.recyle_waste_collection'),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000002',
      manualTenantId: false
    },
    {
      id: 9,
      report_name: t('generate_report.daily_waste_collection'),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000004',
      dateOption: 'datetime',
      manualTenantId: false
    },
    {
      id: 10,
      report_name: t('generate_report.recycled_waste_inspection'),
      typeFile: 'WORD',
      reportId: 'downloadWordFnRpt000009',
      manualTenantId: false
    }
  ]

  const logisticRows: reportItem[] = [
    {
      id: 1,
      report_name: t('generate_report.report_of_recycled_waste_pickup_list'),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000001',
      manualTenantId: false
    },
    {
      id: 2,
      report_name: t(
        'generate_report.report_of_recycled_waste_collection_route'
      ),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000003',
      manualTenantId: false
    },
    {
      id: 3,
      report_name: t('generate_report.report_of_logistic_service_vehicle'),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000005',
      manualTenantId: false
    },
    {
      id: 4,
      report_name: t('generate_report.report_of_logistic_service_recycled'),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000006',
      manualTenantId: false
    }
  ]

  const manufacturerRows: reportItem[] = [
    {
      id: 0,
      report_name: t(
        'generate_report.recycled_waste_request_list_manufacturer'
      ),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000011',
      manualTenantId: false
    },
    {
      id: 1,
      report_name: t('generate_report.report_of_manu_recycled_order_list'),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000012',
      manualTenantId: false
    },
    {
      id: 2,
      report_name: t(
        'generate_report.report_of_manu_recycled_waste_tracing_list'
      ),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000013',
      manualTenantId: false
    },
    {
      id: 3,
      report_name: t(
        'generate_report.report_of_manu_recycled_waste_classification_list'
      ),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000014',
      dateOption: 'none',
      manualTenantId: false
    }
  ]

  const customerRows: reportItem[] = [
    {
      id: 1,
      report_name: t('generate_report.recycled_waste_request_list_customer'),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000008',
      manualTenantId: false
    }
  ]

  const astdRows: reportItem[] = [
    {
      id: 1,
      report_name: t(
        'generate_report.report_of_recycled_waste_inventory_manufacturers'
      ),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000010',
      dateOption: 'none',
      manualTenantId: true
    },
    {
      id: 2,
      report_name: t(
        'generate_report.report_of_user_management_list'
      ),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000015',
      dateOption: 'none',
      manualTenantId: false,
      tenantId: 'none'
    },
    {
      id: 3,
      report_name: t(
        'generate_report.report_of_audit_trail'
      ),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000016',
      manualTenantId: false,

    },
    {
      id: 4,
      report_name: t(
        'generate_report.report_of_user_activity'
      ),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000022',
      tenantId: 'none',
      dateOption: 'datetime',
      manualTenantId: false,

    },
    {
      id: 5,
      report_name: t(
        'generate_report.report_of_notification'
      ),
      typeFile: 'XLS',
      reportId: 'downloadExcelFnRpt000023',
      tenantId: 'none',
      manualTenantId: false,
      // loginId: loginId

    }
  ]

  // set list based on role
  let rows: { id: number; report_name: string; typeFile: string }[] = []
  if (role === Roles.collectorAdmin) {
    rows = collectorsRows
  } else if (role === Roles.logisticAdmin) {
    rows = logisticRows
  } else if (role === Roles.manufacturerAdmin) {
    rows = manufacturerRows
  } else if (role === Roles.customerAdmin) {
    rows = customerRows
  } else if (role === Roles.astd) {
    rows = astdRows
  }

  useEffect(() => {
    getUserAccount()
  }, [])

  const getUserAccount = async () => {
    const result = await getStaffID(loginId)
    if (result) {
      setStaffId(result.data)
    }
  }

  const onHandleModal = (params: any) => {
    setOpenModal((prev) => !prev)
    setSelectedRow((prev) => {
      return {
        ...prev,
        id: params?.row?.id,
        report_name: params?.row?.report_name,
        typeFile: params?.row?.typeFile,
        reportId: params?.row?.reportId,
        dateOption: params?.row?.dateOption,
        manualTenantId: params?.row?.manualTenantId,
        tenantId: params?.row?.tenantId,
        loginId: params?.row?.loginId
      }
    })
  }

  const handleSelectRow = (params: GridRowParams) => {
    setOpenModal((prev) => !prev)
    setSelectedRow((prev) => {
      return {
        ...prev,
        id: params?.row?.id,
        report_name: params?.row?.report_name,
        typeFile: params?.row?.typeFile,
        reportId: params?.row?.reportId,
        dateOption: params?.row?.dateOption,
        manualTenantId: params?.row?.manualTenantId,
        tenantId: params?.row?.tenantId,
        loginId: params?.row?.loginId
      }
    })
  }

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 5
    }
  }, [])

  return (
    <Box className="container-wrapper w-full">
      <ToastContainer></ToastContainer>
      <div className="settings-page bg-bg-primary">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <DataGrid
            rows={rows}
            getRowId={(row) => row.id}
            hideFooter
            columns={columns}
            getRowSpacing={getRowSpacing}
            onRowClick={handleSelectRow}
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
          <DownloadAreaModal
            drawerOpen={openModal}
            handleDrawerClose={() => setOpenModal(false)}
            selectedItem={selectedRow}
            staffId={staffId}
          />
        </LocalizationProvider>
      </div>
    </Box>
  )
}

export default DownloadArea
