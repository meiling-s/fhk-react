import { LOGIN } from '../constants/requests'
import axiosInstance from '../constants/axiosInstance'
import { LoginItem } from '../interfaces/account'
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs'
import { STATUS_CODE } from '../constants/constant'



export const login = async (item: LoginItem) => {
  const axiosConfig = Object.assign({}, LOGIN)
  // axiosConfig.url = LOGIN.url+`/${item.realm}/`+"login";
  axiosConfig.url = LOGIN.url

  try {
    const response = await axiosInstance({
      baseURL: window.baseURL.account,
      ...axiosConfig,
      data: {
        loginId: item.username,
        password: item.password
      }
    })
    console.log(response, 'response')
    // console.log('Login user Success:', JSON.stringify(response.data))
    if (response?.status === 200) {
      return {
        access_token: response.data?.access_token,
        refresh_token: response.data?.refresh_token,
        username: response.data?.username,
        status: response.status,
        // 20240129 add function list daniel keung start
        functionList: response.data?.functionList,
        realm: response.data?.realm,
        // 20240129 add function list daniel keung end
      }
    } 
      
  } catch (e: any) {
    throw(e)
    // this function for handling error code to do action for user
    // if (e?.response) {
    //   // console.error('Login user Failed with msg 1:', e.response.data);
    //   //handling error msg 
    //   if(e?.response?.status === STATUS_CODE[503]){
    //     return e?.response?.status 
    //   }
    //   const response = e.response.data.message
    //   const errMsgString = removeNonJsonChar(response)
    //   const errMsgJSON = JSON.parse(errMsgString);
    //   if(errMsgJSON.message){
    //     const errSecondInnerString = removeNonJsonChar(errMsgJSON.message)
    //     try {
    //       const result = JSON.parse(errSecondInnerString);
    //       return result.errorCode 
    //     } catch(error){
    //       return e.response.data.status
    //     }
       
    //   }else {
    //     return errMsgJSON.errorCode
    //   }
    // } else {
    //   throw(e)
    // }
  }
}
