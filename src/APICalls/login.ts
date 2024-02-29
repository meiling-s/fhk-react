import axios from 'axios'
import { LOGIN } from '../constants/requests'
import { LoginItem } from '../interfaces/account'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'

const request = axios.create({
  baseURL: AXIOS_DEFAULT_CONFIGS.baseURL.account
})

const removeNonJsonChar = (dataString:  string) => {
  return dataString.substring(dataString.indexOf('{'), dataString.lastIndexOf('}') + 1);
}

export const login = async (item: LoginItem) => {
  const axiosConfig = Object.assign({}, LOGIN)
  // axiosConfig.url = LOGIN.url+`/${item.realm}/`+"login";
  axiosConfig.url = LOGIN.url

  try {
    const response = await request({
      ...axiosConfig,
      data: {
        loginId: item.username,
        password: item.password
      }
    })
    console.log('Login user Success:', JSON.stringify(response.data))
    if (response.status === 200) {
      return {
        access_token: response.data?.access_token,
        username: response.data?.username,
        status: response.status,
        // 20240129 add function list daniel keung start
        functionList: response.data?.functionList,
        realm: response.data?.realm,
        // 20240129 add function list daniel keung end
      }
    } 
      
  } catch (e: any) {
    if (e.response) {
      console.error('Login user Failed with msg:', e.response.data);
      //handling error msg 
      const response = e.response.data.message
      const errMsgString = removeNonJsonChar(response)
      const errMsgJSON = JSON.parse(errMsgString);
      //debugger;
      if(errMsgJSON.message){
        const errSecondInnerString = removeNonJsonChar(errMsgJSON.message)
        const result = JSON.parse(errSecondInnerString);
        return result.errorCode 
        
      }else {
        return errMsgJSON.errorCode
      }
    } else {
      console.error('Login user Failed 2:', e);
    }
  }
}
