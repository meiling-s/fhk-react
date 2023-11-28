import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../index.css";
import L, { Icon } from "leaflet";
import { useEffect, useState } from "react";
import { collectionPoint } from "../interfaces/collectionPoint";
import { useNavigate } from "react-router-dom";
import { Position } from "../interfaces/map";

function MyMap({
  collectionPoints,
  hoveredCard
}: { collectionPoints: collectionPoint[],hoveredCard:Position|null }) {

  const navigate = useNavigate();

  const handleMarkerClick = (col: collectionPoint) => {
    navigate("/collector/editCollectionPoint", { state: col })
  };

  const FlyToMarker = ({ hoveredCard }: { hoveredCard: Position | null }) => {
    const map = useMap();
      if (hoveredCard) {
        const { lat, lon } = hoveredCard;
        map.flyTo([lat, lon], 16, { duration: 2 });
      }
    return null;
  };
  var color: string;


  return (
    <MapContainer center={[22.4241897, 114.2117632]} zoom={12} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {collectionPoints.map((collectionPoint) => {
        switch (collectionPoint.colPointTypeId) {
          case 'CPT00001':
            color = 'abcdef';
            break;
          case 'CPT00002':
            color = '2ecc71';
            break;
          case 'CPT00003':
            color = 'e85141';
            break;
        }
        var location = JSON.parse("[" + collectionPoint.gpsCode + "]");

        return (
          <Marker
            key={Math.random()}
            position={[
              location[0],
              location[1],
            ]}
            icon={
              new Icon({
                iconUrl: `http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}&chf=a,s,ee00FFFF`,
                iconSize: [28, 35],
              })
            }
            eventHandlers={{
              click: () => handleMarkerClick(collectionPoint),
            }}
          >
            <Popup>{collectionPoint.address}</Popup>
            <FlyToMarker hoveredCard={hoveredCard} />
          </Marker>
        );
      })}
    </MapContainer>
  );
}
export default MyMap;