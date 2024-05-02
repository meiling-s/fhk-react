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

import { useTranslation } from 'react-i18next'

const LogisticDashboard = () => {
  const { t } = useTranslation()
  const [driverInfo, setDriverInfo] = useState<string | null>(null)
  const [pickupOrDropPoint, setPickupOrDropPoint] = useState<boolean>(false)

  const handleMarkerClick = () => {
    // setPickupOrDropPoint('syalalalalal')
  }

  const markerPositions: LatLngTuple[] = [
    [22.42734537836034, 114.20837003279368],
    [22.41786325107272, 114.2084943679594]
  ]

  const customIcon = L.divIcon({
    className: 'custom-icon',
    html: '<div class="custom-marker w-6 h-6 bg-red rounded-3xl"></div>'
  })

  const bounds = useMemo(() => {
    if (markerPositions.length > 0) {
      return new LatLngBounds(markerPositions)
    }
    return null
  }, [markerPositions])

  // Function to fit all markers within the bounds when the map first loads
  const FitBoundsOnLoad = () => {
    const map = useMap()
    useEffect(() => {
      if (bounds) {
        map.fitBounds(bounds)
      }
    }, [bounds, map])
    return null
  }

  const handleSearch = (e: string) => {}

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
      <Box sx={{ width: '80%', height: '100%', marginTop: '-32px' }}>
        <MapContainer
          center={[22.4241897, 114.2117632]}
          zoom={12}
          zoomControl={false}
        >
          <FitBoundsOnLoad />
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markerPositions.map((position, index) => (
            <Marker
              key={index}
              position={position}
              icon={customIcon}
              eventHandlers={{
                mouseover: () => setPickupOrDropPoint(true),
                mouseout: () => setPickupOrDropPoint(false)
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
              {t('logisticDashboard.driverNumb')} : 000000000
            </Typography>
            <Typography sx={{ ...style.typo2, marginTop: 0.5 }}>
              {t('logisticDashboard.driverLicense')} : 000000000
            </Typography>
            <Typography sx={{ ...style.typo2, marginTop: 0.5 }}>
              {t('logisticDashboard.vehicleCategory')} : Minivan
            </Typography>
          </Grid>
        )}
        {pickupOrDropPoint && (
          <Grid item>
            <Typography sx={{ ...style.typo, marginTop: 2, marginBottom: 2 }}>
              {t('logisticDashboard.receivingLocation')}
            </Typography>
            <Box sx={{ ...style.driverDetail }}>
              <Typography sx={{ ...style.typo3, marginTop: 0.5 }}>
                收件點1
              </Typography>
              <Typography sx={{ ...style.typo2, marginTop: 0.5 }}>
                {t('logisticDashboard.vehicleCategory')} : 10/10/2023
              </Typography>
              <Typography
                sx={{
                  fontSize: 15,
                  color: '#58C33C',
                  fontWeight: '500',
                  marginTop: 0.5
                }}
              >
                {t('logisticDashboard.vehicleCategory')} : 10/10/2023 00:00:00
              </Typography>
              <Box sx={{ marginY: 4 }}>
                <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                  {t('logisticDashboard.vehicleCategory')} : 物流公司
                </Typography>
                <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                  {t('logisticDashboard.vehicleCategory')} : PO12345678
                </Typography>
                <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                  {t('logisticDashboard.vehicleCategory')} : 寄件地址
                </Typography>
                <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                  {t('logisticDashboard.vehicleCategory')} : 廢紙
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                  {t('logisticDashboard.vehicleCategory')} : 紙箱
                </Typography>
                <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                  {t('logisticDashboard.vehicleCategory')} : 1
                </Typography>
                <Typography sx={{ ...style.typo4, marginTop: 0.5 }}>
                  {t('logisticDashboard.vehicleCategory')} : 20 Kg
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
