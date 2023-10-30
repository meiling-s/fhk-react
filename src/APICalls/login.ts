import { LOGIN } from '../constants/requests';
import { LoginItem } from '../interfaces/account';
import axios from './authAxios'
// import axios from 'axios'

export const login = async(item: LoginItem) => {
    try {
        const response = await axios({
            ...LOGIN,
            data: item,
        });
        if (response.status === 200) {
            return response.data?.access_token;
        }
        console.log("Login user Success:", JSON.stringify(response.data));
    } catch (e) {
        console.error('Login user Failed:', e);
    }
}