import { MapContainer, Marker, TileLayer,Popup} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../index.css";
import { Icon } from "leaflet";
import { CollectionPointType } from "../utils/collectionPointType";

const MyMap = ({
  collectionPoints,
}: {
  collectionPoints: CollectionPointType[];
}) => {
    
  return (
    
    <MapContainer center={[22.3193, 114.1694]} zoom={13} zoomControl={false}  >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {collectionPoints.map((collectionPoint) => (
        <Marker
          position={[
            collectionPoint.collectionLatitude.latitude,
            collectionPoint.collectionLatitude.longitude,
          ]}
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
    </MapContainer>

  );
};

export default MyMap;