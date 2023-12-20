import { useFormik } from "formik";
import PickupOrderCreateForm from "../../../components/FormComponents/PickupOrderCreateForm";
import { createPickUpOrder, getAllPickUpOrder } from "../../../APICalls/Collector/pickupOrder/pickupOrder";
import { CreatePO, CreatePicoDetail } from "../../../interfaces/pickupOrder";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useContainer } from "unstated-next";
import CheckInRequestContainer from "../../../contexts/CheckInRequestContainer";
import * as Yup from 'yup';


const CreatePickupOrder = () => {
  const navigate = useNavigate();
  const [addRow, setAddRow] = useState<CreatePicoDetail[]>([]);
  const { initPickupOrderRequest } = useContainer(CheckInRequestContainer);

  
  const validateSchema = Yup.object().shape({
    picoType: Yup.string().required("This field is required"),
    // effFrmDate:"",
    // effToDate: "",
    // routineType:'',       
    // routine:[],           
    // logisticId: '',       
    logisticName:Yup.string().required("This field is required"), 
    vehicleTypeId:Yup.string().required("This field is required"), 
    platNo:Yup.string().required("This field is required"),       
    contactNo:Yup.number().required("This field is required"),
    // status:'CREATED',            
    // reason:'',            
    // normalFlg: true,       
    contractNo: Yup.string().required("This field is required"),
    // createdBy:'Admin', 
    // updatedBy:'Admin',
    
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
      picoType: 'AD_HOC',
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
      alert(result);
      
      const data = result?.data;
      if (data) {
        console.log("all collection point: ", data);
        await initPickupOrderRequest();
        navigate("/collector/PickupOrder",{ state: "created" });    
      
    }else{
      alert('fail to create pickup order')
    }
    },
  });

  return (
     <PickupOrderCreateForm formik={createPickupOrder} title={'建立運單'}  setState={setAddRow} state={addRow} />
  );
};


export default CreatePickupOrder;
