import axios from 'axios';
import { localStorgeKeyName } from '../constants/constant';
import { ADD_TENANT } from '../constants/requests';
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
  } catch (e) {
    console.error('Insert tenant Failed:', e);
  }
}