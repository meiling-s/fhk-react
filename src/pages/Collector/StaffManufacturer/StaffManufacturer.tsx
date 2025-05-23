import { useEffect, useState, FunctionComponent, useCallback } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Typography,
  Pagination,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridRenderCellParams,
  GridSortDirection,
  GridSortItem
} from '@mui/x-data-grid'
import {
  ADD_ICON,
  EDIT_OUTLINED_ICON,
  DELETE_OUTLINED_ICON,
  SEARCH_ICON
} from '../../../themes/icons'

import StaffManufacturerDetail from './StaffManufacturerDetails'
import CustomSearchField from '../../../components/TableComponents/CustomSearchField'
import { styles } from '../../../constants/styles'
import { ToastContainer, toast } from 'react-toastify'
import Tabs from '../../../components/Tabs'
import { Staff } from '../../../interfaces/staff'
import { getStaffList } from '../../../APICalls/staff'
import CircularLoading from '../../../components/CircularLoading'
import { useTranslation } from 'react-i18next'
import { displayCreatedDate, extractError, debounce } from '../../../utils/utils'
import UserGroup from '../UserGroup/UserGroup'
import { getAllUserManufacturer } from '../../../APICalls/userManufacturer'
import { useNavigate } from 'react-router-dom'
import { STATUS_CODE } from '../../../constants/constant'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import useLocaleTextDataGrid from '../../../hooks/useLocaleTextDataGrid'
import { staffQuery } from '../../../interfaces/staff'

dayjs.extend(utc)
dayjs.extend(timezone)

function createStaff(
  staffId: string,
  tenantId: string,
  staffNameTchi: string,
  staffNameSchi: string,
  staffNameEng: string,
  titleId: string,
  contactNo: string,
  loginId: string,
  status: string,
  gender: string,
  email: string,
  salutation: string,
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string,
  titleValue: string,
  version: number,
): Staff {
  return {
    staffId,
    tenantId,
    staffNameTchi,
    staffNameSchi,
    staffNameEng,
    titleId,
    contactNo,
    loginId,
    status,
    gender,
    email,
    salutation,
    createdBy,
    updatedBy,
    createdAt,
    updatedAt,
    titleValue,
    version
  }
}

