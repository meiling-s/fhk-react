import React, { useEffect, useState, FunctionComponent, useCallback } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Typography,
  Pagination,
  Container,
  IconButton,
  Switch,
  Modal,
  Stack,
  Divider,
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
import { deleteRecyc, deleteSubRecyc, getAllPackagingUnit, getRecycCode, getWeightUnit } from '../../../APICalls/ASTD/recycling'
import WeightFormat from './WeightFormat'
import PackagingFormat from './PackagingFormat'
import CodeFormat from './CodeFormat'
import { localStorgeKeyName } from '../../../constants/constant'
import CustomButton from '../../../components/FormComponents/CustomButton'

interface CodeFormatProps {
  createdAt: string
  createdBy: string
  description: string
  recycCodeId: number
  recycCodeName: string
  recycSubTypeId: string
  recycTypeId: string
  remark: string
  status: string
  updatedAt: string
  updatedBy: string
}

interface PackagingUnitProps {
  createdAt: string
  createdBy: string
  description: string
  packagingNameEng: string
  packagingNameSchi: string
  packagingNameTchi: string
  packagingTypeId: string
  remark: string
  status: string
  tenantId: string
  updatedAt: string
  updatedBy: string
}

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
  description: string
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
  recycSubTypeId: string
}

type DeleteForm = {
  open: boolean
  onClose: () => void
  onRejected?: () => void
  handleConfirmDelete: () => void
}

type updateStatus = {
  status: string
  updatedBy: string
}

