interface Coordinates {
  latitude: number;
  longitude: number;
}

export type CollectionPointType = {
  collectionName:string;
  collectionType:string;
  collectionAddress:string;
  collectionLatitude:Coordinates;
  markerColor:string;
  collectionFontColor:string; 
  collectionBgColor:string
}