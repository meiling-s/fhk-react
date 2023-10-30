import axios from 'axios';
import { localStorgeKeyName } from '../constants/constant';
import { ADD_TENANT, GET_TENANT_BY_TENANT_ID } from '../constants/requests';
import { Tenant } from '../interfaces/account';

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
    console.error('Get tenant by id Failed:', e);
    return null;
  }

}