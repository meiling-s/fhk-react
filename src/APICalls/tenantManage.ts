import { localStorgeKeyName } from '../constants/constant';
import axios from './authAxios'
//import axios from 'axios'

type invitation = {
    TChiName: String,
    SChiName: String,
    EngName: String,
    type: String,
    BRNo: String,
    remark: String
}

export async function createInvitation(data: invitation, token: string){
    // console.log("config: ",axios.defaults.headers)
    // const result = await axios.post("api/v1/tenant/astd/addTenant",data,{
    //     headers: headers
    // }).then((res)=>{
    //     console.log("response: ",res);
    //     return res;
    // }).catch((error) => {
    //     console.log("Error: ", error);
    //     return error;
    // });
    // if(result.status == 200){
    //     return result.data?.sid
    // }else{
    //     return null
    // }

    const headers = {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
    }

    console.log("token: ",token);

    const result = await axios.post("api/v1/tenant/astd/addTenant",data,{headers: headers}).then((res)=>{
      console.log("response: ",res);
      return res;
    }).catch((error) => {
      console.log("Error: ", error);
      return error;
    });

  if(result.status == 200){
      //console.log(result.data?.access_token);
      return result.data?.access_token;
  }else{
      return null;
  }

    

    // let config = {
    //     method: 'post',
    //     maxBodyLength: Infinity,
    //     url: 'http://localhost:8000/api/v1/tenant/astd/addTenant',
    //     headers: {
    //       'Content-Type': 'application/json', 
    //       'Authorization': 'Bearer '+token
    //     },
    //     data : data
    //   };
      
    //   axios.request(config)
    //   .then((response) => {
    //     console.log(JSON.stringify(response.data));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
}