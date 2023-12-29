import { useFormik } from "formik";
import PickupOrderCreateForm from "../../../components/FormComponents/PickupOrderCreateForm";
import { createPickUpOrder, getAllPickUpOrder } from "../../../APICalls/Collector/pickupOrder/pickupOrder";
import { CreatePO, CreatePicoDetail } from "../../../interfaces/pickupOrder";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useContainer } from "unstated-next";
import CheckInRequestContainer from "../../../contexts/CheckInRequestContainer";
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next'


const CreatePickupOrder = () => {
  const navigate = useNavigate();
  const [addRow, setAddRow] = useState<CreatePicoDetail[]>([]);
  const { initPickupOrderRequest } = useContainer(CheckInRequestContainer);
  const { t } = useTranslation()

  
  const validateSchema = Yup.object().shape({
    picoType: Yup.string().required("This picoType is required"),
    effFrmDate:Yup.string().required("This effFrmDate is required"),
    effToDate: Yup.string().required("This effToDate is required"),
    routineType:Yup.string().required("This routineType is required"),    
    routine:Yup.array().required('routine is required'),          
    logisticName:Yup.string().required("This logistic is required"), 
    vehicleTypeId:Yup.string().required("This vehicleType is required"), 
    platNo:Yup.string().required("This platNo is required"),       
    contactNo:Yup.number().required("This contactNo is required"),     
    contractNo: Yup.string().required("This contractNo is required"),
    createPicoDetail: Yup.array()
    .required("This field is required")
    .test(
      "has-rows",
      "At least one Pico Detail is required",
       (value) => {
      return value.length > 0 || addRow.length > 0;
    }
    ),

  });
 
  const createPickupOrder = useFormik({
    initialValues: {
      picoType: 'ROUTINE',
      effFrmDate:"",
      effToDate: "",
      routineType:'',       
      routine:[],           
      logisticId: '',       
      logisticName:'',   
      vehicleTypeId:'',  
      platNo:'',            
      contactNo: '',   
      status:'CREATED',            
      reason:'',            
      normalFlg: true,       
      contractNo: '',       
      createdBy:'Admin', 
      updatedBy:'Admin',
      createPicoDetail:[],
    },
    validationSchema: validateSchema,   
    onSubmit: async (values:CreatePO) => {      
      values.createPicoDetail = addRow
      console.log(JSON.stringify(values, null, 2))
      const result = await createPickUpOrder(values);
      const data = result?.data;
      if (data) {
        console.log("all pickup order: ", data);
        await initPickupOrderRequest();
        navigate("/collector/PickupOrder",{ state: "created" });    
      
    }else{
      alert('fail to create pickup order')
    }
    },
  });

  return (
     <PickupOrderCreateForm formik={createPickupOrder} title={t('pick_up_order.create_pick_up_order')}  setState={setAddRow} state={addRow} />
  );
};


export default CreatePickupOrder
