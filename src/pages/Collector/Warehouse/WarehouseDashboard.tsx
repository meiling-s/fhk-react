import { FunctionComponent, useCallback, ReactNode, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  FormControl,
  Select,
  MenuItem
} from '@mui/material'
import { SelectChangeEvent } from "@mui/material/Select";
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
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ProgressLine from '../../../components/ProgressLine'
import StatusCard from '../../../components/StatusCard';
import { il_item } from '../../../components/FormComponents/CustomItemList'

import { format } from '../../../constants/constant'
import dayjs from 'dayjs'

import {
  getCapacityWarehouse,
  getWeightbySubtype,
  getCheckInWarehouse,
  getCheckOutWarehouse,
  getCheckInOutWarehouse
} from '../../../APICalls/warehouseDashboard'
import { getAllWarehouse, getWarehouseById } from '../../../APICalls/warehouseManage'
import { CheckInOutWarehouse } from '../../../interfaces/warehouse'

import { useTranslation } from 'react-i18next'
import i18n from '../../../setups/i18n'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'

function createCheckInOutWarehouse(
  id: number,
  createdAt: string,
  status: string,
  senderName: string,
  receiverName: string,
  picoId: string,
  adjustmentFlg: true,
  logisticName: string,
  senderAddr: string,
  receiverAddr: string,
): CheckInOutWarehouse {
  return { id, createdAt, status, senderName, receiverName, picoId, adjustmentFlg, logisticName, senderAddr, receiverAddr }
}

interface warehouseSubtype {
  subTypeId: string
  subtypeName: string
  weight: number
  capacity:number
}

type RecycSubTypeCapacity = {
  [recycsubtypeId: string]: number;
};

