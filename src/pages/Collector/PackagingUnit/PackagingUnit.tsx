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
import { PackagingUnit as PackagingUnitItem } from '../../../interfaces/packagingUnit'
import { ToastContainer, toast } from 'react-toastify'

import { useTranslation } from 'react-i18next'
import { extractError, returnApiToken } from '../../../utils/utils'
import { getTenantById } from '../../../APICalls/tenantManage'
import { getAllPackagingUnit } from '../../../APICalls/Collector/packagingUnit'
import CreatePackaging from './CreatePackaging'
import { STATUS_CODE } from '../../../constants/constant'
import { useNavigate } from 'react-router-dom'

function createPackagingUnit(
  id: number,
  description: string,
  packagingNameEng: string,
  packagingNameSchi: string,
  packagingNameTchi: string,
  packagingTypeId: string,
  remark: string,
  status: string,
  tenantId: string,
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string
): PackagingUnitItem {
  return {
    id,
    description,
    tenantId,
    packagingNameEng,
    packagingNameSchi,
    packagingNameTchi,
    remark,
    packagingTypeId,
    status,
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  }
}

const PackagingUnit: FunctionComponent = () => {
  const { t } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currencyDrawerOpen, setCurrencyDrawerOpen] = useState(false)
  const [packagingMapping, setPackagingMapping] = useState<PackagingUnitItem[]>(
    []
  )
  const [selectedRow, setSelectedRow] = useState<PackagingUnitItem | null>(null)
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const [tenantCurrency, setTenantCurrency] = useState<string>('')
  const [engNameList, setEngNameList] = useState<string[]>([])
  const [schiNameList, setSchiNameList] = useState<string[]>([])
  const [tchiNameList, setTchiNameList] = useState<string[]>([])
  const navigate = useNavigate();

  useEffect(() => {
    initPackagingUnitList()
    getTenantData()
  }, [page])

  const initPackagingUnitList = async () => {
    try {
      const result = await getAllPackagingUnit(page - 1, pageSize)
      const data = result?.data
      if (data) {
        var packagingMapping: PackagingUnitItem[] = []
        setEngNameList([])
        setSchiNameList([])
        setTchiNameList([])

        data.content.map((item: any, index: any) => {
          packagingMapping.push(
            createPackagingUnit(
              item?.id !== undefined ? item?.id : index,
              item?.description,
              item?.packagingNameEng,
              item?.packagingNameSchi,
              item?.packagingNameTchi,
              item?.packagingTypeId,
              item?.remark,
              item?.status,
              item?.tenantId,
              item?.createdBy,
              item?.updatedBy,
              item?.createdAt,
              item?.updatedAt
            )
          )

          setEngNameList((prevEngName: any) => [
            ...prevEngName,
            item.packagingNameEng
          ])
          setSchiNameList((prevSchiName: any) => [
            ...prevSchiName,
            item.packagingNameSchi
          ])
          setTchiNameList((prevTchiName: any) => [
            ...prevTchiName,
            item.packagingNameTchi
          ])
        })
        // console.log(packagingMapping, 'packagingMapping')
        setPackagingMapping(packagingMapping)
        setTotalData(data.totalPages)
      }
    } catch (error) {
      const {state, realm} =  extractError(error);
      if(state.code === STATUS_CODE[503]){
        navigate('/maintenance')
      }
    }
  }
  const getTenantData = async () => {
    try {
      const token = returnApiToken()
      const result = await getTenantById(parseInt(token.tenantId))
      const data = result?.data
      console.log('tenant Data', data)
      setTenantCurrency(data?.monetaryValue || '')
    } catch (error) {
      const {state, realm} =  extractError(error);
      if(state.code === STATUS_CODE[503]){
        navigate('/maintenance')
      }
    }
  }
  const columns: GridColDef[] = [
    {
      field: 'packagingNameTchi',
      headerName: t('packaging_unit.traditional_chinese_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'packagingNameSchi',
      headerName: t('packaging_unit.simplified_chinese_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'packagingNameEng',
      headerName: t('packaging_unit.english_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'description',
      headerName: t('common.description'),
      width: 250,
      type: 'string'
    },
    {
      field: 'remark',
      headerName: t('common.remark'),
      width: 170,
      type: 'string'
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
    initPackagingUnitList()
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
            alignItems: 'center',
            gap: '16px',
            marginY: 4
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t('packaging_unit.packaging_unit')}
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
            <DataGrid
              rows={packagingMapping}
              getRowId={(row) => row.id}
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
        <CreatePackaging
          drawerOpen={drawerOpen}
          handleDrawerClose={() => setDrawerOpen(false)}
          action={action}
          rowId={rowId}
          selectedItem={selectedRow}
          onSubmitData={onSubmitData}
          engNameList={engNameList}
          schiNameList={schiNameList}
          tchiNameList={tchiNameList}
        />
      </Box>
    </>
  )
}

export default PackagingUnit
