import React, { useEffect, useState, FunctionComponent, useCallback } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Typography,
  Pagination,
  Container,
  IconButton,
  Switch
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
import { getAllContract } from '../../../APICalls/Collector/contracts'
import { ToastContainer, toast } from 'react-toastify'

import { useTranslation } from 'react-i18next'
import { returnApiToken } from '../../../utils/utils'
import { getTenantById } from '../../../APICalls/tenantManage'
import StatusLabel from '../../../components/StatusLabel'
import { GET_ALL_RECYCLE_TYPE, GET_RECYC_TYPE } from '../../../constants/requests'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import axiosInstance from '../../../constants/axiosInstance'
import { AXIOS_DEFAULT_CONFIGS } from '../../../constants/configs'
import { t } from 'i18next'
import RecyclingFormat from './RecyclingFormat'
import { getAllPackagingUnit, getRecycCode, getWeightUnit } from '../../../APICalls/ASTD/recycling'
import WeightFormat from './WeightFormat'

interface WeightFormatProps {
  createdAt: string
  createdBy: string
  description: string
  poDetail: string[]
  remark: string
  status: string
  unitId: number
  unitNameEng: string
  unitNameSchi: string
  unitNameTchi: string
  updatedAt: string
  updatedBy: string
  weight: number
}

interface recyleSubtyeData {
  recycSubTypeId: string
  recyclableNameEng: string
  recyclableNameSchi: string
  recyclableNameTchi: string
  remark: string
  status: string
  updatedAt: string
  updatedBy: string
}

interface recyleTypeData {
  createdAt: string
  createdBy: string
  description: string
  recycSubType: recyleSubtyeData[]
  recycTypeId: string
  recyclableNameEng: string
  recyclableNameSchi: string
  recyclableNameTchi: string
  remark: string
  status: string
  updatedAt: string
  updatedBy: string
}

