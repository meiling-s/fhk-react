import axios from 'axios';
 
const GEOCODING_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?";
const API_KEY = "AIzaSyD_wBiPzySlPwqbmhitaGdtPLONC5mKHak"
 
export const getLocation = async(searchValue: string) => {
  const language = /[^\x00-\x7F]/.test(searchValue) ? 'zh-CN' : 'en';
  const url = `${GEOCODING_BASE_URL}address=${searchValue}&language=${language}&key=${API_KEY}`;
  const location =  await axios.get(url); // before change this code, please read message below.
  // no need to change axios to axiosInstance since we hit google maps api. (different response with our config and sending our token is prohibited by google maps and will cause another error.) - June, 4th 2024.
  return location
};