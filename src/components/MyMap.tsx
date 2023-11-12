import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../index.css";
import L, { Icon } from "leaflet";
import { useEffect, useState } from "react";
import { collectionPoint } from "../interfaces/collectionPoint";

const MyMap = ({
  collectionPoints,

}: {
  collectionPoints: collectionPoint[];

}) => {

  // var color

  // switch(collectionType){
  //   case "固定服務點":
  //     color = 'abcdef'
  //     break;
  //   case "上門服務點":
  //     color = 'e85141'
  //     break;
  //   case "流動服務點":
  //     color = '2ecc71'
  //     break;
  //   default:
  //     color = 'ffffff'
  // }


  // useEffect(() => {

  //   const lat = localStorage.getItem('selectedLatitude'??'0');
  //   const long = localStorage.getItem('selectedLongtitude'??'0');
  //   if(lat && long && parseFloat(lat) && parseFloat(long)){
  //     setLocation([parseFloat(lat),parseFloat(long)]);
  //   }
  // }, []);


  const handleMarkerClick = () => {
    // Handle the click event here

  };
  var color: string;


  return (
    <MapContainer center={[22.4241897, 114.2117632]} zoom={12} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {collectionPoints.map((collectionPoint) => {
        console.log("test", collectionPoint)
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

        return (
          <Marker
            key={Math.random()}
            position={[
              collectionPoint.gpsCode[0],
              collectionPoint.gpsCode[1],
            ]}
            icon={
              new Icon({
                iconUrl: `http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}&chf=a,s,ee00FFFF`,
                iconSize: [28, 35],
              })
            }
            eventHandlers={{
              click: () => handleMarkerClick(),
            }}
          >
            <Popup>{collectionPoint.address}</Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
export default MyMap;