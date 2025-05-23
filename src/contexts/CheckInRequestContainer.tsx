import { useEffect, useState } from "react";
import { CheckIn, CheckinDetail } from "../interfaces/checkin";
import { createContainer } from 'unstated-next';
import { getAllCheckInRequests } from "../APICalls/Collector/warehouseManage";
import { PickupOrder } from "../interfaces/pickupOrder";
import { getAllPickUpOrder } from "../APICalls/Collector/pickupOrder/pickupOrder";

const CheckInRequest = () => {
  const [checkInRequest, setCheckInRequest] = useState<CheckIn[]>();
  const [pickupOrder,setPickupOrder] = useState<PickupOrder[]>();

  useEffect(() => {
    initCheckInRequest();
    initPickupOrderRequest();
  }, []);
 
  const initCheckInRequest = async () => {
    const result = await getAllCheckInRequests(0, 10);
    const data = result?.data.content;
    // console.log("checkin request content: ", data);
    if (data && data.length > 0) {
      // console.log("all checkIn request ", data);
      setCheckInRequest(data);
    }
  };

  const updateCheckInRequest= async () => {
    // console.log("updateCheckInRequest")
    await initCheckInRequest
  }

  //pickuporder
  const initPickupOrderRequest = async () => {
    const result = await getAllPickUpOrder(0, 10);
    const data = result?.data.content;
    // console.log("pickup order content: ", data);
    if (data && data.length > 0) {
      console.log("all pickup orders ", data);
      setPickupOrder(data);
    }
  };
  
  return {
    initPickupOrderRequest,
    checkInRequest,
    pickupOrder, 
    updateCheckInRequest
  };
};

const CheckInRequestContainer = createContainer(CheckInRequest);

export default CheckInRequestContainer;
