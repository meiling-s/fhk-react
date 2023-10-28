import axios, { AxiosRequestConfig } from 'axios';
 
const axiosConfig: AxiosRequestConfig = {
  baseURL: "http://localhost:8000/",
  headers: {
    'Content-Type': 'application/json'
  }
};
 
export const formatAxiosConfig = (
  token?: string,
  others?: AxiosRequestConfig<any>
): AxiosRequestConfig<any> => {
  const headers = { ...others?.headers, ...(token && { Authorization: `Bearer ${token}` }) };
  delete others?.headers;
  return {
    headers,
    ...others
  };
};
 
const instance = axios.create(axiosConfig);
 
export default instance;