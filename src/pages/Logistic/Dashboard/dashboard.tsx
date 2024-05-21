import {
  Box,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Typography
} from '@mui/material'
import { useEffect, useState, useMemo } from 'react'
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
import { getAllPackagingUnit } from '../../../APICalls/Collector/packagingUnit'
import { PackagingUnit } from '../../../interfaces/packagingUnit'
import { getVehicleLogistic } from '../../../APICalls/Logistic/vehicles'

import { useContainer } from 'unstated-next'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import i18n from '../../../setups/i18n'
import { localStorgeKeyName } from '../../../constants/constant'

interface PuAndDropOffMarker {
  id: number
  type: string
  gpsCode: LatLngTuple
  senderAddr: string
  receiverAddr: string
}

const VehicleDashboard = () => {
  const { t } = useTranslation()
  const { vehicleType, recycType } = useContainer(CommonTypeContainer)
  const [packagingMapping, setPackagingMapping] = useState<PackagingUnit[]>([])
  const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null)
  const [vehicleCategory, setVehicleCategory] = useState<number | null>(null)
  const [vehicleName, setVehicleName] = useState<string | null>('-')
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
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null)
  const role = localStorage.getItem(localStorgeKeyName.role) || 'collector'
  const logisticTableId =
    localStorage.getItem(localStorgeKeyName.decodeKeycloack) || ''
  const [selectedTable, setSelectedTable] = useState<string>(logisticTableId)
  const todayDate = dayjs().format('YYYY-MM-DD')

  useEffect(() => {
    if (vehicleCategory != null) {
      getVehicleName(vehicleCategory)
    }
  }, [vehicleCategory])

  useEffect(() => {
    initPackageList()
  }, [puAndDropOffMarker])

  const getVehicleName = async (vehicleId: number) => {
    const result = await getVehicleLogistic(vehicleId)
    if (result?.data) {
      const selectedVehicle = vehicleType?.find(
        (item) => item.vehicleTypeId == result.data.vehicleTypeId
      )

      if (selectedVehicle) {
        var name = '-'
        switch (i18n.language) {
          case 'enus':
            name = selectedVehicle.vehicleTypeNameEng
            break
          case 'zhch':
            name = selectedVehicle.vehicleTypeNameSchi
            break
          case 'zhhk':
            name = selectedVehicle.vehicleTypeNameTchi
            break
          default:
            name = selectedVehicle.vehicleTypeNameTchi
            break
        }
        setVehicleName(name)
      }
    }
  }

  const initPackageList = async () => {
    const result = await getAllPackagingUnit(0, 1000)
    const data = result?.data

    if (data) {
      setPackagingMapping(data.content)
    }
  }

  const getPackageName = (packagingTypeId: string) => {
    const selectedPackage = packagingMapping.find(
      (item) => item.packagingTypeId == packagingTypeId
    )

    if (selectedPackage) {
      var name = '-'
      switch (i18n.language) {
        case 'enus':
          name = selectedPackage?.packagingNameEng
          break
        case 'zhch':
          name = selectedPackage?.packagingNameTchi
          break
        case 'zhhk':
          name = selectedPackage?.packagingNameSchi
          break
        default:
          name = selectedPackage?.packagingNameEng
          break
      }
      return name
    }
  }

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

  const hoverCustomIcon = (type: string, address: string) =>
    L.divIcon({
      className: 'custom-icon',
      html: `<div><div class="custom-marker w-6 h-6 rounded-3xl" style="background-color:${getMarkerColor(
        type
      )}"></div><div class="w-max py-1 px-2 absolute mt-4 left-1/4 ml-4 translate-x-[-50%] rounded-lg" style="background-color:${
        type === 'pu' ? '#AFE397' : '#F5A4B7'
      }">${address}</div></<div>`,
      iconAnchor: [3, 6]
    })

  const bounds = useMemo(() => {
    const filteredMarkers = puAndDropOffMarker.filter(
      (item) =>
        item.gpsCode &&
        item.gpsCode.length === 2 &&
        item.gpsCode[0] !== 0 &&
        item.gpsCode[1] !== 0
    )
    if (filteredMarkers.length > 0) {
      return new LatLngBounds(filteredMarkers.map((item) => item.gpsCode))
    }
    return null
  }, [puAndDropOffMarker])

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

  const mappingRecyName = (recycTypeId: string) => {
    const matchingRecycType = recycType?.find(
      (recyc) => recycTypeId === recyc.recycTypeId
    )
    if (matchingRecycType) {
      var name = '-'
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
      return name
    }
  }

  const getDriverInfo = async (driverIdValue: string) => {
    const result = await getDriverDetail(selectedTable, parseInt(driverIdValue))
    if (result) {
      setDriverInfo(result.data)
    }
  }

  const getPickupPointList = async (driverIdValue: number) => {
    const result = await getDriverPickupPoint(
      selectedTable,
      driverIdValue,
      todayDate,
      todayDate
    )
    if (result) {
      let tempPUpoint: PuAndDropOffMarker[] = []
      result.data.map((pu: any) => {
        tempPUpoint.push({
          id: pu.puId,
          type: 'pu',
          gpsCode: pu.senderAddrGps.length > 1 ? pu.senderAddrGps : [0.0, 0.0],
          senderAddr: pu.senderAddr,
          receiverAddr: pu.receiverAddr
        })
      })
      setPickupPoint(result.data)
      setPuAndDropOffMarker((existingMarkers) => [
        ...existingMarkers,
        ...tempPUpoint
      ])
      // call drop off api to and send pickup list to fetch data
      await getDropOffPointList(driverIdValue, result.data)
    }
  }

  const getDropOffPointList = async (
    driverIdValue: number,
    pickupPointList: any
  ) => {
    const result = await getDriverDropOffPoint(
      selectedTable,
      driverIdValue,
      todayDate,
      todayDate
    )
    if (result) {
      let tempDropOffPoint: PuAndDropOffMarker[] = []
      result.data.map((drof: any) => {
        const pu = pickupPointList.find(
          (item: any) => item.puId == drof.puHeader.puId
        )
        const drofReceiverAddrGps: LatLngTuple = pu
          ? pu.receiverAddrGps
          : [0.0, 0.0]
        tempDropOffPoint.push({
          id: drof.drofId,
          type: 'drop',
          gpsCode:
            drofReceiverAddrGps.length > 1 ? drofReceiverAddrGps : [0.0, 0.0],
          senderAddr: pu.senderAddr,
          receiverAddr: pu.receiverAddr
        })
      })

      setPuAndDropOffMarker((existingMarkers) => [
        ...existingMarkers,
        ...tempDropOffPoint
      ])
      setDropofPoint(result.data)
    }
  }

  const handleSearchDriver = async (value: string) => {
    if (value || value != '') {
      getDriverInfo(value)
      await getPickupPointList(parseInt(value))
    } else {
      setDriverInfo(null)
      setPuAndDropOffMarker([])
      setShowPuDropPoint(false)
    }
  }

  const showDetailPoint = (point: PuAndDropOffMarker) => {
    setShowPuDropPoint(true)
    setTypePoint(point.type)
    if (point.type == 'pu') {
      const pu = pickupPoint.find((item) => item.puId === point.id) || null
      if (pu) setVehicleCategory(pu.vehicleId)
      setSelectedPuPoint(pu)
    } else {
      const drof = dropOfPoint.find((item) => item.drofId === point.id) || null
      if (drof) setVehicleCategory(drof.puHeader.vehicleId)
      setSelectedDrof(drof)
    }
  }

  // Function to handle mouseover event
  const handleClickMarker = (index: number) => {
    setSelectedMarker(index)
  }

  const handleSearchCompany = (value: string) => {
    setSelectedTable(`company${value}`)
    console.log('selectedtable', selectedTable)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value.replace(/\D/g, '')
    if (numericValue.length === 6) {
      handleSearchCompany(numericValue)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        marginLeft: '-31px',
        marginTop: {
          xs: '62px',
          sm: 0
        }
      }}
    >
      <Box
        sx={{
          padding: '16px',
          marginBottom: '32px',
          paddingLeft: '32px',
          paddingBottom: '32px',
          display: role == 'astd' ? '' : 'none'
        }}
        className="search-company-number"
      >
        <Grid item>
          <TextField
            id="searchCompanyNumber"
            onChange={handleInputChange}
            label={t('tenant.search')}
            sx={style.inputState}
            placeholder={t('tenant.enter_company_number')}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
              maxLength: 6
            }}
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
      </Box>
      <Box sx={{ display: 'flex', marginTop: '-32px' }}>
        <Box
          className="map"
          sx={{
            width: '70%',
            height: 'calc(100vh - 64px)'
            // marginTop: '-32px'
          }}
        >
          <MapContainer
            center={[22.4241897, 114.2117632]}
            zoom={13}
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
                // icon={customIcon(position.type)}
                icon={
                  selectedMarker === index
                    ? hoverCustomIcon(
                        position.type,
                        position.type == 'pu'
                          ? position.senderAddr
                          : position.receiverAddr
                      )
                    : customIcon(position.type)
                }
                eventHandlers={{
                  click: () => {
                    showDetailPoint(position)
                    handleClickMarker(index)
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
            // marginTop: '-32px',
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
              onChange={(event) => {
                const numericValue = event.target.value.replace(/\D/g, '')
                handleSearchDriver(numericValue)
              }}
              sx={style.inputState}
              placeholder={t('logisticDashboard.inputDriverNumber')}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                maxLength: 3
              }}
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
                {t('logisticDashboard.driverNumb')} {' : '}{' '}
                {driverInfo.contactNo}
              </Typography>
              <Typography sx={{ ...style.typo2, marginTop: 0.5 }}>
                {t('logisticDashboard.driverLicense')} {' : '}
                {driverInfo.licenseNo}
              </Typography>
              <Typography sx={{ ...style.typo2, marginTop: 0.5 }}>
                {t('logisticDashboard.vehicleCategory')} {' : '}
                {vehicleName}
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
                  {t('logisticDashboard.receiptDate')} {' : '}
                  {typePoint == 'pu'
                    ? displayLocalDate(selectedPuPoint?.puAt || '')
                    : displayLocalDate(selectedDrofPoint?.drofAt || '')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: typePoint == 'pu' ? '#58C33C' : '#FF4242',
                    fontWeight: '500',
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center'
                  }}
                >
                  <Box sx={{ marginRight: 1, marginTop: '4px' }}>
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
                <Box sx={{ marginY: 2 }}>
                  <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                    {t('logisticDashboard.logisticsCompany')} {' : '}
                    {typePoint == 'pu'
                      ? selectedPuPoint?.senderName
                      : selectedDrofPoint?.puHeader.receiverName}
                  </Typography>
                  <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                    {t('logisticDashboard.poNumber')} {' : '}
                    {typePoint == 'pu'
                      ? selectedPuPoint?.jo.picoId
                      : selectedDrofPoint?.puHeader.jo.picoId}
                  </Typography>
                  <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                    {t('logisticDashboard.shippingAddress')} {' : '}
                    {typePoint == 'pu'
                      ? selectedPuPoint?.senderAddr
                      : selectedDrofPoint?.puHeader.receiverAddr}
                  </Typography>
                  <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                    {t('logisticDashboard.recyc')} {' : '}
                    {typePoint == 'pu'
                      ? mappingRecyName(selectedPuPoint?.jo.recycType || '-')
                      : mappingRecyName(
                          selectedDrofPoint?.puHeader.jo.recycType || '-'
                        )}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                    {t('logisticDashboard.packageName')} {' : '}
                    {getPackageName(
                      selectedPuPoint?.puDetail[0].packageTypeId || ''
                    )}
                  </Typography>
                  <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                    {t('logisticDashboard.packingWeight')} {' : '}
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

export default VehicleDashboard
