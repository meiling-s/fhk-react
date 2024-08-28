import { useEffect, useState, FunctionComponent, useCallback } from 'react'
import { Box, Button, Typography, Pagination } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridRenderCellParams
} from '@mui/x-data-grid'
import { ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { styles } from '../../../constants/styles'
import {
  ADD_ICON,
  EDIT_OUTLINED_ICON,
  DELETE_OUTLINED_ICON
} from '../../../themes/icons'
import CircularLoading from '../../../components/CircularLoading'
import { getAllStaffTitle } from '../../../APICalls/Collector/staffTitle'
import { StaffTitle as StaffTitleItem } from '../../../interfaces/staffTitle'
import CreateStaff from './CreateStaff'
import { useNavigate } from 'react-router-dom'
import { STATUS_CODE } from '../../../constants/constant'
import { extractError } from '../../../utils/utils'
import useLocaleTextDataGrid from '../../../hooks/useLocaleTextDataGrid'

function createStaffTitle(
  titleId: string,
  tenantId: string,
  titleNameTchi: string,
  titleNameSchi: string,
  titleNameEng: string,
  duty: string[],
  description: string,
  remark: string,
  status: string,
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string
): StaffTitleItem {
  return {
    titleId,
    tenantId,
    titleNameTchi,
    titleNameSchi,
    titleNameEng,
    duty,
    description,
    remark,
    status,
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  }
}

const StaffTitle: FunctionComponent = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [totalData, setTotalData] = useState<number>(0)
  const [StaffTitleList, setStaffTitleList] = useState<StaffTitleItem[]>([])
  const [selectedRow, setSelectedRow] = useState<StaffTitleItem | null>(null)
  const navigate = useNavigate()
  const { localeTextDataGrid } = useLocaleTextDataGrid()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const initStaffTitleList = async () => {
    setIsLoading(true)
    try {
      const result = await getAllStaffTitle(page - 1, pageSize)
      const data = result?.data
      // setStaffTitleList(data);
      if (data) {
        var staffTitleMapping: StaffTitleItem[] = []
        data.content.map((item: any) => {
          staffTitleMapping.push(
            createStaffTitle(
              item?.titleId,
              item?.tenantId,
              item?.titleNameTchi,
              item?.titleNameSchi,
              item?.titleNameEng,
              item?.duty,
              item?.description,
              item?.remark,
              item?.status,
              item?.createdBy,
              item?.updatedBy,
              item?.createdAt,
              item?.updatedAt
            )
          )
        })
        setStaffTitleList(staffTitleMapping)
        setTotalData(data.totalPages)
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
    setIsLoading(false)
  }
  useEffect(() => {
    initStaffTitleList()
  }, [page])

  const columns: GridColDef[] = [
    {
      field: 'titleNameTchi',
      headerName: t('common.traditionalChineseName'),
      width: 200,
      type: 'string'
    },
    {
      field: 'titleNameSchi',
      headerName: t('common.simplifiedChineseName'),
      width: 200,
      type: 'string'
    },
    {
      field: 'titleNameEng',
      headerName: t('common.englishName'),
      width: 200,
      type: 'string'
    },
    {
      field: 'duty',
      headerName: t('staff_title.duty'),
      width: 100,
      type: 'number'
    },
    {
      field: 'description',
      headerName: t('common.description'),
      width: 100,
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
      headerName: t('pick_up_order.item.edit'),
      filterable: false,
      renderCell: (params) => {
        return (
          <Button
            onClick={(event) => {
              event.stopPropagation()
              handleAction(params, 'edit')
            }}
          >
            <EDIT_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark mr-2"
              style={{ cursor: 'pointer' }}
            />
          </Button>
        )
      }
    },
    {
      field: 'delete',
      headerName: t('pick_up_order.item.delete'),
      filterable: false,
      renderCell: (params) => {
        return (
          <Button
            onClick={(event) => {
              event.stopPropagation()
              handleAction(params, 'delete')
            }}
          >
            <DELETE_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark"
              style={{ cursor: 'pointer' }}
            />
          </Button>
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
    initStaffTitleList()
    if (type == 'success') {
      showSuccessToast(msg)
    } else {
      showErrorToast(msg)
    }
  }

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  useEffect(() => {
    if (StaffTitleList.length === 0 && page > 1) {
      // move backward to previous page once data deleted from last page (no data left on last page)
      setPage((prev) => prev - 1)
    }
  }, [StaffTitleList])

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
            {t('top_menu.staff_positions')}
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
          <Box pr={4} sx={{ flexGrow: 1, width: '100%' }}>
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Box>
                <DataGrid
                  rows={StaffTitleList}
                  getRowId={(row) => row.titleId}
                  hideFooter
                  columns={columns}
                  onRowClick={handleSelectRow}
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
                  getRowClassName={(params) =>
                    selectedRow && params.id === selectedRow.titleId
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
        {rowId != 0 && (
          <CreateStaff
            drawerOpen={drawerOpen}
            handleDrawerClose={() => {
              setDrawerOpen(false)
              setSelectedRow(null)
            }}
            action={action}
            selectedItem={selectedRow}
            onSubmitData={onSubmitData}
          />
        )}
      </Box>
    </>
  )
}

export default StaffTitle
