import React from 'react'
import CreatePickupOrder from './CreatePickupOrder'
import { useLocation } from 'react-router-dom';
import { PickupOrder } from '../../../interfaces/pickupOrder';
import PickupOrderCreateForm from '../../../components/FormComponents/PickupOrderCreateForm';

const EditPickupOrder = () => {
    const {state} = useLocation();
    const poInfo: PickupOrder = state;
  return (
    <PickupOrderCreateForm selectedPo={poInfo} />
  )
}

export default EditPickupOrder