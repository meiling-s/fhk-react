import { FunctionComponent, useCallback, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  FormControl,
  Select,
  MenuItem
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridRowSpacingParams
} from '@mui/x-data-grid'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ProgressLine from '../../../components/ProgressLine'

import {
  getCapacityWarehouse,
  getCapacityWarehouseSubtype,
  getCheckOutWarehouse,
  getCheckInOutWarehouse
} from '../../../APICalls/warehouseDashboard'
import { getAllWarehouse } from '../../../APICalls/warehouseManage'

import { useTranslation } from 'react-i18next'

const WarehouseDashboard: FunctionComponent = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [capacity, setCapacity] = useState<number>(500)
  const [totalCapacity, setTotalCapacity] = useState<number>(1000)
  const subTypeItem = [{ name: 'aas' }, { name: 'cddd' }, { name: 'ffd' }]
  const [selectedWarehouse, setSelectedWarehouse] = useState<{
    id: number
    name: string
  }>({ id: 0, name: 'Warehouse 1' })
  const [checkInOut, setCheckInOut] = useState([
    {
      id: '0',
      createdAt: '2023/09/18 18:00',
      status: 'CREATED',
      shippingCompany: 'aaaaa',
      receiver: 'ASTD',
      pico: 'PO12345678',
      adjustmentFlg: true,
      logisticComp: 'BBBB',
      deliverLoc: 'Hongkong , Penang oat 90',
      receiverAddr: 'Kwon siam road'
    }
  ])

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: t('check_out.created_at'),
      width: 150,
      type: 'string',
      renderCell: (params) => {
        // const dateFormatted = dayjs(new Date(params.row.createdAt)).format(
        //   format.dateFormat1
        // )
        return <div>{'dateFormatted'}</div>
      }
    },
    {
      field: 'status',
      headerName: t('col.status'),
      width: 75,
      type: 'string'
    },
    {
      field: 'shippingCompany',
      headerName: t('check_out.shipping_company'),
      width: 100,
      type: 'string'
    },
    {
      field: 'receiver',
      headerName: t('check_in.receiver_company'),
      width: 100,
      type: 'string'
    },
    {
      field: 'pico',
      headerName: t('check_out.pickup_order_no'),
      width: 150,
      type: 'string'
    },
    {
      field: 'adjustmentFlg',
      headerName: t('check_out.stock_adjustment'),
      width: 100,
      type: 'string',
      renderCell: (params) => {
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            {params.row.adjustmentFlg ? (
              <CheckIcon className="text-green-primary" />
            ) : (
              <CloseIcon className="text-red" />
            )}
          </div>
        )
      }
    },
    {
      field: 'deliverLoc',
      headerName: t('inventory.inventoryLocation'),
      width: 125,
      type: 'string'
    },
    {
      field: 'logisticName',
      headerName: t('check_out.logistic_company'),
      width: 125,
      type: 'string'
    },
    {
      field: 'receiverAddr',
      headerName: t('check_out.arrival_location'),
      width: 125,
      type: 'string'
    }
  ]

  const onChangeWarehouse = () => {}

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  return (
    <Box className="container-wrapper w-[1113px] mt-4">
      <Box sx={{ marginBottom: 2 }}>
        <FormControl sx={dropDownStyle}>
          <Select
            labelId="company-label"
            id="company"
            value={selectedWarehouse.id}
            label={t('check_out.any')}
            onChange={onChangeWarehouse}
          >
            <MenuItem value={selectedWarehouse.id}>
              {selectedWarehouse.name}
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box className="capacity-section">
        <Card
          sx={{
            borderRadius: 2,
            backgroundColor: 'white',
            padding: 2,
            boxShadow: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box className={'total-capacity'} sx={{ flexGrow: 1 }}>
            <Typography fontSize={16} color="gray" fontWeight="light">
              {'現時容量'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography fontSize={22} color="black" fontWeight="bold">
                {capacity}
              </Typography>
              <Typography fontSize={13} color="black" fontWeight="bold">
                /{totalCapacity}kg
              </Typography>
            </Box>

            <Box sx={{ marginTop: 3, marginBottom: 2 }}>
              <ProgressLine
                value={capacity}
                total={totalCapacity}
              ></ProgressLine>
            </Box>

            <Typography fontSize={14} color="green" fontWeight="light">
              {'尚有大量空間'}
            </Typography>
          </Box>
          <Box
            className={'checkin-checkout'}
            sx={{ display: 'flex', gap: '12px' }}
          >
            <Card
              sx={{
                borderRadius: 2,
                backgroundColor: '#A7D676',
                padding: 2,
                boxShadow: 'none',
                color: 'white',
                width: '84px',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/warehouse/shipment')}
            >
              <LoginIcon
                fontSize="small"
                className="bg-[#7FC738] rounded-[50%] p-1"
              />
              <div className="text-sm font-bold mb-4">送入請求</div>
              <div className="flex gap-1 items-baseline">
                <Typography fontSize={22} color="white" fontWeight="bold">
                  2
                </Typography>
                <Typography fontSize={11} color="white" fontWeight="bold">
                  送入請求
                </Typography>
              </div>
            </Card>
            <Card
              sx={{
                borderRadius: 2,
                backgroundColor: '#7ADFF1',
                padding: 2,
                boxShadow: 'none',
                color: 'white',
                width: '84px',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/warehouse/checkout')}
            >
              <LogoutIcon
                fontSize="small"
                className="bg-[#6BC7FF] rounded-[50%] p-1"
              />
              <div className="text-sm font-bold mb-4">送入請求</div>
              <div className="flex gap-1 items-baseline">
                <Typography fontSize={22} color="white" fontWeight="bold">
                  2
                </Typography>
                <Typography fontSize={11} color="white" fontWeight="bold">
                  送入請求
                </Typography>
              </div>
            </Card>
          </Box>
        </Card>
      </Box>
      <Box className="capacity-item" sx={{ marginY: 6 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 2
          }}
        >
          <Typography fontSize={16} color="#535353" fontWeight="bold">
            現時容量
          </Typography>
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <Typography
              fontSize={13}
              color="gray"
              fontWeight="light"
              onClick={() => navigate('collector/inventory')}
            >
              全部
            </Typography>
            <ChevronRightIcon
              fontSize="small"
              className="text-gray"
            ></ChevronRightIcon>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {subTypeItem.map((item) => (
            <Card
              sx={{
                borderRadius: 2,
                backgroundColor: 'white',
                padding: 2,
                boxShadow: 'none',
                color: 'white',
                width: '110px'
              }}
            >
              <div className="circle-color w-[30px] h-[30px] rounded-[50px] bg-slate-400"></div>
              <div className="text-sm font-bold text-black mt-2 mb-10">
                廢紙
              </div>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold text-black">500</div>
                <div className="text-2xs font-bold text-black ">/500kg</div>
              </div>
              <Box sx={{ marginTop: 1 }}>
                <ProgressLine value={20} total={100}></ProgressLine>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
      <Box className="table-checkin-out">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 2
          }}
        >
          <Typography fontSize={16} color="#535353" fontWeight="bold">
            最近出入記錄
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography fontSize={13} color="gray" fontWeight="light">
              全部
            </Typography>
            <ChevronRightIcon
              fontSize="small"
              className="text-gray"
            ></ChevronRightIcon>
          </Box>
        </Box>
        <Box pr={4} sx={{ flexGrow: 1, width: '100%' }}>
          <DataGrid
            rows={checkInOut}
            getRowId={(row) => row.id}
            hideFooter
            columns={columns}
            checkboxSelection={false}
            //onRowClick={handleSelectRow}
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
      </Box>
    </Box>
  )
}

let dropDownStyle = {
  mt: 3,
  borderRadius: '10px',
  width: 'max-content',
  bgcolor: 'transparent',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '& fieldset': {
      borderColor: 'transparent'
    },
    '&:hover fieldset': {
      borderColor: 'transparent'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'transparent'
    },
    '.MuiSelect-select': {
      fontSize: 22,
      fontWeight: 'bold'
    }
  }
}

export default WarehouseDashboard