const RecyclingUnit: FunctionComponent = () => {
  const { t, i18n } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<WeightFormatProps | null>(null)
  const [selectedRecyclingRow, setSelectedRecyclingRow] = useState<recyleTypeData | null>(null)
  const [selectedPackagingRow, setSelectedPackagingRow] = useState<PackagingUnitProps | null>(null)
  const [selectedCodeRow, setSelectedCodeRow] = useState<CodeFormatProps | null>(null)
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const [recyclableType, setRecyclableType] = useState([])
  const [packagingUnit, setPackagingUnit] = useState<PackagingUnitProps[]>([])
  const [weightUnit, setWeightUnit] = useState([])
  const [code, setCode] = useState<CodeFormatProps[]>([])
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const [recycDrawerOpen, setRecycDrawerOpen] = useState<boolean>(false)
  const [packagingDrawerOpen, setPackagingDrawerOpen] = useState<boolean>(false)
  const [weightDrawerOpen, setWeightDrawerOpen] = useState<boolean>(false)
  const [codeDrawerOpen, setCodeDrawerOpen] = useState<boolean>(false)
  const [isMainCategory, setMainCategory] = useState<boolean>(false)
  const [delFormModal, setDeleteModal] = useState<boolean>(false)
  const [switchValue, setSwitchValue] = useState<any>(null)

  useEffect(() => {
    initRecycTypeList()
    initRecycCode()
    initPackagingUnit()
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
    const result = await getRecycCode(page - 1, pageSize)
    const data = result?.data


    setCode(data)
  }

  const initPackagingUnit = async () => {
    const result = await getAllPackagingUnit(page - 1, pageSize)
    const data = result?.data.content

    setPackagingUnit(data)
  }

  const initWeightUnit = async () => {
    const result = await getWeightUnit(page - 1, pageSize)
    const data = result?.data

    setWeightUnit(data)
  }

  const codeColumns: GridColDef[] = [
    {
      field: 'recycCodeName',
      headerName: t('recycling_unit.recyclable_code'),
      width: 200,
      type: 'string',
    },
    {
      field: 'recycTypeId',
      headerName: t('recycling_unit.main_category'),
      width: 200,
      type: 'string',
    },
    {
      field: 'recycSubTypeId',
      headerName: t('recycling_unit.sub_category'),
      width: 200,
      type: 'string',
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
                handleAction(params, 'edit', 'code')
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
                handleAction(params, 'delete', 'code')
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
        )
      }
    }
  ]

  const columns: GridColDef[] = [
    {
      field: 'packagingNameTchi',
      headerName: t('packaging_unit.traditional_chinese_name'),
      width: 200,
      type: 'string',
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
    if (value === 'weight') {
      setSelectedRow(params.row)
      setWeightDrawerOpen(true)
    } else if (value === 'packaging') {
      setSelectedPackagingRow(params.row)
      setPackagingDrawerOpen(true)
    } else if (value === 'code') {
      setSelectedCodeRow(params.row)
      setCodeDrawerOpen(true)
    }
  }

  const handleSelectRow = (params: GridRowParams) => {
    setAction('edit')
    setRowId(params.row.id)
    setSelectedRow(params.row)
    setDrawerOpen(true)
  }

  const codeHandleSelectRow = (params: GridRowParams) => {
    setAction('edit')
    setRowId(params.row.id)
    setSelectedCodeRow(params.row)
    setCodeDrawerOpen(true)
  }

  const packagingHandleSelectRow = (params: GridRowParams) => {
    setAction('edit')
    setRowId(params.row.id)
    setSelectedPackagingRow(params.row)
    setPackagingDrawerOpen(true)
  }

  const weightHandleSelectRow = (params: GridRowParams) => {
    setAction('edit')
    setRowId(params.row.id)
    setSelectedRow(params.row)
    setWeightDrawerOpen(true)
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

  const customGridHandleAction = (value: any, action: any, type: string) => {
    setRecycDrawerOpen(true)
    setAction(action)
    setSelectedRecyclingRow(value)
    setMainCategory(type === 'mainCategory' ? true : false)
  }

  const handleOnSubmitData = (type: string) => {
    if (type === 'weight') {
      setWeightDrawerOpen(false)
      initWeightUnit()
    } else if (type === 'packaging') {
      setPackagingDrawerOpen(false)
      initPackagingUnit()
    } else if (type === 'recycle') {
      setRecycDrawerOpen(false)
      initRecycTypeList()
    } else if (type === 'code') {
      setCodeDrawerOpen(false)
      initRecycCode()
    }
  }

  const handleClickSwitch = async (value: any, type: string) => {
    const token = returnApiToken()
    
    
    const recyclingForm = {
      status: 'INACTIVE',
      updatedBy: token.loginId
    }
    if (type === 'main') {
      setSwitchValue(value)
      setDeleteModal(true)
    } else if (type === 'sub') {
      setSwitchValue(null)
      const response = await deleteSubRecyc(recyclingForm, value.recycSubTypeId)
      if (response) {
        showSuccessToast(t('notify.successDeleted'))
        handleOnSubmitData('recycle')
      }
    }
  }

  const handleConfirmDelete = async () => {
    const token = returnApiToken()
    const recycId = selectedRecyclingRow && selectedRecyclingRow.recycTypeId
    const recyclingForm = {
      status: 'INACTIVE',
      updatedBy: token.loginId
    }
    if (switchValue !== null) {
      try {
        const response = await deleteRecyc(recyclingForm, switchValue.recycTypeId)
        if (response) {
          showSuccessToast(t('notify.successDeleted'))
          handleOnSubmitData('recycle')
          setSwitchValue(null)
        }
      } catch (error) {
        showErrorToast(t('notify.errorDeleted'))
      }
    } else if (recycId !== null) {
      try {
        const response = await deleteRecyc(recyclingForm, recycId)
        if (response) {
          showSuccessToast(t('notify.successDeleted'))
          handleOnSubmitData('recycle')
          setDeleteModal(false)
        }
      } catch (error) {
        console.error(error)
        showErrorToast(t('notify.errorDeleted'))
      }
    }
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
            onClick={() => { setRecycDrawerOpen(true); setAction('add') }}
          >
            <ADD_ICON /> {t("top_menu.add_new")}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
            <CustomDataGrid data={recyclableType} customGridHandleAction={customGridHandleAction} handleClickSwitch={handleClickSwitch}/>
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
            onClick={() => { setCodeDrawerOpen(true); setAction('add') }}
          >
            <ADD_ICON /> {t("top_menu.add_new")}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
            <DataGrid
              rows={code}
              getRowId={(row) => row.recycCodeId}
              hideFooter
              columns={codeColumns}
              checkboxSelection
              onRowClick={codeHandleSelectRow}
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
              onClick={() => { setPackagingDrawerOpen(true); setAction('add') }}
            >
              <ADD_ICON /> {t("top_menu.add_new")}
            </Button>
          </Box>
        </div>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: "100%" }}>
            <DataGrid
              rows={packagingUnit}
              getRowId={(row) => row.packagingTypeId}
              hideFooter
              columns={columns}
              checkboxSelection
              onRowClick={packagingHandleSelectRow}
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
              onClick={() => { setWeightDrawerOpen(true); setAction('add') }}
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
        mainCategory={isMainCategory}
        setDeleteModal={setDeleteModal}
      />
      <CodeFormat
        drawerOpen={codeDrawerOpen}
        handleDrawerClose={() => setCodeDrawerOpen(false)}
        action={action}
        onSubmitData={handleOnSubmitData}
        selectedItem={selectedCodeRow}
      />
      <PackagingFormat
        drawerOpen={packagingDrawerOpen}
        handleDrawerClose={() => setPackagingDrawerOpen(false)}
        action={action}
        onSubmitData={handleOnSubmitData}
        selectedItem={selectedPackagingRow}
      />
      <WeightFormat
        drawerOpen={weightDrawerOpen}
        handleDrawerClose={() => setWeightDrawerOpen(false)}
        action={action}
        onSubmitData={handleOnSubmitData}
        rowId={rowId}
        selectedItem={selectedRow}
      />
      <DeleteModal
        open={delFormModal}
        onClose={() => {
          setDeleteModal(false)
        }}
        onRejected={() => {
          setDeleteModal(false)
          showSuccessToast(t('pick_up_order.rejected_success'))
        }}
        handleConfirmDelete={handleConfirmDelete}
      />
    </>
  )
}

