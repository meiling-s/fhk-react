import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Typography
} from '@mui/material'
import { useEffect, useState, useRef, useMemo } from 'react'
import { MapContainer, Marker, TileLayer, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { LatLngTuple, LatLngBounds } from 'leaflet'

import { SEARCH_ICON } from '../../../themes/icons'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import {
  getDriverDetail,
  getDriverPickupPoint,
  getDriverDropOffPoint
} from '../../../APICalls/Logistic/dashboard'
import {
  DriverInfo,
  PickupPoint,
  DropOffPoint
} from '../../../interfaces/dashboardLogistic'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { displayCreatedDate, displayLocalDate } from '../../../utils/utils'

import { useContainer } from 'unstated-next'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

interface PuAndDropOffMarker {
  id: number
  type: string
  gpsCode: LatLngTuple
}

const LogisticDashboard = () => {
  const { t } = useTranslation()
  // const [driverId, setDriverId] = useState<string | null>(null)
  const { vehicleType } = useContainer(CommonTypeContainer)
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null)
  const [vehicleCategory, setVehicleCategory] = useState<string>('')
  const [puAndDropOffMarker, setPuAndDropOffMarker] = useState<
    PuAndDropOffMarker[]
  >([])
  const [showPuDropPoint, setShowPuDropPoint] = useState<boolean>(false)
  const [typePoint, setTypePoint] = useState<string>('pu')
  const [pickupPoint, setPickupPoint] = useState<PickupPoint[]>([])
  const [dropOfPoint, setDropofPoint] = useState<DropOffPoint[]>([])
  const [selectedPuPoint, setSelectedPuPoint] = useState<PickupPoint | null>(
    null
  )
  const [selectedDrofPoint, setSelectedDrof] = useState<DropOffPoint | null>(
    null
  )
  const todayDate = dayjs().format('YYYY-MM-DD')

  // const getVehicleList = () => {
  //   if (vehicleType) {
  //     const vehicleName = vehicleType.find(item => item.vehicleTypeId == selectedPoint!!.vehicleId)
  //   }
  // }

  useEffect(() => {
    console.log('puAndDropOffMarker', puAndDropOffMarker)
  }, [puAndDropOffMarker])

  const markerPositions: PuAndDropOffMarker[] = [
    {
      id: 1,
      type: 'pu',
      gpsCode: [22.42734537836034, 114.20837003279368]
    },
    {
      id: 2,
      type: 'drop',
      gpsCode: [22.41786325107272, 114.2084943679594]
    }
  ]

  const getMarkerColor = (type: string) => {
    return type === 'pu' ? '#79CA25' : '#FF668B'
  }

  const customIcon = (type: string) =>
    L.divIcon({
      className: 'custom-icon',
      html: `<div class="custom-marker w-6 h-6 rounded-3xl" style="background-color:${getMarkerColor(
        type
      )} "></div>`
    })

  const bounds = useMemo(() => {
    if (markerPositions.length > 0) {
      return new LatLngBounds(
        markerPositions.map((item) => (item.gpsCode ? item.gpsCode : [0, 0]))
      )
    }
    return null
  }, [markerPositions])

  //Function to fit all markers within the bounds when the map first loads
  const FitBoundsOnLoad = () => {
    const map = useMap()
    useEffect(() => {
      if (bounds) {
        map.fitBounds(bounds)
      }
    }, [bounds, map])
    return null
  }

  const getDriverInfo = async (driverIdValue: string) => {
    const result = await getDriverDetail(parseInt(driverIdValue))
    if (result) {
      setDriverInfo(result.data)
    }
  }

  const getPickupPointList = async (driverIdValue: number) => {
    const result = await getDriverPickupPoint(
      driverIdValue,

      '2024-05-06',
      '2024-05-06'
    )
    if (result) {
      let tempPUpoint: PuAndDropOffMarker[] = []
      result.data.map((pu: any) => {
        tempPUpoint.push({
          id: pu.puId,
          type: 'pu',
          gpsCode: pu.senderAddrGps.length > 1 ? pu.senderAddrGps : [0.0, 0.0]
        })
      })
      setPickupPoint(result.data)
      setPuAndDropOffMarker((existingMarkers) => [
        ...existingMarkers,
        ...tempPUpoint
      ])
    }
  }

  const getDropOffPointList = async (driverIdValue: number) => {
    const result = await getDriverDropOffPoint(
      driverIdValue,
      '2024-05-06',
      '2024-05-06'
      // todayDate,
      // todayDate
    )
    if (result) {
      let tempDropOffPoint: PuAndDropOffMarker[] = []
      result.data.map((drof: any) => {
        tempDropOffPoint.push({
          id: drof.drofId,
          type: 'drop',
          gpsCode: [22.416551141285588, 114.20057888860003]
          // drof.puHeader.receiverAddrGps.length > 1
          //   ? drof.puHeader.receiverAddrGps
          //   : [0.0, 0.0]
        })
      })

      setPuAndDropOffMarker((existingMarkers) => [
        ...existingMarkers,
        ...tempDropOffPoint
      ])
      setDropofPoint(result.data)
    }
  }

  const handleSearch = (value: string) => {
    if (value || value != '') {
      getDriverInfo(value)
      getPickupPointList(parseInt(value))
      getDropOffPointList(parseInt(value))
      console.log('handleSearch', puAndDropOffMarker)
    } else {
      setDriverInfo(null)
    }
  }

  const showDetailPoint = (point: PuAndDropOffMarker) => {
    setShowPuDropPoint(true)
    setTypePoint(point.type)
    if (point.type == 'pu') {
      setSelectedPuPoint(
        pickupPoint.find((item) => item.puId === point.id) || null
      )
    } else {
      setSelectedDrof(
        dropOfPoint.find((item) => item.drofId === point.id) || null
      )
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        marginLeft: '-31px',
        marginTop: {
          xs: '62px',
          sm: 0
        }
      }}
    >
      <Box sx={{ width: '70%', height: '100%', marginTop: '-32px' }}>
        <MapContainer
          center={[22.4241897, 114.2117632]}
          zoom={11}
          zoomControl={false}
        >
          <FitBoundsOnLoad />
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {puAndDropOffMarker.map((position, index) => (
            <Marker
              key={index}
              position={position.gpsCode}
              icon={customIcon(position.type)}
              eventHandlers={{
                mouseover: () => {
                  showDetailPoint(position)
                },
                mouseout: () => {
                  setShowPuDropPoint(false)
                }
              }}
            />
          ))}
        </MapContainer>
      </Box>
      <Box
        sx={{
          width: '25%',
          height: '100%',
          marginTop: '-32px',
          paddingInline: 4
        }}
      >
        <Grid item>
          <Typography sx={{ ...style.typo, marginTop: 2 }}>
            {t('logisticDashboard.searchDriver')}
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            id="searchShipment"
            onChange={(event) => handleSearch(event.target.value)}
            sx={style.inputState}
            placeholder={t('pick_up_order.search_company_name')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => {}}>
                    <SEARCH_ICON style={{ color: '#79CA25' }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Grid>
        {driverInfo && (
          <Grid
            item
            sx={{ paddingBottom: 2, borderBottom: '2px solid #ACACAC' }}
          >
            <Typography sx={{ ...style.typo, marginTop: 2 }}>
              {t('logisticDashboard.driverInfo')}
            </Typography>
            <Typography sx={{ ...style.typo2, marginTop: 1 }}>
              {t('logisticDashboard.driverNumb')} : {driverInfo.contactNo}
            </Typography>
            <Typography sx={{ ...style.typo2, marginTop: 0.5 }}>
              {t('logisticDashboard.driverLicense')} : {driverInfo.licenseNo}
            </Typography>
            <Typography sx={{ ...style.typo2, marginTop: 0.5 }}>
              {t('logisticDashboard.vehicleCategory')} :{' '}
              {vehicleCategory ? vehicleCategory : '-'}
            </Typography>
          </Grid>
        )}
        {showPuDropPoint && (
          <Grid item>
            <Typography sx={{ ...style.typo, marginTop: 2, marginBottom: 2 }}>
              {t('logisticDashboard.receivingLocation')}
            </Typography>
            <Box
              sx={{
                ...style.driverDetail,
                backgroundColor: typePoint == 'pu' ? '#E4F6DC' : '#FFF0F4'
              }}
            >
              <Typography sx={{ ...style.typo3, marginTop: 0.5 }}>
                {typePoint == 'pu'
                  ? selectedPuPoint?.senderName
                  : selectedDrofPoint?.puHeader.receiverName}
              </Typography>
              <Typography sx={{ ...style.typo2, marginTop: 0.5 }}>
                {t('logisticDashboard.receiptDate')} :
                {typePoint == 'pu'
                  ? displayLocalDate(selectedPuPoint?.puAt || '')
                  : displayLocalDate(selectedDrofPoint?.drofAt || '')}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  color: typePoint == 'pu' ? '#58C33C' : '#FF4242',
                  fontWeight: '500',
                  marginTop: 0.5,
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ marginRight: 1, marginTop: 0.5 }}>
                  {typePoint == 'pu' ? (
                    selectedPuPoint?.jo.status.toLocaleLowerCase() !=
                    'rejected' ? (
                      <CheckCircleRoundedIcon
                        fontSize="small"
                        style={{ color: '#58C33C' }}
                      />
                    ) : (
                      <CheckCircleRoundedIcon
                        fontSize="small"
                        style={{ color: '#58C33C' }}
                      />
                    )
                  ) : selectedDrofPoint?.puHeader.jo.status.toLocaleLowerCase() !=
                    'rejected' ? (
                    <CheckCircleRoundedIcon
                      fontSize="small"
                      style={{ color: '#58C33C' }}
                    />
                  ) : (
                    <ErrorRoundedIcon
                      fontSize="small"
                      style={{ color: '#FF6166' }}
                    />
                  )}
                </Box>

                {typePoint == 'pu'
                  ? t(
                      `status.${selectedPuPoint?.jo.status.toLocaleLowerCase()}`
                    )
                  : t(
                      `status.${selectedDrofPoint?.puHeader.jo.status.toLocaleLowerCase()}`
                    )}
                {'  '}
                {typePoint == 'pu'
                  ? displayCreatedDate(selectedPuPoint?.puAt || '')
                  : displayCreatedDate(selectedDrofPoint?.drofAt || '')}
              </Typography>
              <Box sx={{ marginY: 4 }}>
                <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                  {t('logisticDashboard.logisticsCompany')} :
                  {typePoint == 'pu'
                    ? selectedPuPoint?.senderName
                    : selectedDrofPoint?.puHeader.receiverName}
                </Typography>
                <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                  {t('logisticDashboard.poNumber')} :
                  {typePoint == 'pu'
                    ? selectedPuPoint?.jo.picoId
                    : selectedDrofPoint?.puHeader.jo.picoId}
                </Typography>
                <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                  {t('logisticDashboard.shippingAddress')} :
                  {typePoint == 'pu'
                    ? selectedPuPoint?.senderAddr
                    : selectedDrofPoint?.puHeader.receiverAddr}
                </Typography>
                <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                  {t('logisticDashboard.recyc')} :
                  {typePoint == 'pu'
                    ? selectedPuPoint?.jo.recycType
                    : selectedDrofPoint?.puHeader.jo.recycType}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                  {t('common.pckgCtegory')} :
                  {selectedPuPoint?.puDetail[0].packageTypeId}
                </Typography>
                <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                  {t('logisticDashboard.packingWeight')} :
                  {typePoint == 'pu'
                    ? selectedPuPoint?.jo.weight.toString()
                    : selectedDrofPoint?.puHeader.jo.weight.toString()}
                  Kg
                </Typography>
              </Box>
            </Box>
          </Grid>
        )}
      </Box>
    </Box>
  )
}

let style = {
  typo: {
    color: '#ACACAC',
    fontSize: 13,
    fontWeight: '500'
  },
  typo2: {
    color: '#717171',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: '20px',
    letterSpacing: 1
  },
  typo3: {
    color: '#717171',
    fontSize: 20,
    fontWeight: 'bold'
  },
  typo4: {
    color: '#717171',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: '20px',
    letterSpacing: 1
  },
  driverDetail: {
    background: '#E4F6DC',
    borderRadius: 2,
    padding: 3
  },
  inputState: {
    mt: 2,
    width: '100%',

    borderRadius: '10px',
    bgcolor: 'white',
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      '& fieldset': {
        borderColor: '#79CA25'
      },
      '&:hover fieldset': {
        borderColor: '#79CA25'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#79CA25'
      },
      '& label.Mui-focused': {
        color: '#79CA25'
      }
    }
  }
}

export default LogisticDashboard
