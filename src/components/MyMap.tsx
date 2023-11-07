import { MapContainer, Marker, TileLayer,Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../index.css";
import { Icon } from "leaflet";
import { CollectionPointType } from "../utils/collectionPointType";
import { useEffect, useState } from "react";
import { styles } from "../constants/styles";
import { Box } from "@mui/material";

const MyMap = ({
  collectionPoints,
}: {
  collectionPoints: CollectionPointType[];
}) => {
  const [location,setLocation] = useState<number[]>([0,0]);
 
 console.log(location)

  useEffect(() => {

    const lat = localStorage.getItem('selectedLatitude'??'0');
    const long = localStorage.getItem('selectedLongtitude'??'0');
    if(lat && long && parseFloat(lat) && parseFloat(long)){
      setLocation([parseFloat(lat),parseFloat(long)]);
    }
  }, []);
  
  
  return (
    
    <MapContainer center={[22.3193, 114.1694]} zoom={13} zoomControl={false}  >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {collectionPoints.map((collectionPoint) => (
        <Marker
          key={Math.random()}
          position={
            [collectionPoint.collectionLatitude.latitude,
            collectionPoint.collectionLatitude.longitude]
          }
          icon={
            new Icon({
              iconUrl: `http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${collectionPoint.markerColor}&chf=a,s,ee00FFFF`,
              iconSize: [28, 35],
            })
          }
        >
            <Popup>
                {collectionPoint.collectionAddress}
            </Popup>
        </Marker>
      ))}
      <Marker position={[location[0],location[1]]}    icon={
            new Icon({
              iconUrl: `http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|abcdef&chf=a,s,ee00FFFF`,
              iconSize: [28, 35],
            })
          }/>
    </MapContainer>

  );
};

export default MyMap;