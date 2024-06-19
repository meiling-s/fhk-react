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
import { extractError, returnApiToken } from '../../../utils/utils'
import { getTenantById } from '../../../APICalls/tenantManage'
import StatusLabel from '../../../components/StatusLabel'
import { GET_ALL_RECYCLE_TYPE, GET_RECYC_TYPE } from '../../../constants/requests'
import { useContainer } from 'unstated-next'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import axiosInstance from '../../../constants/axiosInstance'
import { AXIOS_DEFAULT_CONFIGS } from '../../../constants/configs'
import { t } from 'i18next'
import { getEngineData, getSiteTypeData } from '../../../APICalls/ASTD/recycling'
import CreateRecyclingPoint from './CreateRecyclingPoint'
import CreateEngineData from './CreateEngineData'
import { useNavigate } from 'react-router-dom'
import { STATUS_CODE } from '../../../constants/constant'
import useLocaleTextDataGrid from '../../../hooks/useLocaleTextDataGrid'

interface siteTypeDataProps {
    createdAt: string
    createdBy: string
    description: string
    remark: string
    siteTypeId: string
    siteTypeNameEng: string
    siteTypeNameSchi: string
    siteTypeNameTchi: string
    status: string
    updatedAt: string
    updatedBy: string
}

interface engineDataProps {
    createdAt: string
    createdBy: string
    premiseTypeId: string
    premiseTypeNameEng: string
    premiseTypeNameSchi: string
    premiseTypeNameTchi: string
    registeredFlg: boolean
    remark: string
    residentalFlg: boolean
    serviceType: string
    status: string
    updatedAt: string
    updatedBy: string
}

const RecyclingPoint: FunctionComponent = () => {
  const { t, i18n } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<siteTypeDataProps | null>(null)
  const [engineSelectedRow, setEngineSelectedRow] = useState<engineDataProps | null>(null)
  const [siteTypeData, setSiteTypeData] = useState<siteTypeDataProps[]>([])
  const [engineData, setEngineData] = useState<engineDataProps[]>([])
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const [engineDrawerOpen, setEngineDrawerOpen] = useState<boolean>(false)
  const  navigate = useNavigate();
  const { localeTextDataGrid } = useLocaleTextDataGrid()
  useEffect(() => {
    initSiteTypeData()
    initEngineData()
  }, [page])

  const initSiteTypeData = async () => {
    try {
      const result = await getSiteTypeData()
      const data = result?.data

      setSiteTypeData(data)
    } catch (error:any) {
      const {state, realm} =  extractError(error);
      if(state.code === STATUS_CODE[503] ){
        navigate('/maintenance')
      }
    }
  }

  const initEngineData = async () => {
   try {
    const result = await getEngineData()
    const data = result?.data

    setEngineData(data)
   } catch (error:any) {
    const {state, realm} =  extractError(error);
    if(state.code === STATUS_CODE[503] ){
      navigate('/maintenance')
    }
   }
  }

  const columns: GridColDef[] = [
    {
      field: 'siteTypeNameTchi',
      headerName: t('packaging_unit.traditional_chinese_name'),
      width: 200,
      type: 'string',
    },
    {
      field: 'siteTypeNameSchi',
      headerName: t('packaging_unit.simplified_chinese_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'siteTypeNameEng',
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
      headerName: t('notification.menu_staff.edit'),
      filterable: false,
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <EDIT_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark mr-2"
              onClick={(event) => {
                event.stopPropagation()
                handleAction(params, 'edit', 'recycle')
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
                handleAction(params, 'delete', 'recycle')
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
        )
      }
    }
  ]
  const engineColumns: GridColDef[] = [
    {
      field: 'premiseTypeNameTchi',
      headerName: t('packaging_unit.traditional_chinese_name'),
      width: 200,
      type: 'string',
    },
    {
      field: 'premiseTypeNameSchi',
      headerName: t('packaging_unit.simplified_chinese_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'premiseTypeNameEng',
      headerName: t('packaging_unit.english_name'),
      width: 200,
      type: 'string'
    },
    {
      field: 'residentalFlg',
      headerName: t('recycling_point.residence'),
      width: 170,
      type: 'string'
    },
    {
      field: 'registeredFlg',
      headerName: t('recycling_point.epd'),
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
      headerName: t('notification.menu_staff.edit'),
      filterable: false,
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <EDIT_OUTLINED_ICON
              fontSize="small"
              className="cursor-pointer text-grey-dark mr-2"
              onClick={(event) => {
                event.stopPropagation()
                handleAction(params, 'edit', 'engine')
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
                handleAction(params, 'delete', 'engine')
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
    value: 'recycle' | 'engine'
  ) => {
    setAction(action)
    setRowId(params.row.id)
    if (value === 'recycle') {
      setSelectedRow(params.row)
      setDrawerOpen(true)
    } else {
      setEngineSelectedRow(params.row)
      setEngineDrawerOpen(true)
    }
  }

  const handleSelectRow = (params: GridRowParams) => {
    setAction('edit')
    setRowId(params.row.id)
    setSelectedRow(params.row)
    setDrawerOpen(true)
  }

  const handleEngineSelectRow = (params: GridRowParams) => {
    setAction('edit')
    setRowId(params.row.id)
    setEngineSelectedRow(params.row)
    setEngineDrawerOpen(true)
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

  const handleOnSubmitData = (type: string) => {
    if (type === 'siteType') {
      setDrawerOpen(false)
      initSiteTypeData()
    } else if (type === 'premiseType') {
      setEngineDrawerOpen(false)
      initEngineData()
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
            {t(`recycling_point.engineering_land`)}
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
            onClick={() => {setDrawerOpen(true); setAction('add')}}
          >
            <ADD_ICON /> {t("top_menu.add_new")}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
            <DataGrid
              rows={siteTypeData}
              getRowId={(row) => row.siteTypeId}
              hideFooter
              columns={columns}
              checkboxSelection
              onRowClick={handleSelectRow}
              getRowSpacing={getRowSpacing}
              localeText={localeTextDataGrid}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginY: 4,
          }}
        >
          <Typography fontSize={16} color="black" fontWeight="bold">
            {t(`recycling_point.house_or_place`)}
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
            onClick={() => {setEngineDrawerOpen(true); setAction('add')}}
          >
            <ADD_ICON /> {t("top_menu.add_new")}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
            <DataGrid
              rows={engineData}
              getRowId={(row) => row.premiseTypeId}
              hideFooter
              columns={engineColumns}
              checkboxSelection
              onRowClick={handleEngineSelectRow}
              getRowSpacing={getRowSpacing}
              localeText={localeTextDataGrid}
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
        <CreateRecyclingPoint
            drawerOpen={drawerOpen}
            handleDrawerClose={() => setDrawerOpen(false)}
            action={action}
            rowId={rowId}
            selectedItem={selectedRow}
            handleOnSubmitData={handleOnSubmitData}
            
        />
        <CreateEngineData
            drawerOpen={engineDrawerOpen}
            handleDrawerClose={() => setEngineDrawerOpen(false)}
            action={action}
            rowId={rowId}
            selectedItem={engineSelectedRow}
            handleOnSubmitData={handleOnSubmitData}
        />
      </Box>
    </>
  )
}

export default RecyclingPoint