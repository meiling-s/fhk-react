import axios from './authAxios'
// import axios from 'axios'

export async function login(userName: string, password: string, realm: string){

    const result = await axios.post("api/v1/login",JSON.stringify({
        "userName": userName,
        "password": password,
        "realm": realm
    })).then((res)=>{
        console.log("login sus ");
        return res;
    }).catch((error) => {
        console.log("login err: ", error);
        return error;
    });

    if(result.status == 200){
        //console.log(result.data?.access_token);
        return result.data?.access_token;
    }else{
        return null;
    }

}