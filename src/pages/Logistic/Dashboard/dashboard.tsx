import { Box } from '@mui/material'
import { useEffect, useState, useRef, useMemo } from 'react'
//import "../index.css";
import MyMap from '../../../components/MyMap'
import { styles } from '../../../constants/styles'
import { MapContainer, Marker, TileLayer, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { LatLngTuple, LatLngBounds } from 'leaflet'

interface ZoomToMarkerProps {
  coordinates: [number, number] // Specify the type for the coordinates prop
}

const LogisticDashboard = () => {
  const mapRef = useRef<typeof MapContainer>(null)
  const [driverDetail, setDriverDetail] = useState<string>('')

  const customIcon = L.divIcon({
    className: 'custom-icon', // Specify the class name for the custom icon
    html: '<div class="custom-marker w-7 h-7 bg-red rounded-3xl"></div>' // HTML content for the custom icon
  })

  const ZoomToMarker = ({ coordinates }: ZoomToMarkerProps) => {
    const map = useMap()
    map.setView(coordinates, 13) // Set the view to the marker's coordinates with a zoom level of 12
    return null
  }

  const handleMarkerClick = () => {
    setDriverDetail('syalalalalal')
  }

  const markerPositions: LatLngTuple[] = [
    [22.42734537836034, 114.20837003279368],
    [22.41786325107272, 114.2084943679594]
  ]

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

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: {
          xs: '62px',
          sm: 0
        }
      }}
    >
      <Box sx={{ width: '70%', height: '100%', marginTop: '-32px' }}>
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
                mouseover: () => handleMarkerClick(), // Set hovered marker index
                mouseout: () => setDriverDetail('') // Reset hovered marker index
                //click: () => handleMarkerClick()
              }}
            />
          ))}
        </MapContainer>
      </Box>
      <Box sx={{ width: '50%', height: '100%', marginTop: '-32px' }}>
        <div>{driverDetail}</div>
      </Box>
    </Box>
  )
}

export default LogisticDashboard
