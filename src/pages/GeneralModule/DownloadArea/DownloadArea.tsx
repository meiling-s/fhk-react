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
import { getUserAccountById } from '../../../APICalls/Collector/userGroup'
import { localStorgeKeyName } from '../../../constants/constant'

const DownloadArea = () => {
  const { t } = useTranslation()
  const [openModal, setOpenModal] = useState(false)
  const [staffId, setStaffId] = useState('')
  const [selectedRow, setSelectedRow] = useState<{
    id: number
    report_name: string
    typeFile: string
  }>({ id: 0, report_name: '', typeFile: '' })
  const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
  const role = localStorage.getItem(localStorgeKeyName.role)

  const columns: GridColDef[] = [
    {
      field: 'report_name',
      headerName: t('generate_report.report_name'),
      width: 900,
      type: 'string'
    },
    {
      field: 'edit',
      headerName: '',
      width: 200,
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              style={{
                backgroundColor: '#79CA25',
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

  const collectorsRows: {
    id: number
    report_name: string
    typeFile: string
  }[] = [
    {
      id: 1,
      report_name: t('generate_report.recycling_point_record'),
      typeFile: 'XLS'
    },
    {
      id: 2,
      report_name: t('generate_report.Waste_ecords_daily_'),
      typeFile: 'XLS'
    },
    {
      id: 3,
      report_name: t('generate_report.recycling_plant_request_records'),
      typeFile: 'XLS'
    },
    {
      id: 4,
      report_name: t('generate_report.recycling_classification_processing'),
      typeFile: 'XLS'
    },
    {
      id: 5,
      report_name: t('generate_report.recycling_classification_statistics'),
      typeFile: 'XLS'
    },
    {
      id: 6,
      report_name: t('generate_report.recycling_point_establishment'),
      typeFile: 'WORD'
    },
    {
      id: 7,
      report_name: t('generate_report.collection_point_establishment'),
      typeFile: 'XLS'
    },
    {
      id: 8,
      report_name: t('generate_report.recyle_waste_collection'),
      typeFile: 'XLS'
    }
  ]

  // todo : can add another title report list

  // set list based on role
  const rows: { id: number; report_name: string; typeFile: string }[] =
    role === 'collector' ? collectorsRows : collectorsRows

  useEffect(() => {
    getUserAccount()
  }, [])

  const getUserAccount = async () => {
    const result = await getUserAccountById(loginId)
    if (result) {
      setStaffId(result.data?.staffId)
    }
  }

  const onHandleModal = (params: any) => {
    setOpenModal((prev) => !prev)
    setSelectedRow((prev) => {
      return {
        ...prev,
        id: params?.row?.id,
        report_name: params?.row?.report_name,
        typeFile: params?.row?.typeFile
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
        typeFile: params?.row?.typeFile
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
