import { Alert, Box, Divider, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RecycleCard from "../RecycleCard";
import { FakeDataItem } from "../../interfaces/fakeData";
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';
import { CheckIn } from "../../interfaces/checkin";

type Shipment = {
  createDate: Date,
  sender: string,
  recipient: string,
  poNumber: string,
  stockAdjust: boolean,
  logisticsCompany: string,
  returnAddr: string,
  deliveryAddr: string,
  status: string,
  checkInId: number
}

const RequestForm = ({
  onClose,
  selectedItem,
}: {
  onClose?: () => void ;
  selectedItem?: Shipment;
}) => {
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // If the overlay is clicked (not its children), close the modal
      onClose && onClose();
    }
  };

  console.log(fakedata);

  return (
    <>
      
        <Box
          sx={localstyles.modal}
          onClick={handleOverlayClick}
        >
          <Box sx={localstyles.container}>

            <Box sx={localstyles.header}>
              <Box>
              <Typography fontSize="25px" fontWeight="bold" letterSpacing="2px">
                送入請求
              </Typography>
              <Typography fontSize="15px" color="#979797" letterSpacing="2px">
                {selectedItem?.poNumber}
              </Typography>
              </Box>
              
              <Box sx={{display:'flex',alignSelf:'center'}}>
                <IconButton onClick={onClose}>
                <KeyboardTabIcon sx={{fontSize:'30px'}}/>
                </IconButton>
              </Box>
            </Box>

            <Divider />
            <Stack spacing={2} sx={{ p: 4 }}>
              {selectedItem?.stockAdjust && (
                <Alert
                  icon={<CheckIcon fontSize="inherit" />}
                  severity="success"
                >
                  調整庫存
                </Alert>
              )}
              <Box>
                <Typography sx={localstyles.typo_header}>
                  運輸資料
                </Typography>
              </Box>

              <Box>
                <Typography sx={localstyles.typo_fieldTitle}>
                  寄件公司
                </Typography>
                <Typography sx={localstyles.typo_fieldContent}>
                  {data.sender}
                </Typography>
              </Box>

              <Box>
                <Typography sx={localstyles.typo_fieldTitle}>
                  收件公司
                </Typography>
                <Typography sx={localstyles.typo_fieldContent}>
                  {data.recipient}
                </Typography>
              </Box>

              <Box>
                <Typography sx={localstyles.typo_fieldTitle}>
                  物流公司
                </Typography>
                <Typography fontSize="20PX" letterSpacing="2px">
                  {selectedItem?.logisticsCompany}
                </Typography>
              </Box>

              <Typography sx={localstyles.typo_header}>
                回收地點資料
              </Typography>
              <Box display="flex" flexDirection="row">
                <Box sx={{flex: 1}}>
                  <Typography sx={localstyles.typo_fieldTitle}>
                    送出地點
                  </Typography>
                  <Typography fontSize="20PX" letterSpacing="2px">
                    {selectedItem?.returnAddr}
                  </Typography>
                </Box>
                <Box sx={{flex: 1, display: "flex", flexDirection: "row"}}>
                  <Box alignSelf="left" sx={{ mr: "35px" }}>
                    <ArrowForwardIcon
                      style={{ color: "#9f9f9f", fontSize: "30px" }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={localstyles.typo_fieldTitle}>
                      到達地點
                    </Typography>
                    <Typography fontSize="20PX" letterSpacing="2px">
                      {selectedItem?.returnAddr}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography sx={localstyles.typo_fieldTitle}>
                回收類別及重量
              </Typography>
              <RecycleCard
                name="袋"
                bgcolor="#e1f4ff"
                fontcolor="#66bff6"
                showImage={true}
                recycleName="報紙"
                recycleType="廢紙"
              />
              <RecycleCard
                name="盒"
                bgcolor="#f6f1dc"
                fontcolor="#c9c975"
                showImage={false}
                recycleName="鋁罐"
                recycleType="金屬"
              />
            </Stack>
          </Box>
        </Box>
     
    </>
  );
};

let localstyles = {
  modal: {
    display: "flex",
    height: "100vh",
    width: "100%",
    justifyContent: "flex-end"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "40%",
    bgcolor: "white",
    overflowY: "scroll"
  },
  header: {
    display:'flex',
    flex: 1,
    p: 4,
    justifyContent:'space-between'
  },
  content: {
    flex: 9,
    p: 4
  },
  typo_header: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#858585",
    letterSpacing: "2px",
    mt: "10px"
  },
  typo_fieldTitle: {
    fontSize: "15px",
    color: "#ACACAC",
    letterSpacing: "2px"
  },
  typo_fieldContent: {
    fontSize: "17PX",
    letterSpacing: "2px"
  }
}

export default RequestForm;
