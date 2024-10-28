import { useEffect, useState, FunctionComponent, useCallback } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Typography,
  Pagination,
  CircularProgress
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
} from '../../../../themes/icons'
import CircularLoading from '../../../../components/CircularLoading'
import { styles } from '../../../../constants/styles'
import CreateVehicles from './CreateVehicles'
import {
  LogisticVehicle as VehicleItem,
  CreateVehicle as VehiclesForm
} from '../../../../interfaces/vehicles'
import {
  getAllVehicles,
  getVehicleImages,
  searchVehicle
} from '../../../../APICalls/Logistic/vehicles'
import { ToastContainer, toast } from 'react-toastify'

import { useTranslation } from 'react-i18next'
import SearchBox from '../../../../components/SearchBox'
import CustomSearchField from '../../../../components/TableComponents/CustomSearchField'
import CommonTypeContainer from '../../../../contexts/CommonTypeContainer'
import i18n from '../../../../setups/i18n'
import { useContainer } from 'unstated-next'
import useLocaleTextDataGrid from '../../../../hooks/useLocaleTextDataGrid'
import { localStorgeKeyName } from '../../../../constants/constant'

type TableRow = {
  id: number
  [key: string]: any
}

function createVehicles(
  vehicleId: number,
  vehicleTypeId: string,
  plateNo: string,
  photo: string[],
  status: string,
  netWeight: number,
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string,
  version: number
): VehicleItem {
  return {
    vehicleId,
    vehicleTypeId,
    plateNo,
    netWeight,
    photo,
    status,
    createdBy,
    updatedBy,
    createdAt,
    updatedAt,
    version,
  }
}

