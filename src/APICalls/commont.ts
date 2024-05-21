import axiosInstance from "../constants/axiosInstance"
import { GET_SYSTEM_MAINTENANCE_PAGE } from "../constants/requests"

//getSystemMaintenanceStatus
export const getSystemMaintenanceStatus = async () => {
  try {

    const response = await axiosInstance({
      baseURL: 'http://localhost:8100/',
      ...GET_SYSTEM_MAINTENANCE_PAGE(),
    })
    
    return response?.data
  } catch (e) {
    console.error('getSystemMaintenanceStatus failed:', e)
    return null
  }
}