
import { useEffect, useState } from "react";
import { getAllCheckInRequests } from "../APICalls/Collector/warehouseManage";
import { CheckIn } from "../interfaces/checkin";
import { createContainer } from 'unstated-next';

const  CheckInRequest = () => {
  const [checkInRequest, setCheckInRequest] = useState<CheckIn[]>();
  


  useEffect(() => {
    initCheckInRequest();
  }, []);
 
  const initCheckInRequest = async () => {
    const result = await getAllCheckInRequests();
    const data = result?.data.content;
    if (data && data.length > 0) {
      console.log("all checkIn request ", data);
      setCheckInRequest(data);
  };
  

 
}
return {
    checkInRequest
  }

}
const CheckInRequestContext = createContainer(CheckInRequest);

export default CheckInRequestContext;
