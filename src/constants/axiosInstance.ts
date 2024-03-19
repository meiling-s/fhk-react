import axios from "axios";
import { localStorgeKeyName } from '../constants/constant'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import { returnApiToken } from "../utils/utils";



const authToken = () => {
   return localStorage.getItem(localStorgeKeyName.keycloakToken) || ''
    // const token = returnApiToken()
    // return token.authToken
};
const refreshToken = () => {
    return localStorage.getItem(localStorgeKeyName.refreshToken) || ''
}

const axiosInstance = axios.create({
    headers: {
        'AuthToken': authToken()
    },
})

const refreshTokenAxiosInstance = axios.create({
    baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.account,
    headers: {
        AuthToken: refreshToken()
    },
})

export const parseJwtToken = (token: string, tokenPart: number) => {
    try {
        return JSON.parse(atob(token.split('.')[tokenPart]));
    } catch (e) {
        console.log(e);
    }
}

const isTokenExpired = () => {
    // this case if when the user is not yet logged in
    // return false if access token in localStorage is not yet initialized
    if (authToken() === '') return false;
    const decodedToken = parseJwtToken(authToken(), 1);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp < currentTime;
}

const getNewToken = async () => {
    try {
        const req = await refreshTokenAxiosInstance.post(`/api/v1/administrator/refreshToken/${refreshToken()}`);

        const data = req.data;

        localStorage.setItem(localStorgeKeyName.keycloakToken, data.access_token);
        localStorage.setItem(localStorgeKeyName.refreshToken, data.refresh_token);

        return data.access_token;
    } catch (e: any) {
        console.log('Failed to refresh the token: ', e.response.data);
        localStorage.clear();
        window.location.href = '/';
    }
}

axiosInstance.interceptors.request.use(
    async (config) => {
        console.log('isTokenExpired: ' +  isTokenExpired())
        if (isTokenExpired()) {
            const newAccessToken = await getNewToken();
            config.headers.AuthToken = `${newAccessToken}`;
        }
        
        return config;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
        
            const newAccessToken = await getNewToken();

            originalRequest.headers.AuthToken = newAccessToken;
            return axios(originalRequest);
        }
        
        if (error.response.status === 403) {
            const newAccessToken = await getNewToken();
        
            originalRequest.headers.AuthToken = newAccessToken;
            return axios(originalRequest);
        }
        
        if (error.response.status === 401) {
            localStorage.clear();
            window.location.href = '/';
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;