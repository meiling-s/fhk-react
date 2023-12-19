import React, { useEffect, useState } from 'react'
import CreatePickupOrder from './CreatePickupOrder'
import { useLocation, useNavigate } from 'react-router-dom';
import { CreatePicoDetail, EditPo, PickupOrder } from '../../../interfaces/pickupOrder';
import PickupOrderCreateForm from '../../../components/FormComponents/PickupOrderCreateForm';
import { useFormik } from 'formik';
import { editPickupOrder, getAllPickUpOrder } from '../../../APICalls/Collector/pickupOrder/pickupOrder';
import CheckInRequestContainer from '../../../contexts/CheckInRequestContainer';
import { useContainer } from 'unstated-next';


const EditPickupOrder = () => {
    const navigate = useNavigate();
    const {state} = useLocation();
    const [addRow, setAddRow] = useState<CreatePicoDetail[]>([]);
    const poInfo: PickupOrder = state;
    const { initPickupOrderRequest } = useContainer(CheckInRequestContainer);

    const updatePickupOrder = useFormik({
        initialValues: {
          picoType: "string",
          effFrmDate: "2023-12-12",
          effToDate: "2023-12-12",
          routineType: "string",
          routine: ["string"],
          logisticId: "string",
          logisticName: "hello",
          vehicleTypeId: "string",
          platNo: "string",
          contactNo: "string",
          status: "CREATED",
          reason: "string",
          normalFlg: true,
          approvedAt: "2023-12-12T02:17:30.062Z",
          rejectedAt: "2023-12-12T02:17:30.062Z",
          approvedBy: "string",
          rejectedBy: "string",
          contractNo: "",
          updatedBy: "string",
          
        },
    
        onSubmit: async (values: EditPo) => {
          
          alert(JSON.stringify(values, null, 2));
          
          const result = await editPickupOrder(poInfo.picoId, values);
          
          const data = result?.data;
          if (data) {
            console.log("all collection point: ", data);
            await initPickupOrderRequest();
            navigate("/collector/PickupOrder",{ state: "created" });    
          
        }else{
          alert('fail to edit pickup order')
        }
        },
      });
      useEffect(() => {
        if (poInfo) {
          console.log('selectedPo:', poInfo);
          updatePickupOrder.setValues({
            picoType: poInfo.picoType,
            effFrmDate: poInfo.effFrmDate,
            effToDate: poInfo.effToDate,
            routineType: poInfo.routineType,
            routine: poInfo.routine,
            logisticId: poInfo.logisticId,
            logisticName: poInfo.logisticName,
            vehicleTypeId: poInfo.vehicleTypeId,
            platNo: poInfo.platNo,
            contactNo: poInfo.contactNo,
            status: "CREATED",
            reason: poInfo.reason,
            normalFlg: true,
            approvedAt: poInfo.approvedAt.toString(),
            rejectedAt: poInfo.rejectedAt.toString(),
            approvedBy: poInfo.approvedBy,
            rejectedBy: poInfo.rejectedBy,
            contractNo: poInfo.contractNo,
            updatedBy: "Admin",
          });
        }
      }, [poInfo, updatePickupOrder.setValues]);
     
  return (
    <PickupOrderCreateForm selectedPo={poInfo} title={'修改運單'} formik={updatePickupOrder}  setState={setAddRow} state={addRow} />
  )
}

export default EditPickupOrder