const RecyclingUnit: FunctionComponent = () => {
  const { t, i18n } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<WeightFormatProps | null>(null)
  const [selectedRecyclingRow, setSelectedRecyclingRow] = useState<recyleTypeData | null>(null)
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const [recyclableType, setRecyclableType] = useState([])
  const [packagingUnit, setPackagingUnit] = useState([])
  const [weightUnit, setWeightUnit] = useState([])
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const [recycDrawerOpen, setRecycDrawerOpen] = useState<boolean>(false)
  const [weightDrawerOpen, setWeightDrawerOpen] = useState<boolean>(false)

  useEffect(() => {
    initRecycTypeList()
    // initRecycCode() api not ready
    // initPackagingUnit() api not ready
    initWeightUnit()
  }, [page])

  const initRecycTypeList = async () => {
    var response = await axiosInstance({
      baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.administrator,
      ...GET_RECYC_TYPE
      // headers: { Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`, },
    })
    const data = response.data
    setRecyclableType(data)
  }

  const initRecycCode = async () => {
    const result = await getRecycCode(page -1, pageSize)
    const data = result?.data
    console.log(data, 'data recyc code')
  }

  const initPackagingUnit = async () => {
    const result = await getAllPackagingUnit(page - 1, pageSize)
    const data = result?.data
    console.log(data, 'data packaging list')
  }

  const initWeightUnit = async () => {
    const result = await getWeightUnit(page - 1, pageSize)
    const data =result?.data
    
    setWeightUnit(data)
  }

  const codeColumns: GridColDef[] = [
    {
      field: 'code',
      headerName: t('recycling_unit.recyclable_code'),
      width: 200,
      type: 'string',
    },
    {
      field: 'main',
      headerName: t('recycling_unit.main_category'),
      width: 200,
      type: 'string',
    },
    {
      field: 'sub',
      headerName: t('recycling_unit.sub_category'),
      width: 200,
      type: 'string',
    },
  ]

  const columns: GridColDef[] = [
    {
      field: 'recyclableNameTchi',
      headerName: t('packaging_unit.traditional_chinese_name'),
      width: 200,
      type: 'string',
    },
    {
      field: 'recyclableNameSchi',
      headerName: t('packaging_unit.simplified_chinese_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'recyclableNameEng',
      headerName: t('packaging_unit.english_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'description',
      headerName: t('packaging_unit.introduction'),
      width: 250,
      type: 'string'
    },
    {
      field: 'remark',
      headerName: t('packaging_unit.remark'),
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
                handleAction(params, 'edit', 'packaging')
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
                handleAction(params, 'delete', 'packaging')
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
        )
      }
    }
  ]

  const weightColumns: GridColDef[] = [
    {
      field: 'unitNameTchi',
      headerName: t('packaging_unit.traditional_chinese_name'),
      width: 200,
      type: 'string',
    },
    {
      field: 'unitNameSchi',
      headerName: t('packaging_unit.simplified_chinese_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'unitNameEng',
      headerName: t('packaging_unit.english_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'weight',
      headerName: t('recycling_unit.1kg_equivalent'),
      width: 200,
      type: 'string'
    },
    {
      field: 'description',
      headerName: t('packaging_unit.introduction'),
      width: 250,
      type: 'string'
    },
    {
      field: 'remark',
      headerName: t('packaging_unit.remark'),
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
                handleAction(params, 'edit', 'weight')
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
                handleAction(params, 'delete', 'weight')
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
    action: 'add' | 'edit' | 'delete',
    value: 'weight' | 'packaging' | 'code'
  ) => {
    setAction(action)
    setRowId(params.row.id)
    setSelectedRow(params.row)
    if (value === 'weight') {
      setWeightDrawerOpen(true)
    } else if (value === 'packaging') {
      console.log('hit')
    } else {
      console.log('hitt')
    }
  }

  const handleSelectRow = (params: GridRowParams) => {
    setAction('edit')
    setRowId(params.row.id)
    setSelectedRow(params.row)
    setDrawerOpen(true)
  }
  
  const weightHandleSelectRow = (params: GridRowParams) => {
    setAction('edit')
    setRowId(params.row.id)
    setSelectedRow(params.row)
    setWeightDrawerOpen(true)
  }

  const onSubmitData = (type: string, msg: string) => {

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

  }

  const customGridHandleAction = (value: any, action: any) => {
    setRecycDrawerOpen(true)
    setAction(action)
    setSelectedRecyclingRow(value)
  }

  const handleOnSubmitData = () => {
    console.log('hitt')
  }

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          pr: 4,
        }}
      >
        <ToastContainer></ToastContainer>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginY: 4,
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t(`recycling_unit.recyclable_subtype_semi_complete`)}
          </Typography>
          <Button
            sx={[
              styles.buttonOutlinedGreen,
              {
                width: "max-content",
                height: "40px",
              },
            ]}
            variant="outlined"
            onClick={() => {setRecycDrawerOpen(true); setAction('add')}}
          >
            <ADD_ICON /> {t("top_menu.add_new")}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
            <CustomDataGrid data={recyclableType} customGridHandleAction={customGridHandleAction} />
            <Pagination
              className="mt-4"
              count={Math.ceil(totalData)}
              page={page}
              onChange={(_, newPage) => {
                setPage(newPage);
              }}
            />
          </Box>
        </div>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginY: 4,
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t(`recycling_unit.recyclable_code`)}
          </Typography>
          <Button
            sx={[
              styles.buttonOutlinedGreen,
              {
                width: "max-content",
                height: "40px",
              },
            ]}
            variant="outlined"
            onClick={() => setRecycDrawerOpen(true)}
          >
            <ADD_ICON /> {t("top_menu.add_new")}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
            <DataGrid
              rows={[]}
              getRowId={(row) => row}
              hideFooter
              columns={codeColumns}
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginY: 4,
            }}
          >
            <Typography fontSize={16} color="black" fontWeight="bold">
              {t(`recycling_unit.packaging_unit`)}
            </Typography>
            <Button
              sx={[
                styles.buttonOutlinedGreen,
                {
                  width: "max-content",
                  height: "40px",
                },
              ]}
              variant="outlined"
              onClick={() => setRecycDrawerOpen(true)}
            >
              <ADD_ICON /> {t("top_menu.add_new")}
            </Button>
          </Box>
        </div>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
            <DataGrid
              rows={packagingUnit}
              getRowId={(row) => row}
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
          </Box>
          <Pagination
            className="mt-4"
            count={Math.ceil(totalData)}
            page={page}
            onChange={(_, newPage) => {
              setPage(newPage)
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginY: 4,
            }}
          >
            <Typography fontSize={16} color="black" fontWeight="bold">
              {t(`recycling_unit.weight_unit`)}
            </Typography>
            <Button
              sx={[
                styles.buttonOutlinedGreen,
                {
                  width: "max-content",
                  height: "40px",
                },
              ]}
              variant="outlined"
              onClick={() => {setWeightDrawerOpen(true); setAction('add')}}
            >
              <ADD_ICON /> {t("top_menu.add_new")}
            </Button>
          </Box>
        </div>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
            <DataGrid
              rows={weightUnit}
              getRowId={(row) => row.unitId}
              hideFooter
              columns={weightColumns}
              checkboxSelection
              onRowClick={weightHandleSelectRow}
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
      </Box>
      <RecyclingFormat
        drawerOpen={recycDrawerOpen}
        handleDrawerClose={() => setRecycDrawerOpen(false)}
        action={action}
        onSubmitData={handleOnSubmitData}
        recyclableType={recyclableType}
        selectedItem={selectedRecyclingRow}
      />
      <WeightFormat
        drawerOpen={weightDrawerOpen}
        handleDrawerClose={() => setWeightDrawerOpen(false)}
        action={action}
        onSubmitData={handleOnSubmitData}
        rowId={rowId}
        selectedItem={selectedRow}
      />
    </>
  )
}