const StaffManufacturer: FunctionComponent = () => {
  const { t } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)
  const tabStaff = [t('staffManagement.list'), t('staffManagement.userGroup')]
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [filteredStaff, setFillteredStaff] = useState<Staff[]>([])
  const [selectedRow, setSelectedRow] = useState<Staff | null>(null)
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const { dateFormat } = useContainer(CommonTypeContainer)
  const navigate = useNavigate()
  const { localeTextDataGrid } = useLocaleTextDataGrid()
  const [query, setQuery] = useState<staffQuery>({
    staffId: '',
    staffName: ''
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    initStaffList()
  }, [page, query])

  const initStaffList = async () => {
    setIsLoading(true)
    try {
      const result = await getAllUserManufacturer(page - 1, pageSize, query)
      if (result) {
        const data = result.data.content
        var staffMapping: Staff[] = []
        data.map((item: any) => {
          const dateInHK = dayjs.utc(item.updatedAt).tz('Asia/Hong_Kong')
          const updatedAt = dateInHK.format(`${dateFormat} HH:mm`)
          staffMapping.push(
            createStaff(
              item?.staffId,
              item?.tenantId,
              item?.staffNameTchi,
              item?.staffNameSchi,
              item?.staffNameEng,
              item?.titleId,
              item?.contactNo,
              item?.loginId,
              item?.status,
              item?.gender,
              item?.email,
              item?.salutation,
              item?.createdBy,
              item?.updatedBy,
              item?.createdAt,
              item?.titleValue,
              updatedAt,
              item?.version,
            )
          )
        })
        setStaffList(staffMapping)
        setFillteredStaff(staffMapping)
        setTotalData(result.data.totalPages)
      }
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
      field: 'staffId',
      headerName: t('staffManagement.employeeId'),
      width: 150,
      type: 'string'
    },
    {
      field: 'staffNameTchi',
      headerName: t('staffManagement.employeeChineseName'),
      width: 220,
      type: 'string'
    },
    {
      field: 'staffNameSchi',
      headerName: t('staffManagement.employeeChineseCn'),
      width: 220,
      type: 'string'
    },
    {
      field: 'staffNameEng',
      headerName: t('staffManagement.employeeEnglishName'),
      width: 200,
      type: 'string'
    },
    {
      field: 'titleId',
      headerName: t('staffManagement.position'),
      width: 150,
      type: 'string'
    },
    {
      field: 'loginId',
      headerName: t('staffManagement.loginName'),
      width: 150,
      type: 'string'
    },
    {
      field: 'contactNo',
      headerName: t('staffManagement.contactNumber'),
      width: 150,
      type: 'string'
    },
    {
      field: 'updatedAt',
      headerName: t('staffManagement.lastLogin'),
      width: 200,
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
                const selected = staffList.find(
                  (item) => item.loginId == params.row.loginId
                )
                event.stopPropagation()
                handleAction(params, 'edit')
                if (selected) setSelectedRow(selected)
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

  const sortModel: GridSortItem[] = [
    {
      field: 'staffId',
      sort: 'asc'
    }
  ]

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

  // const handleTabChange = () => {}
  const handleTabChange = (tab: number) => {
    setSelectedTab(tab)
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
    initStaffList()
    if (type == 'success') {
      showSuccessToast(msg)
    } else {
      showErrorToast(msg)
    }
  }

  const searchfield = [
    {
      label: t('staffManagement.employeeId'),
      placeholder: t('staffManagement.enterEmployeeNumber'),
      field: 'staffId'
    },
    {
      label: t('staffManagement.employeeName'),
      placeholder: t('staffManagement.enterEmployeeName'),
      field: 'staffName'
    }
  ]

  const updateQuery = (newQuery: Partial<staffQuery>) => {
    setQuery({ ...query, ...newQuery })
  }

  const handleSearch =debounce((keyName: string, value: string) => {
    setPage(1)
    updateQuery({ [keyName]: value })
  }, 500)

  // const onChangeSearch = (searchWord: string) => {
  //   if (searchWord.trim() !== "") {
  //     const filteredData: Staff[] = filteredStaff.filter((item) => {
  //       const lowerCaseSearchWord = searchWord.toLowerCase();
  //       const lowerCaseStaffId = item.staffId.toLowerCase();
  //       const staffNameEng = item.staffNameEng.toLowerCase();
  //       const staffNameTchi = item.staffNameTchi.toLowerCase();

  //       // Check if staffId starts with the search word
  //       return (
  //         lowerCaseStaffId.startsWith(lowerCaseSearchWord) ||
  //         staffNameEng.startsWith(lowerCaseSearchWord) ||
  //         staffNameTchi.startsWith(lowerCaseSearchWord)
  //       );
  //     });
  //     setFillteredStaff(filteredData);
  //   } else {
  //     setFillteredStaff(staffList);
  //   }
  // };

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  useEffect(() => {
    if (staffList.length === 0 && page > 1) {
      // move backward to previous page once data deleted from last page (no data left on last page)
      setPage((prev) => prev - 1)
    }
  }, [staffList])

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

        {selectedTab === 0 && (
          <>
            <Box
              sx={{
                marginY: 4
              }}
            >
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
                <ADD_ICON /> {t('staffManagement.addNewEmployees')}
              </Button>
            </Box>
            <Box sx={{ mt: 3, display: 'flex' }}>
              {searchfield.map((s) => (
                <CustomSearchField
                  key={s.field}
                  label={s.label}
                  placeholder={s?.placeholder}
                  field={s.field}
                  options={[]}
                  width="400px"
                  onChange={handleSearch}
                />
              ))}
            </Box>
            <div className="table-vehicle">
              <Box pr={4} sx={{ flexGrow: 1, maxWidth: '1460px' }}>
                {isLoading ? (
                  <CircularLoading />
                ) : (
                  <Box>
                    <DataGrid
                      rows={filteredStaff}
                      getRowId={(row) => row.staffId}
                      hideFooter
                      columns={columns}
                      onRowClick={handleSelectRow}
                      getRowSpacing={getRowSpacing}
                      localeText={localeTextDataGrid}
                      getRowClassName={(params) =>
                        selectedRow && params.id === selectedRow.staffId
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
            {/* {selectedRow != null && ( */}
            <StaffManufacturerDetail
              drawerOpen={drawerOpen}
              handleDrawerClose={() => {
                setDrawerOpen(false)
                setSelectedRow(null)
              }}
              action={action}
              selectedItem={selectedRow}
              onSubmitData={onSubmitData}
            />
            {/* )} */}
          </>
        )}
        {selectedTab === 1 && <UserGroup />}
      </Box>
    </>
  )
}

let localstyles = {
  inputState: {
    mt: 3,
    width: '100%',
    m: 1,
    borderRadius: '10px',
    bgcolor: 'white',
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '& fieldset': {
        borderColor: '#79CA25'
      },
      '&:hover fieldset': {
        borderColor: '#79CA25'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#79CA25'
      },
      '& label.Mui-focused': {
        color: '#79CA25'
      }
    }
  }
}

export default StaffManufacturer