export default RecyclingUnit

const CustomDataGrid = ({ data, customGridHandleAction, handleClickSwitch }: { data: any; customGridHandleAction: (value: any, action: string, type: string) => void; handleClickSwitch: (value: any, type: string) => void}) => {
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
                    onClick={() => customGridHandleAction(item, 'edit', 'mainCategory')}
                  />
                </div>
                <div style={{ display: 'flex' }}>
                  <DELETE_OUTLINED_ICON
                    fontSize="small"
                    className="cursor-pointer text-grey-dark mr-2"
                    onClick={() => handleClickSwitch(item, 'main')}
                  />
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
                      onClick={() => customGridHandleAction(value, 'edit', 'subCategory')}
                    />
                  </div>
                  <div style={{ display: 'flex' }}>
                    <DELETE_OUTLINED_ICON
                      fontSize="small"
                      className="cursor-pointer text-grey-dark mr-2"
                      onClick={() =>  handleClickSwitch(value, 'sub')}
                    />
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

const DeleteModal: React.FC<DeleteForm> = ({
  open,
  onClose,
  onRejected,
  handleConfirmDelete
}) => {
  const { t } = useTranslation()

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold' }}
            >
              {t('recycling_unit.confirm_delete')}
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography sx={localstyles.typo}>
              {t('recycling_unit.confirm_text')}
            </Typography>
          </Box>

          <Box sx={{ alignSelf: 'center' }}>
            <CustomButton text={t('check_in.confirm')} color="blue" style={{width: '175px', marginRight: '10px'}} onClick={
              () => {
                handleConfirmDelete()
                onClose()
              }
            } />
            <CustomButton text={t('check_in.cancel')} color="blue" outlined style={{width: '175px'}} onClick={
              () => {
                onClose()
              }
            } />
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

let localstyles = {
  typo: {
    color: 'grey',
    fontSize: 14
  },
  modal: {
    position: 'absolute',
    top: '50%',
    width: '34%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    height: 'fit-content',
    padding: 4,
    backgroundColor: 'white',
    border: 'none',
    borderRadius: 5,

    '@media (max-width: 768px)': {
      width: '70%' /* Adjust the width for mobile devices */
    }
  }
}