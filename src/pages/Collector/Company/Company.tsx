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
import { getAllCompany } from '../../../APICalls/Collector/company'
import { Company as CompanyItem } from '../../../interfaces/company'
import CreateCompany from './CreateCompany'
import { extractError } from '../../../utils/utils'
import { useNavigate } from 'react-router-dom'
import { STATUS_CODE } from '../../../constants/constant'
import useLocaleTextDataGrid from '../../../hooks/useLocaleTextDataGrid'

function createCompany(
  companyId: string,
  nameTchi: string,
  nameSchi: string,
  nameEng: string,
  brNo: string,
  description: string,
  remark: string,
  status: string,
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string
): CompanyItem {
  return {
    companyId,
    nameTchi,
    nameSchi,
    nameEng,
    brNo,
    description,
    remark,
    status,
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  }
}

const Company: FunctionComponent = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [totalData, setTotalData] = useState<number>(0)
  // const [companyList, setCompanyList] = useState<CompanyItem[]>([]);
  const [selectedRow, setSelectedRow] = useState<CompanyItem | null>(null)
  const companyTypeList: string[] = [
    'collectorlist',
    'logisticlist',
    'manulist',
    'customerlist'
  ]
  const [selectCompanyType, setSelectCompanyType] = useState<string>('')
  const [collectorList, setCollectorList] = useState<CompanyItem[]>([])
  const [logisticList, setLogisticList] = useState<CompanyItem[]>([])
  const [manuList, setManuList] = useState<CompanyItem[]>([])
  const [customerList, setCustomerList] = useState<CompanyItem[]>([])

  const [collectorData, setCollectorData] = useState<number>(0)
  const [logisticData, setLogisticData] = useState<number>(0)
  const [manuData, setManuData] = useState<number>(0)
  const [customerData, setCustomerData] = useState<number>(0)
  const navigate = useNavigate();
  const { localeTextDataGrid } = useLocaleTextDataGrid();
  
  const initCompanyList = async (companyType: string) => {
   try {
    const result = await getAllCompany(companyType, page - 1, pageSize)
    const data = result?.data
    // setCompanyList(data);
    if (data) {
      var companyMapping: CompanyItem[] = []
      const prefixItemName =
        companyType === 'manulist'
          ? 'manufacturer'
          : companyType.replace('list', '')
      data.content.map((item: any) => {
        companyMapping.push(
          createCompany(
            item[`${prefixItemName}Id`],
            item[`${prefixItemName}NameTchi`],
            item[`${prefixItemName}NameSchi`],
            item[`${prefixItemName}NameEng`],
            item?.brNo,
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
      switch (companyType) {
        case 'collectorlist':
          setCollectorList(companyMapping)
          setCollectorData(data.totalPages)
          break
        case 'logisticlist':
          setLogisticList(companyMapping)
          setLogisticData(data.totalPages)
          break
        case 'manulist':
          setManuList(companyMapping)
          setManuData(data.totalPages)
          break
        case 'customerlist':
          setCustomerList(companyMapping)
          setManuData(data.setCustomerData)
          break
        default:
          break
      }
      setTotalData(data.totalPages)
    }
   } catch (error:any) {
    const {state, realm} =  extractError(error);
    if(state.code === STATUS_CODE[503] ){
      navigate('/maintenance')
    }
   }
  }

  const getSelectedCompanyList = useCallback(
    (companyType: string) => {
      let selectedList: CompanyItem[] = []
      switch (companyType) {
        case 'collectorlist':
          selectedList = collectorList
          break
        case 'logisticlist':
          selectedList = logisticList
          break
        case 'manulist':
          selectedList = manuList
          break
        case 'customerlist':
          selectedList = customerList
          break
        default:
          selectedList = []
          break
      }
      return selectedList
    },
    [collectorList, logisticList, manuList, customerList]
  )

  const getSelectedTotalCompany = useCallback(
    (companyType: string) => {
      let selectedTotalData: number = 0
      switch (companyType) {
        case 'collectorlist':
          selectedTotalData = collectorData
          break
        case 'logisticlist':
          selectedTotalData = logisticData
          break
        case 'manulist':
          selectedTotalData = manuData
          break
        case 'customerlist':
          selectedTotalData = customerData
          break
        default:
          selectedTotalData = 0
          break
      }
      return selectedTotalData
    },
    [collectorData, collectorData, manuData, customerData]
  )

  const initAllData = () => {
    for (const type of companyTypeList) {
      initCompanyList(type)
    }
  }
  useEffect(() => {
    initAllData()
  }, [page])

  const columns: GridColDef[] = [
    {
      field: 'nameTchi',
      headerName: t('common.traditionalChineseName'),
      width: 200,
      type: 'string'
    },
    {
      field: 'nameSchi',
      headerName: t('common.simplifiedChineseName'),
      width: 200,
      type: 'string'
    },
    {
      field: 'nameEng',
      headerName: t('common.englishName'),
      width: 200,
      type: 'string'
    },
    {
      field: 'brNo',
      headerName: t('companyManagement.brNo'),
      width: 200,
      type: 'string'
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

  const findArrayStateByCompanyId = (lists: any, row: any) => {
    for (const { name, list } of lists) {
      const foundItem = list.find(
        (item: { brNo: any; nameEng: any; companyId: any }) =>
          item.companyId === row.companyId &&
          item.nameEng === row.nameEng &&
          item.brNo === row.brNo
      )
      if (foundItem) {
        return [list, name]
      }
    }
    return [null, null]
  }

  const handleAction = (
    params: GridRenderCellParams,
    action: 'add' | 'edit' | 'delete'
  ) => {
    setAction(action)
    setRowId(params.row.id)
    setSelectedRow(params.row)
    setDrawerOpen(true)
    const matchedArrayState = findArrayStateByCompanyId(
      [
        { name: 'collectorlist', list: collectorList },
        { name: 'logisticlist', list: logisticList },
        { name: 'manulist', list: manuList },
        { name: 'customerlist', list: customerList }
      ],
      params.row
    )

    if (matchedArrayState) {
      setSelectCompanyType(matchedArrayState[1])
    } else {
      console.log('No match found.')
    }
  }

  const handleSelectRow = (params: GridRowParams, type: string) => {
    setAction('edit')
    setSelectCompanyType(type)
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
    initAllData()
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

  return (
    <>
      {companyTypeList.map((item, index) => {
        return (
          <Box
            key={index}
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
                {t(`companyManagement.${item}`)}
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
                  setSelectCompanyType(item)
                  setDrawerOpen(true)
                  setAction('add')
                }}
              >
                <ADD_ICON /> {t('top_menu.add_new')}
              </Button>
            </Box>
            <div className="table-vehicle">
              <Box pr={4} sx={{ flexGrow: 1, width: '100%' }}>
                <DataGrid
                  rows={getSelectedCompanyList(item)}
                  getRowId={(row) => row.companyId}
                  hideFooter
                  columns={columns}
                  checkboxSelection
                  onRowClick={(params) => {
                    handleSelectRow(params, item)
                  }}
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
                  getRowClassName={(params) => 
                    selectedRow && 
                    params.id === selectedRow.companyId && 
                    item === selectCompanyType 
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
                  count={Math.ceil(getSelectedTotalCompany(item))}
                  page={page}
                  onChange={(_, newPage) => {
                    setPage(newPage)
                  }}
                />
              </Box>
            </div>
          </Box>
        )
      })}
      {rowId !== 0 && (
        <CreateCompany
          companyType={selectCompanyType}
          drawerOpen={drawerOpen}
          handleDrawerClose={() => {setDrawerOpen(false); setSelectedRow(null)}}
          action={action}
          selectedItem={selectedRow}
          onSubmitData={onSubmitData}
          selectedCompanyList={getSelectedCompanyList(selectCompanyType)}
        />
      )}
    </>
  )
}

export default Company
