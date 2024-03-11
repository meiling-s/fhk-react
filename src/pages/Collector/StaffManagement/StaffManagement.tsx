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
  GridRenderCellParams
} from '@mui/x-data-grid'
import {
  ADD_ICON,
  EDIT_OUTLINED_ICON,
  DELETE_OUTLINED_ICON,
  SEARCH_ICON
} from '../../../themes/icons'

import StaffDetail from './StaffDetail'

import { styles } from '../../../constants/styles'
import { ToastContainer, toast } from 'react-toastify'
import Tabs from '../../../components/Tabs'
import { Staff } from '../../../interfaces/staff'
import { getStaffList } from '../../../APICalls/staff'

import { useTranslation } from 'react-i18next'
import { displayCreatedDate } from '../../../utils/utils'

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
  updatedAt: string
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
    updatedAt
  }
}

const StaffManagement: FunctionComponent = () => {
  const { t } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)
  const tabStaff = [t('staffManagement.list'), t('staffManagement.schedule')]
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [filteredStaff, setFillteredStaff] = useState<Staff[]>([])
  const [selectedRow, setSelectedRow] = useState<Staff | null>(null)
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)

  useEffect(() => {
    initStaffList()
  }, [page])

  const initStaffList = async () => {
    const result = await getStaffList(page - 1, pageSize)
    if (result) {
      const data = result.data.content
      var staffMapping: Staff[] = []
      data.map((item: any) => {
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
            item?.updatedAt
          )
        )
      })
      setStaffList(staffMapping)
      setFillteredStaff(staffMapping)
      setTotalData(result.data.totalPages)
    }
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
      width: 200,
      type: 'string'
    },
    {
      field: 'staffNameEng',
      headerName: 'Employee English Name',
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
      type: 'string',
      renderCell: (params) => {
        return (displayCreatedDate(params.row.updatedAt))
      }
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

  const handleTabChange = () => {}

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

  const onChangeSearch = (searchWord: string) => {
    if (searchWord.trim() !== '') {
      const filteredData: Staff[] = filteredStaff.filter((item) => {
        const lowerCaseSearchWord = searchWord.toLowerCase()
        const lowerCaseStaffId = item.staffId.toLowerCase()
        const staffNameEng = item.staffNameEng.toLowerCase()
        const staffNameTchi = item.staffNameTchi.toLowerCase()

        // Check if staffId starts with the search word
        return (
          lowerCaseStaffId.startsWith(lowerCaseSearchWord) ||
          staffNameEng.startsWith(lowerCaseSearchWord) ||
          staffNameTchi.startsWith(lowerCaseSearchWord)
        )
      })
      setFillteredStaff(filteredData)
    } else {
      setFillteredStaff(staffList)
    }
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
        <Box>
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t('staffManagement.staff')}
          </Typography>
        </Box>
        <Box>
          <Tabs
            tabs={tabStaff}
            navigate={handleTabChange}
            selectedProp={selectedTab}
            className="lg:px-10 sm:px-4 bg-bg-primary"
          />
        </Box>
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
        <Box sx={{ display: 'flex', gap: '8px', maxWidth: '1460px' }}>
          <TextField
            id="staffId"
            onChange={(event) => onChangeSearch(event.target.value)}
            sx={[localstyles.inputState, {width: '450px'}]}
            label={t('staffManagement.employeeId')}
            placeholder={t('staffManagement.enterEmployeeNumber')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => {}}>
                    <SEARCH_ICON style={{ color: '#79CA25' }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            id="staffName"
            onChange={(event) => onChangeSearch(event.target.value)}
            sx={[localstyles.inputState,{ width : '450px'}]}
            label={t('staffManagement.employeeName')}
            placeholder={t('staffManagement.enterEmployeeName')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => {}}>
                    <SEARCH_ICON style={{ color: '#79CA25' }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, maxWidth: '1460px' }}>
            <DataGrid
              rows={filteredStaff}
              getRowId={(row) => row.staffId}
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
        {/* {selectedRow != null && ( */}
        <StaffDetail
          drawerOpen={drawerOpen}
          handleDrawerClose={() => setDrawerOpen(false)}
          action={action}
          selectedItem={selectedRow}
          onSubmitData={onSubmitData}
        />
        {/* )} */}
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

export default StaffManagement
