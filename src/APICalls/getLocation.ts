import axios from 'axios';

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

export const getLocation = (searchValue: string) => {
  const url = `${NOMINATIM_BASE_URL}q=${searchValue}&format=json&addressdetails=1&polygon_geojson=0`;
  return axios.get(url);
};