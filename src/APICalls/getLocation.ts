import axios from 'axios';
 
const GEOCODING_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?";
const API_KEY = "AIzaSyAMP8qUxbhEYGxwF9veifN7ciMUZcZOPsg"
 
export const getLocation = async(searchValue: string) => {
  const language = /[^\x00-\x7F]/.test(searchValue) ? 'zh-CN' : 'en';
  const url = `${GEOCODING_BASE_URL}address=${searchValue}&language=${language}&key=${API_KEY}`;
  const location =  await axios.get(url);
  return location
};