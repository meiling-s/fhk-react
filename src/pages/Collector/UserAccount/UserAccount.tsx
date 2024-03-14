import React, { FunctionComponent, useState, useEffect } from 'react'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams,
  GridValueGetterParams,
  GridColumnHeaderParams
} from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
// import { useNavigate } from 'react-router-dom'
import { Box , Pagination} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {
  ADD_ICON,
  EDIT_OUTLINED_ICON,
  DELETE_OUTLINED_ICON
} from '../../../themes/icons'
import AddWarehouse from '../Warehouse/AddWarehouse'
import AddUserAccount from '../UserAccount/AddUserAccount'
// import TableBase from '../../../components/TableBase'
import StatusLabel from '../../../components/StatusLabel'
import { useTranslation } from 'react-i18next'
import {
  getAllWarehouse,
  getRecycleType
} from '../../../APICalls/warehouseManage'
import {
  getAllUserAccount
} from '../../../APICalls/userAccount'
import axiosInstance from '../../../constants/axiosInstance'

interface RecyleItem {
  recycTypeId: string
  recycSubTypeId: string
  recycSubTypeCapacity: number
  recycTypeCapacity: number
}

interface Warehouse {
  id: number
  warehouseId: number
  warehouseNameTchi: string
  warehouseNameSchi: string
  warehouseNameEng: string
  location: string
  physicalFlg: string | boolean
  contractNo: string[]
  status: string
  warehouseRecyc: RecyleItem[]
}

