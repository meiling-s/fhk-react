// @ts-nocheck
import { MapContainer, Marker, TileLayer, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../index.css'
import { Icon } from 'leaflet'
import { useEffect, useState } from 'react'
import { collectionPoint } from '../interfaces/collectionPoint'
import { useNavigate } from 'react-router-dom'
import { Position } from '../interfaces/map'

function MyMap({
  collectionPoints,
  hoveredCard
}: {
  collectionPoints: collectionPoint[]
  hoveredCard: Position | null
}) {
  const navigate = useNavigate()

  const handleMarkerClick = (col: collectionPoint) => {
    navigate('/collector/editCollectionPoint', { state: col })
  }

  const FlyToMarker = ({ hoveredCard }: { hoveredCard: Position | null }) => {
    const map = useMap()
    if (hoveredCard) {
      const { lat, lon } = hoveredCard
      map.flyTo([lat, lon], 16, { duration: 2 })
    }
    return null
  }
  var color: string

  return (
    <MapContainer
      center={[22.4241897, 114.2117632]}
      zoom={12}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {collectionPoints.map((collectionPoint) => {
        switch (collectionPoint.colPointTypeId) {
          case 'CPT00001':
            color = '#2ecc71'
            break
          case 'CPT00002':
            color = '#e85141'
            break
          case 'CPT00003':
            color = '#71c9ff'
            break
          default:
            color = '#000'
        }
        var location =
          collectionPoint.gpsCode.length > 0 ? collectionPoint.gpsCode : [0, 0]
        // var location = JSON.parse("[" + collectionPoint.gpsCode + "]");

        return (
          <Marker
            key={Math.random()}
            position={[location[0], location[1]]}
            icon={
              new Icon({
                iconUrl: `data:image/svg+xml;base64,${btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="35" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${color}"/>
                  </svg>
                `)}`,
                iconSize: [28, 35]
              })
            }
            eventHandlers={{
              click: () => handleMarkerClick(collectionPoint)
            }}
          >
            <Popup>{collectionPoint.address}</Popup>
            <FlyToMarker hoveredCard={hoveredCard} />
          </Marker>
        )
      })}
    </MapContainer>
  )
}
export default MyMap
