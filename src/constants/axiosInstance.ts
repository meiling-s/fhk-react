import axios, { AxiosInstance, AxiosResponse } from "axios";
import { localStorgeKeyName } from '../constants/constant'

const axiosInstance = axios.create()
const refreshTokenAxiosInstance = axios.create({
    baseURL: window.baseURL.account,
})

export const parseJwtToken = (token: string, tokenPart: number) => {
    try {
        return JSON.parse(atob(token.split('.')[tokenPart]));
    } catch (e) {
        console.log(e);
    }
}

const isTokenExpired = (authToken: string) => {
    // this case if when the user is not yet logged in
    // return false if access token in localStorage is not yet initialized
    if (authToken === '') return false;
    const decodedToken = parseJwtToken(authToken, 1);
    const currentTime = Date.now() / 1000;

    // For ease of testing, simulated tokens expire
    // console.log('Token expiration time: ' + (decodedToken.exp - currentTime - 7130))
    return decodedToken.exp < currentTime;
}

const getNewToken = async () => {
    try {
        // console.log('getNewToken start')
        const refreshToken = localStorage.getItem(localStorgeKeyName.refreshToken) || ''
        const req = await refreshTokenAxiosInstance.post(`/api/v1/administrator/refreshToken/${refreshToken}`);
        const data = req.data;
        localStorage.setItem(localStorgeKeyName.keycloakToken, data.access_token);
        localStorage.setItem(localStorgeKeyName.refreshToken, data.refresh_token);
        // console.log('getNewToken finished')
        return data.access_token;
    } catch (e: any) {
        console.log('Failed to refresh the token: ', e.response.data)
        throw e
    }
}

axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem(localStorgeKeyName.keycloakToken) || ''
        config.headers.AuthToken = accessToken
        if (config.url !== '/api/v1/administrator/login' && isTokenExpired(accessToken)) {
            try {
                await getNewToken();
                config.headers.AuthToken = localStorage.getItem(localStorgeKeyName.keycloakToken) || ''   // Tricky not using the result. Instead trust the updated one in storage
            } catch (error) {
                throw error;
            }
        }
        
        return config;
    },
    async error => {
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    response => {
        return response
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await getNewToken();
            originalRequest.headers.AuthToken = localStorage.getItem(localStorgeKeyName.keycloakToken) || ''   // Tricky not using the result. Instead trust the updated one in storage
            return axios(originalRequest);
        }
        
        if (error.response.status === 403) {
            await getNewToken();
            originalRequest.headers.AuthToken = localStorage.getItem(localStorgeKeyName.keycloakToken) || ''   // Tricky not using the result. Instead trust the updated one in storage
            return axios(originalRequest);
        }
        
        if (error.response.status === 401) {
            localStorage.clear();
            window.location.href = '/';
        }
        
        return Promise.reject(error);
    }
)

export default axiosInstance;