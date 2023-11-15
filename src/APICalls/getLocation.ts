import axios from 'axios';
 
const GEOCODING_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?";
const API_KEY = "AIzaSyAMP8qUxbhEYGxwF9veifN7ciMUZcZOPsg"
 
export const getLocation = async(searchValue: string) => {
  const url = `${GEOCODING_BASE_URL}address=${searchValue}&key=${API_KEY}`;
  const location =  await axios.get(url);
  return location
};