interface UserAccount {
  loginId: string
  tenantId: string
  realm: string
  password: string
  staffId: string
  userGroup: 
  {
    groupId: number
    tenantId: string
    roleName: string
    status: string
    createdBy: string
    updatedBy: string
    updatedAt: string
    createdAt:string
    version: number
  }
  status: string,
  lastLoginDatetime: string
  createdBy: string
  updatedBy: string
  updatedAt: string
  createdAt: string
}

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
  const [theLoginId, setTheLoginId] = useState<string>('')
  const [warehouseItems, setWarehouseItems] = useState<Warehouse[]>([])
  const [userAccountItems, setUserAccountItems] = useState<UserAccount[]>([])
  const [recyleTypeList, setRecyleTypeList] = useState<recyTypeItem>({})
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 10 // change page size lowerg to testing
  const [totalData , setTotalData] = useState<number>(0)
  const navigate = useNavigate()

  const columns: GridColDef[] = [
    {
      field: 'loginId',
      headerName: '登入名稱',
      width: 150,
      type: 'string',
     
    },
    {
      field: 'staffId',
      headerName: '員工名稱',
      width: 150,
      type: 'string',
    },
    {
      field: 'userGroup',
      headerName: '用戶群組',
      width: 250,
      type: 'string',
      valueGetter: (params) => params.row?.userGroup.roleName
    },
    {
      field: '是',
      width: 150,
      headerName: '是否批核者',
      type: 'string',
      valueGetter: () => {
        return '是'
      }
    },
    {
      field: 'status',
      headerName: '狀態',
      width: 300,
      type: 'string',
      renderCell: (params) => <StatusLabel status={params.row?.status} />
    },
    {
      field: 'actions',
      headerName: 'actions',
      width: 300,
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <EDIT_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark mr-2"
              onClick={() => handleEdit(params.row.loginId)} // Implement your edit logic here
              style={{ cursor: 'pointer' }}
            />
            <DELETE_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark"
              onClick={() => handleDelete(params.row.loginId)} // Implement your delete logic here
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

  const handleOnSubmitData = (action: string, id?: number, error?: boolean) => {
    if (action == 'add') {
    }

    if (action == 'delete') {
    }

    if (action == 'edit') {
    }
    // fetchData()
    fetchDataUserAccount()
    setDrawerOpen(false)
  }

  const getRecycleData = async () => {
    try {
      const response = await getRecycleType()
      if (response) {
        let recyTypeData: recyTypeItem = recyleTypeList
        recyTypeData = response.data.forEach((item: recyTypeItem) => {
          recyTypeData[item.recycTypeId as keyof recyTypeItem] = {
            recyclableNameEng: item.recyclableNameEng,
            recyclableNameSchi: item.recyclableNameSchi,
            recyclableNameTchi: item.recyclableNameTchi
          }
        })

        setRecyleTypeList((prevData) => {
          return { ...prevData, recyTypeData }
        })
        // fetchData()
        fetchDataUserAccount()
      }
    } catch (error) {
      console.error(error)
    }
  }

  // const fetchData = async () => {
  //   try {
  //     const response = await getAllWarehouse(page - 1, pageSize)
  //     if (response == '401') {
  //       // direct to login if sttUS 401
  //       localStorage.clear()
  //       navigate('/')
  //     } else {
  //       const filteredData = response.data.content
  //       // .filter(
  //       //   (warehouse: Warehouse) =>
  //       //     warehouse.status.toLowerCase() !== 'deleted'
  //       // )
  //       .map(transformToTableRow)

  //     setWarehouseItems(filteredData)
  //     setTotalData(response.data.totalPages)
  //     console.log('fetch DATA', filteredData)
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  async function fetchDataUserAccount() {
    try {
      const response = await axiosInstance.get('http://10.166.22.250/api/v1/administrator/userAccount');
      // const userAccountData = response.data
      const userAccountData = response.data.map( (item: UserAccount) => ({
        ...item,
        id: item.loginId, // Assuming `loginId` is unique
      }));
      console.log("fetchDataUserAccount >> ", userAccountData);
      setUserAccountItems(userAccountData)
    } catch (error) {
      console.error("fetchDataUserAccount ERROR", error);
    }
  }

  useEffect(() => {
    const fetchCategoryAndData = async () => {
      getRecycleData()
    }
    fetchCategoryAndData()
  }, [action, drawerOpen, currentLanguage, page])

  const transformToTableRow = (warehouse: Warehouse): TableRow => {
    const nameLang =
      currentLanguage === 'zhhk'
        ? 'recyclableNameTchi'
        : currentLanguage === 'zhch'
        ? 'recyclableNameSchi'
        : 'recyclableNameEng'
    const recyleType = warehouse.warehouseRecyc
      .map((item: RecyleItem) => {
        //console.log(item.recycTypeId)
        return `${
          recyleTypeList[item.recycTypeId][nameLang as keyof recyTypeItem]
        }`
      })
      .join(', ')
    return {
      id: warehouse.warehouseId,
      warehouseId: warehouse.warehouseId,
      warehouseNameTchi: warehouse.warehouseNameTchi,
      warehouseNameSchi: warehouse.warehouseNameSchi,
      warehouseNameEng: warehouse.warehouseNameEng,
      location: warehouse.location,
      physicalFlg: warehouse.physicalFlg ? t('yes') : t('no'),
      status: warehouse.status,
      contractNo: warehouse.contractNo,
      warehouseRecyc: recyleType
    }
  }

  const addDataWarehouse = () => {
    setDrawerOpen(true)
    setAction('add')
  }

  const handleEdit = (row: TableRow) => {
    setRowId(row.id)
    setTheLoginId(row.loginId)
   // console.log(row)
    setDrawerOpen(true)
    setAction('edit')
    // fetchData()
    fetchDataUserAccount()
  }

  const handleRowClick = (params: GridRowParams) => {
    const row = params.row as TableRow
    setSelectedRow(row)
    setRowId(row.id)
    setTheLoginId(row.loginId)
    setDrawerOpen(true)
    setAction('edit')
  }

  const handleDelete = (row: TableRow) => {
    setRowId(row.id)
    setTheLoginId(row.loginId)
    setDrawerOpen(true)
    setAction('delete')
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

  console.log('LOGIN ID >> ', theLoginId)

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
                    <b className="relative tracking-[0.08em] leading-[28px]">
                      用戶
                    </b>
                    <div
                      className="rounded-6xl bg-white overflow-hidden flex flex-row items-center justify-center py-2 pr-5 pl-3 gap-[5px] cursor-pointer text-smi text-green-primary border-[1px] border-solid border-green-pale"
                      onClick={addDataWarehouse}
                    >
                      <ADD_ICON />
                      <b className="relative tracking-[1px] leading-[20px]">
                        {t('top_menu.add_new')}
                      </b>
                    </div>
                  </div>
                  <Box pr={4} pt={3} sx={{ flexGrow: 1, width: '100%' }}>
                    <DataGrid
                      rows={userAccountItems}
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
                    {/* <Pagination
                      count={Math.ceil(totalData)}
                      page={page}
                      onChange={(_, newPage) => {
                        setPage(newPage) 
                        }}
                    /> */}
                  </Box>
                </div>
              </div>
            </div>
          </div>
          {/* right drawer */}
          <AddUserAccount
            drawerOpen={drawerOpen}
            handleDrawerClose={handleDrawerClose}
            action={action}
            onSubmitData={handleOnSubmitData}
            rowId={rowId}
            theLoginId={theLoginId}
          ></AddUserAccount>
        </div>
      </div>
    </Box>
  )
}

export default UserAccount
