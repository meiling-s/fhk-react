
import { useEffect, useState } from "react";
import { CheckIn, CheckinDetail } from "../interfaces/checkin";
import { createContainer } from 'unstated-next';
import { getAllCheckInRequests } from "../APICalls/Collector/warehouseManage";

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
const CheckInRequestContainer = createContainer(CheckInRequest);

export default CheckInRequestContainer;
