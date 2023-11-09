import axios from 'axios';
import { localStorgeKeyName } from '../constants/constant';
import { ADD_TENANT, GET_ALL_TENANT, GET_TENANT_BY_TENANT_ID, UPDATE_TENANT_REGISTER } from '../constants/requests';
import { RegisterItem, Tenant } from '../interfaces/account';
import { AXIOS_DEFAULT_CONFIGS } from '../constants/configs';

axios.defaults.baseURL = AXIOS_DEFAULT_CONFIGS.baseURL;

//require Authorization token
export const createInvitation = async (item: Tenant) => {
  console.log(`Token: ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`);

  try {
    const response = await axios({
      ...ADD_TENANT,
      data: item,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
      },
    });
    console.log('Insert tenant success:', JSON.stringify(response.data));
    return response
  } catch (e) {
    console.error('Insert tenant Failed:', e);
    return null;
  }
}

export const getAllTenant = async () => {
  
  try {
    const response = await axios({
      ...GET_ALL_TENANT,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(localStorgeKeyName.keycloakToken)}`,
      },
    });
    console.log('Get all tenant success:', JSON.stringify(response.data));
    return response
  } catch (e) {
    console.error('Get all tenant failed:', e);
    return null;
  }

}

//Don't require Authorization token
export const getTenantById = async (tenantId: string) => {

  const axiosConfig = GET_TENANT_BY_TENANT_ID;
  axiosConfig.url = GET_TENANT_BY_TENANT_ID.url+`/${tenantId}`;
  
  try {
    const response = await axios({
      ...axiosConfig
    });
    console.log('Get tenant by id success:', JSON.stringify(response.data));
    return response
  } catch (e) {
    console.error('Get tenant by id failed:', e);
    return null;
  }

}

export const updateTenantRegInfo = async (item: RegisterItem, inviteId: string) => {

  const axiosConfig = UPDATE_TENANT_REGISTER;
  axiosConfig.url = UPDATE_TENANT_REGISTER.url+`/${inviteId}`;
  
  try {
    const response = await axios({
      ...axiosConfig,
      data: item
    });
    console.log('Tenant register info update success:', JSON.stringify(response.data));
    return response
  } catch (e) {
    console.error('Tenant register info update failed:', e);
    return null;
  }

}