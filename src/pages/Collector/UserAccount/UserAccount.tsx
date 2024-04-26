import React, { FunctionComponent, useState, useEffect } from 'react'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
} from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
// import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  ADD_ICON,
  EDIT_OUTLINED_ICON,
  DELETE_OUTLINED_ICON
} from '../../../themes/icons'

// import TableBase from '../../../components/TableBase'
import StatusLabel from '../../../components/StatusLabel'
import { useTranslation } from 'react-i18next'
import {
  getAllUserAccount
} from '../../../APICalls/userAccount'
import { UserAccount as UserAccountItem} from '../../../interfaces/userAccount'
import UserAccountDetails from './UserAccountDetails'
import StatusCard from '../../../components/StatusCard'
import { styles } from '../../../constants/styles'


type TableRow = {
  id: number
  [key: string]: any
}

type recyTypeItem = {
  [key: string]: any
}

const UserAccount: FunctionComponent = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const currentLanguage = localStorage.getItem('selectedLanguage') || 'zhhk'
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [userAccountItems, setUserAccountItems] = useState<UserAccountItem[]>([])
  //const [page, setPage] = useState(1)
  //const pageSize = 10 // change page size lowerg to testing
  const [userList, setUserList] = useState<string[]>([])
  const [selectedAccount, setSelectedAccount] = useState<UserAccountItem | null>(null)
  const navigate = useNavigate()

  const columns: GridColDef[] = [
    {
      field: 'loginId',
      headerName: t('userAccount.loginName'),
      width: 150,
      type: 'string',

    },
    {
      field: 'staffId',
      headerName:  t('userAccount.staffId'),
      width: 150,
      type: 'string',
    },
    {
      field: 'userGroup',
      headerName:  t('userAccount.userGroup'),
      width: 250,
      type: 'string',
      valueGetter: (params) => params.row?.userGroup.roleName
    },
    {
      field: 'status',
      headerName: t('userAccount.status'),
      width: 300,
      type: 'string',
      renderCell: (params) => <StatusCard status={params.row?.status} />
    },
    {
      field: 'actions',
      headerName: '',
      width: 300,
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <EDIT_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark mr-2"
              onClick={(event) => {
                event.stopPropagation();
                handleEdit(params.row.loginId)}} // Implement your edit logic here
              style={{ cursor: 'pointer' }}
            />
            <DELETE_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark"
              onClick={(event) =>{
                event.stopPropagation();
                handleDelete(params.row.loginId)}} // Implement your delete logic here
              style={{ cursor: 'pointer' }}
            />
          </div>
        )
      }
    }
  ]

  useEffect(() => {
    i18n.changeLanguage(currentLanguage)
  }, [i18n, currentLanguage])

  const handleOnSubmitData = () => {
    setSelectedAccount(null)
  }

  async function fetchDataUserAccount() {
    const result = await getAllUserAccount()
    const accountlist: string[] = []
    if(result?.data){
      setUserAccountItems(result.data)
      result.data.map((item: any) => accountlist.push(item.loginId))
      setUserList(accountlist)
    }
  }

  useEffect(() => {
    fetchDataUserAccount()
  }, [action, drawerOpen, currentLanguage, i18n, currentLanguage])


  const addDataWarehouse = () => {
    setDrawerOpen(true)
    setAction('add')
  }

  const handleEdit = (rowId: string) => {
    setDrawerOpen(true)
    setAction('edit')
    const selectedItem = userAccountItems.find(item => item.loginId == rowId)
    if(selectedItem) {
      setSelectedAccount(selectedItem)
    }
  }

  const handleRowClick = (params: GridRowParams) => {
    const row = params.row as TableRow
    setDrawerOpen(true)
    setAction('edit')
    const selectedItem = userAccountItems.find(item => item.loginId == row.loginId)
    if(selectedItem) {
      setSelectedAccount(selectedItem)
    }
  }

  const handleDelete = (rowId: string) => {
    setDrawerOpen(true)
    setAction('delete')
    const selectedItem = userAccountItems.find(item => item.loginId == rowId)
    if(selectedItem) {
      setSelectedAccount(selectedItem)
    }
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
    // fetchData()
    fetchDataUserAccount()
  }

  const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])


  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: 375, sm: 480, md: '100%' }
      }}
    >
      <div className="warehouse-section">
        <div className="settings-page relative bg-bg-primary w-full h-[2046px] overflow-hidden flex flex-row items-start justify-start text-center text-mini text-grey-darker font-tag-chi-medium">
          <div className=" self-stretch flex-1 bg-white flex flex-col items-start justify-start text-smi text-grey-middle font-noto-sans-cjk-tc">
            <div className="self-stretch flex-1 bg-bg-primary flex flex-col items-start justify-start text-3xl text-black font-tag-chi-medium">
              <div
                className={`settings-container self-stretch flex-1 flex flex-col items-start justify-start pt-[30px] pb-[75px] text-mini text-grey-darker ${
                  isMobile
                    ? 'overflow-auto whitespace-nowrap w-[375px] mx-4 my-0'
                    : ''
                }`}
              >
                <div className="self-stretch flex flex-col items-start justify-start gap-[12px]">
                  <div className="settings-header self-stretch flex flex-row items-center justify-start gap-[12px] text-base text-grey-dark">
                  
                    <Typography fontSize={16} color="grey" fontWeight="600">
                      {t('userAccount.user')}
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
                      onClick={() => {addDataWarehouse()}}
                    >
                      <ADD_ICON /> {t('top_menu.add_new')}
                    </Button>
                   
                  </div>
                  <Box pr={4} pt={3} sx={{ flexGrow: 1, width: '100%' }}>
                    <DataGrid
                      rows={userAccountItems}
                      getRowId={(row) => row.loginId}
                      hideFooter
                      columns={columns}
                      checkboxSelection
                      disableRowSelectionOnClick
                      onRowClick={handleRowClick}
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
                  </Box>
                </div>
              </div>
            </div>
          </div>
          <UserAccountDetails
           drawerOpen={drawerOpen}
           handleDrawerClose={handleDrawerClose}
           selectedItem={selectedAccount}
           action={action}
           onSubmitData={handleOnSubmitData}
           rowId={rowId}
           userList={userList}
           />
        </div>
      </div>
    </Box>
  )
}

export default UserAccount
