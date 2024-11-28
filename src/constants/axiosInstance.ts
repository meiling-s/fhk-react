import axios from 'axios'
import { STATUS_CODE, localStorgeKeyName } from '../constants/constant'
import { createUserActivity } from '../APICalls/userAccount'
import { UserActivity } from '../interfaces/common'
import { returnApiToken } from '../utils/utils'
const ipAddress = localStorage.getItem('ipAddress')
const { loginId } = returnApiToken()

const __isDebug = false
let expiredAccessToken = false

const axiosInstance = axios.create()
const refreshTokenAxiosInstance = axios.create({
  baseURL: window.baseURL?.account
})

export const cleanAxiosInstance = axios.create()

export const parseJwtToken = (token: string, tokenPart: number) => {
  try {
    return JSON.parse(atob(token.split('.')[tokenPart]))
  } catch (e) {
    console.log(e)
  }
}

const isTokenExpired = (authToken: string) => {
  // this case if when the user is not yet logged in
  // return false if access token in localStorage is not yet initialized
  if (authToken === '') return false
  const decodedToken = parseJwtToken(authToken, 1)
  const currentTime = (Date.now() + 30000) / 1000
  // For ease of testing, simulated tokens expire
  // console.log('Token expiration time: ' + (decodedToken.exp - currentTime - 7130))
  return decodedToken.exp < currentTime
}

const isRefreshTokenExpired = (refreshToken: string) => {
  if (refreshToken === '') return false

  const decodedToken = parseJwtToken(refreshToken, 1)
  const currentTime = (Date.now() + 30000) / 1000
  return decodedToken.exp < currentTime
}

axiosInstance?.interceptors.request.use(
  async (config) => {
    const accessToken =
      localStorage.getItem(localStorgeKeyName.keycloakToken) || ''
    config.headers.AuthToken = accessToken

    // Check if the access token is expired
    if (
      config.url !== '/api/v1/administrator/login' &&
      isTokenExpired(accessToken) &&
      !expiredAccessToken
    ) {
      try {
        __isDebug && console.log('Access token expired, refreshing...')

        // Check if the refresh token is expired
        const refreshToken =
          localStorage.getItem(localStorgeKeyName.refreshToken) || ''
        if (!isRefreshTokenExpired(refreshToken)) {
          expiredAccessToken = true

          const newAccessToken = await __getNewAccessToken() // Retrieve the new access token
          config.headers.AuthToken = newAccessToken // Update the request headers with the new access token
          __isDebug && console.log('Access token refreshed successfully.')
        } else if (isRefreshTokenExpired(refreshToken)) {
          // Handle refresh token expired scenario
          // For example, redirect to login page
          __isDebug &&
            console.log('Refresh token expired. Redirecting to login page...')
          if (ipAddress) {
            const userActivity: UserActivity = {
              operation: 'Logout',
              ip: ipAddress,
              createdBy: loginId,
              updatedBy: loginId
            }
            createUserActivity(loginId, userActivity)
          }
          localStorage.clear()
          window.location.href = '/'
        }
      } catch (error) {
        throw error
      }
    }
    return config
  },
  async (error) => {
    return Promise.reject(error)
  }
)

const __apiNewToken = async () => {
  try {
    __isDebug && console.log('__apiNewToken started')
    const refreshToken =
      localStorage.getItem(localStorgeKeyName.refreshToken) || ''
    const req = await refreshTokenAxiosInstance.post(
      `/api/v1/administrator/refreshToken`,
      { refreshToken: refreshToken }
    )
    const data = req.data

    localStorage.setItem(localStorgeKeyName.keycloakToken, data.access_token)
    localStorage.setItem(localStorgeKeyName.refreshToken, data.refresh_token)
    expiredAccessToken = false

    __isDebug && console.log('__apiNewToken finished')
    return data.access_token
  } catch (e: any) {
    if (e?.response?.status === STATUS_CODE[500]) {
      if (ipAddress) {
        const userActivity: UserActivity = {
          operation: 'Logout',
          ip: ipAddress,
          createdBy: loginId,
          updatedBy: loginId
        }
        createUserActivity(loginId, userActivity)
      }
      localStorage.clear()
      window.location.href = '/'
    }
    console.log('__apiNewToken failed')
    //   throw e
  }
}

// This is a trikcy way to by-pass multiple request with > 1 request failure and force logout
// TODO: implement in a way that only 1 refresh token request is triggered with retry mechanism
const __getNewAccessToken = async () => {
  await __apiNewToken()
  return localStorage.getItem(localStorgeKeyName.keycloakToken) || ''
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh the access token
        const newAccessToken = await __getNewAccessToken();

        if (newAccessToken) {
          originalRequest.headers.AuthToken = newAccessToken;

          return axiosInstance(originalRequest);
        } else {
          console.log('Failed to refresh token. Redirecting to login.');
          localStorage.clear();
          window.location.href = '/';
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);

        localStorage.clear();
        window.location.href = '/';
      }
    }

    // Reject any other errors
    return Promise.reject(error);
  }
);

export default axiosInstance
