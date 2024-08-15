import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Pagination,
  TextField
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowParams,
  GridRowSpacingParams
} from '@mui/x-data-grid'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getDriverList } from '../../../APICalls/driver'
import CircularLoading from '../../../components/CircularLoading'
import { styles } from '../../../constants/styles'
import { Driver } from '../../../interfaces/driver'
import {
  ADD_ICON,
  DELETE_OUTLINED_ICON,
  EDIT_OUTLINED_ICON,
  SEARCH_ICON
} from '../../../themes/icons'
import {
  getPrimaryColor,
  showErrorToast,
  showSuccessToast
} from '../../../utils/utils'
import DriverDetail from './DriverDetail'
import useLocaleTextDataGrid from '../../../hooks/useLocaleTextDataGrid'

const localstyles = {
  inputState: {
    mt: 3,
    width: '100%',
    m: 1,
    borderRadius: '10px',
    bgcolor: 'white',
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '& fieldset': {
        borderColor: getPrimaryColor()
      },
      '&:hover fieldset': {
        borderColor: getPrimaryColor()
      },
      '&.Mui-focused fieldset': {
        borderColor: getPrimaryColor()
      },
      '& label.Mui-focused': {
        color: getPrimaryColor()
      }
    }
  }
}

const DriverMenu = () => {
  const { t, i18n } = useTranslation()
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const currentLanguage = i18n.language
  const [selectedRow, setSelectedRow] = useState<null | Driver>(null)
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [driverLists, setDriverLists] = useState<Driver[]>([])
  const [filterDriverLists, setFilterDriverLists] = useState<Driver[]>([])
  const { localeTextDataGrid } = useLocaleTextDataGrid()

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'labelId',
        headerName: t('driver.DriverMenu.table.driverId'),
        width: 150,
        type: 'string'
      },
      {
        field: currentLanguage === 'zhch' ? 'driverNameSchi' : 'driverNameTchi',
        headerName:
          currentLanguage === 'zhch'
            ? t('driver.DriverMenu.table.driverSchiName')
            : t('driver.DriverMenu.table.driverTchiName'),
        width: 250,
        type: 'string'
      },
      {
        field: 'driverNameEng',
        headerName: t('driver.DriverMenu.table.driverEngName'),
        width: 250,
        type: 'string'
      },
      {
        field: 'loginId',
        headerName: t('driver.DriverMenu.table.loginName'),
        width: 150,
        type: 'string'
      },
      {
        field: 'contactNo',
        headerName: t('driver.DriverMenu.table.contactNo'),
        width: 150,
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
                style={{ cursor: 'pointer' }}
                onClick={(event) => {
                  event.stopPropagation()
                  handleAction(params, 'edit')
                }}
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
    ],
    [currentLanguage, t]
  )

  const handleSearch = (search: string) => {
    if (search.trim() !== '') {
      const filterData: Driver[] = filterDriverLists.filter((item) =>
        item.driverId.toString().toLowerCase().startsWith(search.toLowerCase())
      )
      setFilterDriverLists(filterData)
      return
    }
    setFilterDriverLists(driverLists)
  }
  const handleAction = (
    params: GridRenderCellParams,
    action: 'add' | 'edit' | 'delete'
  ) => {
    setAction(action)
    setSelectedRow(params.row)
    setDrawerOpen(true)
  }

  const handleSelectRow = (params: GridRowParams) => {
    setAction('edit')
    setSelectedRow(params.row)
    setDrawerOpen(true)
  }

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  const initDriverList = useCallback(async () => {
    setIsLoading(true)
    const res = await getDriverList(page - 1, pageSize)
    if (res) {
      const data = res.data.content
      const driverList = [...data]
      setDriverLists(driverList)
      setFilterDriverLists(driverList)
      setTotalData(res.data.totalPages)
    }
    setIsLoading(false)
  }, [page, pageSize])

  const onSubmitData = (type: 'success' | 'error', msg: string) => {
    if (type === 'success') {
      showSuccessToast(msg)
    } else {
      showErrorToast(msg)
    }
    initDriverList()
  }

  useEffect(() => {
    initDriverList()
  }, [initDriverList])

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        px: 8
      }}
    >
      <Box sx={{ marginY: 4 }}>
        <Button
          sx={[
            styles.buttonOutlinedGreen,
            {
              width: 'max-content',
              height: '40px'
            }
          ]}
          onClick={() => {
            setDrawerOpen(true)
            setAction('add')
          }}
          variant="outlined"
        >
          <ADD_ICON />
          {t('driver.DriverMenu.AddBtn')}
        </Button>
      </Box>
      <Box>
        <TextField
          label={t('driver.DriverMenu.table.driverId')}
          placeholder={t('driver.DriverMenu.table.enterDriverId')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => {}}>
                  <SEARCH_ICON style={{ color: getPrimaryColor() }} />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={[localstyles.inputState, { width: '1460px' }]}
          onChange={(e) => handleSearch(e.target.value)}
          InputLabelProps={{
            style: { color: getPrimaryColor() },
            focused: true
          }}
        />
      </Box>
      <div className="table-vehicle">
        <Box pr={4} sx={{ flexGrow: 1, maxWidth: '1460px' }}>
          {isLoading ? (
            <CircularLoading />
          ) : (
            <Box>
              <DataGrid
                rows={filterDriverLists}
                getRowId={(row) => row.driverId}
                hideFooter
                columns={columns}
                onRowClick={handleSelectRow}
                getRowSpacing={getRowSpacing}
                localeText={localeTextDataGrid}
                getRowClassName={(params) =>
                  selectedRow && params.id === selectedRow.driverId
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
      <DriverDetail
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setSelectedRow(null)
        }}
        action={action}
        onSubmitData={(type, msg) => onSubmitData(type, msg)}
        driver={selectedRow}
      />
    </Box>
  )
}
export default DriverMenu