const WarehouseDashboard: FunctionComponent = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { recycType } = useContainer(CommonTypeContainer)

  const [currentCapacity, setCurrentCapacity] = useState<number>(0)
  const [totalCapacity, setTotalCapacity] = useState<number>(1000)
  const [warehouseList, setWarehouseList] = useState<il_item[]>([])
  const [checkIn, setCheckIn] = useState<number>(0)
  const [checkOut, setCheckOut] = useState<number>(0)
  const [selectedWarehouse, setSelectedWarehouse] = useState<il_item | null>(null)
  const [warehouseSubtype, setWarehouseSubtype] = useState<warehouseSubtype[]>([])
  const [checkInOut, setCheckInOut] = useState<CheckInOutWarehouse[]>([])

  useEffect(()=>{
    initWarehouse()
  }, [i18n.language])

  useEffect(()=> {
      initCapacity()
      initCheckIn()
      initCheckOut()
      initWarehouseSubType()
      initCheckInOut()
    
  }, [selectedWarehouse, i18n.language])

  const initWarehouse = async () => {
    const result = await getAllWarehouse(0, 20)
    // if(result == '401') {
    //   localStorage.clear()
    //   navigate('/')
    // } else
     if(result) {

      let capacityTotal = 0
      let warehouse: il_item[] = []
      const data = result.data.content
      data.forEach((item: any) => {

        item.warehouseRecyc?.forEach((recy: any) => {
          capacityTotal += recy.recycSubTypeCapacity; 
        });

        var warehouseName = ''
        switch (i18n.language) {
          case 'enus':
            warehouseName = item.warehouseNameTchi
            break
          case 'zhch':
            warehouseName = item.warehouseNameSchi
            break
          case 'zhhk':
            warehouseName = item.warehouseNameEng
            break
          default:
            warehouseName = item.warehouseNameTchi
            break
        }

        warehouse.push({
          id: item.warehouseId,
          name: warehouseName
        })

      });

      setWarehouseList(warehouse)
      if(warehouse.length > 0 ) setSelectedWarehouse(warehouse[0])
      setTotalCapacity(capacityTotal)
    }
  }

  const getWeightSubtypeWarehouse = async () => {
    //init weight for each subtype also calculate current subtype
    if(selectedWarehouse){
      const result = await getWeightbySubtype(parseInt(selectedWarehouse.id))
      if(result) {
        const data = result.data
        //get weigt subtype
        //set current capacity warehouse
        var currCapacityWarehouse = 0
        Object.keys(data).forEach((item) => {
          currCapacityWarehouse += data[item]
        })
        setCurrentCapacity(currCapacityWarehouse)
        return result.data
      }
    }
   
  }

  const initCapacity = async () => {
    if(selectedWarehouse){
      const result = await getCapacityWarehouse(parseInt(selectedWarehouse.id))
      if(result) setTotalCapacity(result.data)    
    }
  }

  const initCheckIn = async () => {
    if(selectedWarehouse){
    const result = await getCheckInWarehouse(parseInt(selectedWarehouse.id))
      if(result) setCheckIn(result.data)
    }
  }

  const initCheckOut = async () => {
    if(selectedWarehouse){
    const result = await getCheckOutWarehouse(parseInt(selectedWarehouse.id))
      if(result) setCheckOut(result.data)
    }
  }

  const mappingRecyName = (recycTypeId: string, recycSubTypeId: string) => {
    const matchingRecycType = recycType?.find(
      (recyc) => recycTypeId === recyc.recycTypeId
    )

    if (matchingRecycType) {
      const matchRecycSubType = matchingRecycType.recycSubType?.find(
        (subtype) => subtype.recycSubTypeId === recycSubTypeId
      )
      var name = ''
      switch (i18n.language) {
        case 'enus':
          name = matchingRecycType.recyclableNameEng
          break
        case 'zhch':
          name = matchingRecycType.recyclableNameSchi
          break
        case 'zhhk':
          name = matchingRecycType.recyclableNameTchi
          break
        default:
          name = matchingRecycType.recyclableNameTchi
          break
      }
      var subName = ''
      switch (i18n.language) {
        case 'enus':
          subName = matchRecycSubType?.recyclableNameEng ?? ''
          break
        case 'zhch':
          subName = matchRecycSubType?.recyclableNameSchi ?? ''
          break
        case 'zhhk':
          subName = matchRecycSubType?.recyclableNameTchi ?? ''
          break
        default:
          subName = matchRecycSubType?.recyclableNameTchi ?? '' //default fallback language is zhhk
          break
      }

      return { name, subName }
    }
  }

  const initWarehouseSubType = async () => {
    if(selectedWarehouse) {
      const weightSubtype = await getWeightSubtypeWarehouse()
      const result = await getWarehouseById(parseInt(selectedWarehouse.id))
      console.log("weightSubtype",weightSubtype)

      if(result) {
        const data = result.data
        let subtypeWarehouse: warehouseSubtype[] = []   
        var subTypeWeight = 0
        data?.warehouseRecyc.forEach((item: any)=>{
          const recyItem = mappingRecyName(item.recycTypeId , item.recycSubTypeId)
          if(subTypeWeight) {
            subTypeWeight = item.recycSubTypeId in weightSubtype ? weightSubtype[item.recycSubTypeId] : 0;
          }
          
          subtypeWarehouse.push({
            subTypeId: item.recycSubTypeId,
            subtypeName: recyItem ? recyItem.subName : "-",
            weight: subTypeWeight,
            capacity: item.recycSubTypeCapacity
          })
        })
        setWarehouseSubtype(subtypeWarehouse)

      }
    }
  }

  const initCheckInOut = async () => {
    if(selectedWarehouse){
    const result = await getCheckInOutWarehouse(parseInt(selectedWarehouse.id))
    if(result){
      const data = result.data
      let checkinoutMapping :CheckInOutWarehouse[] = []
      data.map((item: any, index: number)=> {
        checkinoutMapping.push(
          createCheckInOutWarehouse(
            item?.chkInId || index +  item?.chkInId,
            item?.createdAt,
            item?.status,
            item?.senderName,
            item?.receiverName,
            item?.picoId,
            item?.adjustmentFlg,
            item?.logisticName,
            item?.senderAddr,
            item?.receiverAddr,
          )
        )
      })

      setCheckInOut(checkinoutMapping)
    }
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: t('check_out.created_at'),
      width: 120,
      type: 'string',
      renderCell: (params) => {
        const dateFormatted = dayjs(new Date(params.row.createdAt)).format(
          format.dateFormat1
        )
        return <div>{dateFormatted}</div>
      }
    },
    {
      field: 'status',
      headerName: t('col.status'),
      width: 150,
      type: 'string',
      renderCell: (params) => {
        return <StatusCard status={params.row.status} />
      }
    },
    {
      field: 'senderName',
      headerName: t('check_out.shipping_company'),
      width: 100,
      type: 'string'
    },
    {
      field: 'receiverName',
      headerName: t('check_in.receiver_company'),
      width: 100,
      type: 'string'
    },
    {
      field: 'picoId',
      headerName: t('check_out.pickup_order_no'),
      width: 200,
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
      field: 'senderAddr',
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

  const onChangeWarehouse = (event: SelectChangeEvent) => {
    const warehouseId = event.target.value
    const selectedWarehouse = warehouseList.find(item => item.id == warehouseId )
    if(selectedWarehouse){
      setSelectedWarehouse(selectedWarehouse)
    }
  }

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 0 : 10
    }
  }, [])

  const generateRandomPastelColor = () => {
    const r = Math.floor(Math.random() * 156) + 100; // Red component (100-255)
    const g = Math.floor(Math.random() * 156) + 100; // Green component (100-255)
    const b = Math.floor(Math.random() * 156) + 100; // Blue component (100-255)
    const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  
    return color;
  };

  return (
    <Box className="container-wrapper w-[1283px] mt-4">
      <Box sx={{ marginBottom: 2 }}>
        <FormControl sx={dropDownStyle}>
          <Select
            id="warehouse"
            placeholder='Select warehouse'
            value={selectedWarehouse?.id || ""}
            label={t('check_out.any')}
            onChange={onChangeWarehouse}
          >{
            warehouseList?.map((item, index) => (
            <MenuItem value={item?.id} key={index}>
                {item?.name}
            </MenuItem>
            ))
          }   
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
              {t('warehouseDashboard.currentCapacity')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography fontSize={22} color="black" fontWeight="bold">
                {currentCapacity}
              </Typography>
              <Typography fontSize={13} color="black" fontWeight="bold">
                /{totalCapacity}kg
              </Typography>
            </Box>

            <Box sx={{ marginTop: 3, marginBottom: 2 }}>
              <ProgressLine
                value={currentCapacity}
                total={totalCapacity}
              ></ProgressLine>
            </Box>

            <Typography fontSize={14} color={(currentCapacity/totalCapacity) * 100 > 70 ? 'red' : 'green'} fontWeight="light">
              {(currentCapacity/totalCapacity) * 100 < 70 ? t('warehouseDashboard.thereStillEnoughSpace') :  t('warehouseDashboard.noMoreRoom')}
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
              <div className="text-sm font-bold mb-4">{t('warehouseDashboard.check-in')}</div>
              <div className="flex gap-1 items-baseline">
                <Typography fontSize={22} color="white" fontWeight="bold">
                  {checkIn}
                </Typography>
                <Typography fontSize={11} color="white" fontWeight="bold">
                  {t('warehouseDashboard.toBeConfirmed')}
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
              <div className="text-sm font-bold mb-4">{t('warehouseDashboard.check-out')}</div>
              <div className="flex gap-1 items-baseline">
                <Typography fontSize={22} color="white" fontWeight="bold">
                {checkOut}
                </Typography>
                <Typography fontSize={11} color="white" fontWeight="bold">
                  {t('warehouseDashboard.toBeConfirmed')}
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
            {t('warehouseDashboard.recyclingInformation')}
          </Typography>
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/collector/inventory')}
          >
            <Typography
              fontSize={13}
              color="gray"
              fontWeight="light"
              
            >
              {t('warehouseDashboard.all')}
            </Typography>
            <ChevronRightIcon
              fontSize="small"
              className="text-gray"
            ></ChevronRightIcon>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {warehouseSubtype.map((item) => (
            <Card
              key={item.subTypeId}
              sx={{
                borderRadius: 2,
                backgroundColor: 'white',
                padding: 2,
                boxShadow: 'none',
                color: 'white',
                width: '110px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: "space-between"
              }}
            >
              <div className="circle-color w-[30px] h-[30px] rounded-[50px]" style={{background: generateRandomPastelColor()}}></div>
              <div className="text-sm font-bold text-black mt-2 mb-10 min-h-12">
               {item.subtypeName}
              </div>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold text-black">{item.weight}</div>
                <div className="text-2xs font-bold text-black ">/{item.capacity}kg</div>
              </div>
              <Box sx={{ marginTop: 1 }}>
                <ProgressLine value={item.weight} total={item.capacity}></ProgressLine>
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
          {t('warehouseDashboard.recentEntryAndExitRecords')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography fontSize={13} color="gray" fontWeight="light">
            {t('warehouseDashboard.all')}
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