export default RecyclingUnit

const CustomDataGrid = ({ data, customGridHandleAction }: { data: any; customGridHandleAction: (value: any, action: string) => void; }) => {
  const columns = [
    { key: 'traditionalName', label: t('common.traditionalChineseName'), width: '15%' },
    { key: 'chineseName', label: t('common.simplifiedChineseName'), width: '15%' },
    { key: 'englishName', label: t('common.englishName'), width: '15%' },
    { key: 'description', label: t('common.description'), width: '10%' },
    { key: 'remark', label: t('common.remark'), width: '5%' },
    { key: 'edit', label: '', width: '5%' },
    { key: 'delete', label: '', width: '5%' },
    { key: 'toggle', label: '', width: '5%' },
  ]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
      }}>
        <input type='checkbox' />
        {columns.map(column => (
          <div key={column.key} style={{
            flex: `0 0 ${column.width}`,
            padding: '8px',
            fontSize: 13
          }}>
            {column.label}
          </div>
        ))}
      </div>
      <div style={{
        flex: 1,
        overflowY: 'auto'
      }}>
        {data.map((item: any, index: any) => (
          <div style={{ backgroundColor: '#fff', marginBottom: 15, borderRadius: 8 }}>
            <div key={index} style={{
              display: 'flex',
              borderBottom: '1px solid #ccc',
              paddingBottom: 5,
              paddingTop: 5,
            }}>
              <input type='checkbox' />
              <div style={{ flex: `0 0 15%`, padding: '8px', fontSize: 16 }}>{item.recyclableNameTchi}</div>
              <div style={{ flex: `0 0 15%`, padding: '8px', fontSize: 16 }}>{item.recyclableNameSchi}</div>
              <div style={{ flex: `0 0 15%`, padding: '8px', fontSize: 16 }}>{item.recyclableNameEng}</div>
              <div style={{ flex: `0 0 10%`, padding: '8px', fontSize: 16 }}>{item.description}</div>
              <div style={{ flex: `0 0 5%`, padding: '8px', fontSize: 16 }}>{item.remark}</div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div style={{ display: 'flex' }}>
                  <EDIT_OUTLINED_ICON
                    fontSize="small"
                    className="cursor-pointer text-grey-dark mr-5"
                    onClick={() => customGridHandleAction(item, 'edit')}
                  />
                </div>
                <div style={{ display: 'flex' }}>
                  <DELETE_OUTLINED_ICON
                    fontSize="small"
                    className="cursor-pointer text-grey-dark mr-2"
                    onClick={(event) => console.log('hitt')}
                  />
                </div>
                <div style={{ display: 'flex' }}>
                  <Switch checked={false} onChange={() => console.log('hit')} />
                </div>
              </div>
            </div>
            {item.recycSubType.length > 0 && item.recycSubType.map((value: any, index: any) => (
              <div key={index} style={{
                display: 'flex',
                borderBottom: '1px solid #ccc',
                backgroundColor: '#fff',
                paddingBottom: 5,
                paddingTop: 5,
                marginLeft: 20,
                alignItems: 'center'
              }}>
                <input type='checkbox' />
                <div style={{ flex: `0 0 15%`, padding: '8px', fontSize: 16 }}>{value.recyclableNameTchi}</div>
                <div style={{ flex: `0 0 15%`, padding: '8px', fontSize: 16 }}>{value.recyclableNameSchi}</div>
                <div style={{ flex: `0 0 15%`, padding: '8px', fontSize: 16 }}>{value.recyclableNameEng}</div>
                <div style={{ flex: `0 0 10%`, padding: '8px', fontSize: 16 }}>{value.description}</div>
                <div style={{ flex: `0 0 5%`, padding: '8px', fontSize: 16 }}>{value.remark}</div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: -10 }}>
                  <div style={{ display: 'flex' }}>
                    <EDIT_OUTLINED_ICON
                      fontSize="small"
                      className="cursor-pointer text-grey-dark mr-5"
                      onClick={() => customGridHandleAction(value, 'edit')}
                    />
                  </div>
                  <div style={{ display: 'flex' }}>
                    <DELETE_OUTLINED_ICON
                      fontSize="small"
                      className="cursor-pointer text-grey-dark mr-2"
                      onClick={(event) => console.log('hitt')}
                    />
                  </div>
                  <div style={{ display: 'flex' }}>
                    <Switch checked={false} onChange={() => console.log('hit')} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};