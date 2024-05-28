import { useEffect, useState, FunctionComponent, useCallback } from 'react'
import { Box, Button, Checkbox, Typography, Pagination } from '@mui/material'
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

import { styles } from '../../../constants/styles'
import CreateVehicle from './CreateVehicle'
import { Vehicle as VehicleItem, CreateVehicle as VehiclesForm } from '../../../interfaces/vehicles'
import { getAllVehicles } from '../../../APICalls/Collector/vehicles'
import { ToastContainer, toast } from 'react-toastify'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { extractError } from '../../../utils/utils'
import { STATUS_CODE } from '../../../constants/constant'

type TableRow = {
  id: number
  [key: string]: any
}

function createVehicles(
  id: number,
  vehicleId: number,
  vehicleTypeId: string,
  vehicleName: string,
  plateNo: string,
  serviceType: string,
  photo: string[],
  status: string,
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string,
): VehicleItem {
  return { id, vehicleId, vehicleTypeId, vehicleName, plateNo, serviceType, photo, status, createdBy, updatedBy,createdAt, updatedAt  }
}


const Vehicle: FunctionComponent = () => {
  const { t } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [vehicleList, setVehicleList] = useState<VehicleItem[]>([])
  const [selectedRow, setSelectedRow] = useState<VehicleItem | null>(null)
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const [plateList, setPlateList] = useState<string[]>([])
  const navigate = useNavigate();

  useEffect(() => {
    initVehicleList()
  }, [page])

  const initVehicleList = async () => {
   try {
    const result = await getAllVehicles(page - 1, pageSize)
    const data = result?.data
    // console.log("initVehicleList", data)
    if(data) {
      var vehicleMapping: VehicleItem[] = []
      data.content.map((item: any) => {
        vehicleMapping.push(
          createVehicles(
            item?.vehicleId,
            item?.vehicleId,
            item?.vehicleTypeId,
            item?.vehicleName,
            item?.plateNo,
            item?.serviceType,
            item?.photo,
            item?.status,
            item?.createdBy,
            item?.updatedBy,
            item?.createdAt,
            item?.updatedAt
          )
        )

        //mappping plate list
        plateList.push(item?.plateNo)
      })
      setVehicleList(vehicleMapping)
      setTotalData(data.totalPages)
    }
   } catch (error:any) {
    const {state, realm} =  extractError(error);
    if(state.code === STATUS_CODE[503] || !error?.response){
      navigate('/maintenance')
    }
   }
  }

  const columns: GridColDef[] = [
    {
      field: 'serviceType',
      headerName: t('vehicle.serviceType'),
      width: 200,
      type: 'string',
      renderCell: (params) => {
        return (
          <div>{t(`vehicle.${params.row.serviceType.toLowerCase()}`)}</div>
        )
      }
    },
    {
      field: 'vehicleName',
      headerName: t('vehicle.vehicleType'),
      width: 200,
      type: 'string'
    },
    {
      field: 'plateNo',
      headerName: t('vehicle.licensePlate'),
      width: 200,
      type: 'string'
    },
    {
      field: 'photo',
      headerName: t('vehicle.picture'),
      width: 300,
      renderCell: (params) => {

        return (
          <div style={{ display: 'flex', gap: '8px' }}>{
            params.row.photo.map((item: string) =>{
              const format = item.startsWith("data:image/png") ? 'png' : 'jpeg'
              const imgdata = `data:image/${format};base64,${item}`
              return (
                <img key={item} className='w-[30px] h-[30px]' src={imgdata} alt="" />
              )
            }
            )
          }
          </div>
        )
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
              onClick={(event) => {event.stopPropagation();  handleAction(params, 'edit')}}
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
              onClick={(event) => {event.stopPropagation(); handleAction(params, 'delete')}}
              style={{ cursor: 'pointer' }}
            />
          </div>
        )
      }
    }
  ]

  const handleAction = (params: GridRenderCellParams, action: 'add' | 'edit' | 'delete') => {
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

  const onSubmitData = (type: string, msg: string) =>{
    initVehicleList()
    if(type == 'success') {
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
            {t('vehicle.vehicle')}
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
            onClick={() => {setDrawerOpen(true); setAction('add')}}
          >
            <ADD_ICON /> {t('top_menu.add_new')}
          </Button>
        </Box>
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: '100%' }}>
            <DataGrid
              rows={vehicleList}
              getRowId={(row) => row.vehicleId}
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
              className='mt-4'
              count={Math.ceil(totalData)}
              page={page}
              onChange={(_, newPage) => {
                setPage(newPage)
              }}
            />
          </Box>
        </div>
        {rowId != 0 && (
          <CreateVehicle
            drawerOpen={drawerOpen}
            handleDrawerClose={() => setDrawerOpen(false)}
            action={action}
            rowId={rowId}
            selectedItem={selectedRow}
            onSubmitData={onSubmitData}
            plateListExist={plateList}
          />
        )}
      </Box>
    </>
  )
}

export default Vehicle