const Vehicles: FunctionComponent = () => {
  const { t } = useTranslation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [vehicleList, setVehicleList] = useState<VehicleItem[]>([])
  const { vehicleType } = useContainer(CommonTypeContainer)
  const [selectedRow, setSelectedRow] = useState<VehicleItem | null>(null)
  const [action, setAction] = useState<'add' | 'edit' | 'delete'>('add')
  const [rowId, setRowId] = useState<number>(1)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [totalData, setTotalData] = useState<number>(0)
  const [plateList, setPlateList] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [isSearching, setSearching] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { localeTextDataGrid } = useLocaleTextDataGrid()

  useEffect(() => {
    initVehicleList()
    //initAllVehicleList()
  }, [page])

  const initVehicleList = useCallback(async () => {
    setIsLoading(true)
    setVehicleList([])
    const result = await getAllVehicles(page - 1, pageSize)
    const data = result?.data
    const newPlateList: string[] = []
    const table = localStorage.getItem(localStorgeKeyName.decodeKeycloack) || ''
  
    if (data) {
      const vehicleMapping: VehicleItem[] = await Promise.all(
        data.content.map(async (item: any) => {
          const result = await getVehicleImages(table, item.vehicleId)
          const vehicleImages = result?.data
          
          if (result) {
            const vehicle = createVehicles(
              item?.vehicleId,
              item?.vehicleTypeId,
              item?.plateNo,
              vehicleImages.photo,
              item?.status,
              item?.netWeight,
              item?.createdBy,
              item?.updatedBy,
              item?.createdAt,
              item?.updatedAt,
              item?.version,
            )
            newPlateList.push(item?.plateNo)
            return vehicle
          }
          return null
        }).filter(Boolean)
      )
      setVehicleList(vehicleMapping)
      //setIsLoading(false)

      setTimeout(() => {
        setVehicleList(vehicleMapping);
        setIsLoading(false);
      }, 1000); // Adjust the delay as necessary (100ms here)
    }
    setTotalData(data.totalPages)
   
  }, [page, pageSize])

  // const initAllVehicleList = useCallback(async () => {
  //   setIsLoading(true)
  //   const result = await getAllVehicles(0, 1000)
  //   const data = result?.data
  //   const newPlateList: string[] = []
  //   if (data) {
  //     var vehicleMapping: VehicleItem[] = []
  //     data.content.map((item: any) => {
  //       vehicleMapping.push(
  //         createVehicles(
  //           item?.vehicleId,
  //           item?.vehicleTypeId,
  //           item?.plateNo,
  //           item?.photo,
  //           item?.status,
  //           item?.netWeight,
  //           item?.createdBy,
  //           item?.updatedBy,
  //           item?.createdAt,
  //           item?.updatedAt,
  //           item?.version
  //         )
  //       )

  //       //mappping plate list
  //       newPlateList.push(item?.plateNo)
  //     })
  //     // setVehicleList(vehicleMapping)
  //     setPlateList(newPlateList)
  //   }
  //   setIsLoading(false)
  // }, [])

  const columns: GridColDef[] = [
    {
      field: 'vehicleId',
      headerName: t('driver.vehicleMenu.vehicle_number'),
      width: 200,
      type: 'string'
    },
    {
      field: 'plateNo',
      headerName: t('driver.vehicleMenu.license_plate_number'),
      width: 200,
      type: 'string'
    },
    {
      field: 'vehicleTypeId',
      headerName: t('driver.vehicleMenu.vehicle_type'),
      width: 200,
      type: 'string',
      renderCell: (params) => {
        var vehicleName = ''
        if (vehicleType) {
          const selectedVehicle = vehicleType.find(
            (item: any) => item.vehicleTypeId == params.row.vehicleTypeId
          )

          if (selectedVehicle) {
            switch (i18n.language) {
              case 'enus':
                vehicleName = selectedVehicle.vehicleTypeNameEng
                break
              case 'zhch':
                vehicleName = selectedVehicle.vehicleTypeNameSchi
                break
              case 'zhhk':
                vehicleName = selectedVehicle.vehicleTypeNameTchi
                break
              default:
                vehicleName = selectedVehicle.vehicleTypeNameTchi
                break
            }
          }
        }

        return <div>{vehicleName}</div>
      }
    },
    {
      field: 'netWeight',
      headerName: t('driver.vehicleMenu.vehicle_cargo_capacity'),
      width: 200,
      type: 'string',
      renderCell: (params) => {
        return <div>{`${params.row.netWeight} kg`}</div>
      }
    },
    {
      field: 'photo',
      headerName: t('vehicle.picture'),
      width: 300,
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            {params.row.photo.map((item: string, index: number) => {
              const format = item.startsWith('data:image/png') ? 'png' : 'jpeg'
              const imgdata = `data:image/${format};base64,${item}`
              return (
                <img
                  key={item + index}
                  className="w-[30px] h-[30px]"
                  src={imgdata}
                  alt=""
                     style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              )
            })}
          </div>
        )
      }
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
    initVehicleList()
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

  const handleSearch = async (value: string) => {
    if (value) {
      setIsLoading(true)
      setVehicleList([])
      const result = await searchVehicle(value)
      const data = result?.data
      if (data) {
        var vehicleMapping: VehicleItem[] = []
        vehicleMapping.push(data)
        setPage(1)
        setTotalData(vehicleMapping.length)
        setVehicleList(vehicleMapping)
        setSearching(true)
      }
      setIsLoading(false)
    }
  }

  const handleChange = async (keyName: string, value: string) => {
    handleSearch(value)
    if (value.length == 0) {
      //setSearching(false)
      setVehicleList([])
      initVehicleList()
    }
  }

  return (
    <>
      <Box
        sx={{
          width: '1200px',
          maxWidth: '100%',
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
            <ADD_ICON /> {t('top_menu.add_new_vehicle')}
          </Button>
        </Box>
        <CustomSearchField
          label={t('driver.vehicleMenu.vehicle_number')}
          width={'100%'}
          field={'searchValue'}
          placeholder={t('driver.vehicleMenu.vehicle_number')}
          onChange={handleChange}
        />
        <div className="table-vehicle">
          <Box pr={4} sx={{ flexGrow: 1, width: '100%' }}>
            {isLoading ? (
              <CircularLoading />
            ) : (
              <Box>
                <DataGrid
                  rows={vehicleList}
                  getRowId={(row) => row.vehicleId}
                  hideFooter
                  columns={columns}
                  loading={isLoading}
                  onRowClick={handleSelectRow}
                  getRowSpacing={getRowSpacing}
                  localeText={localeTextDataGrid}
                  getRowClassName={(params) =>
                    selectedRow && params.id === selectedRow.vehicleId
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
                    },
                    '& .MuiDataGrid-overlayWrapper ':{
                      height: '30px'
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
        {rowId != 0 && (
          <CreateVehicles
            drawerOpen={drawerOpen}
            handleDrawerClose={() => {
              setDrawerOpen(false)
              setSelectedRow(null)
            }}
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

export default Vehicles
