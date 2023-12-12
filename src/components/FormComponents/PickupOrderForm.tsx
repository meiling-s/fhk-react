import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { styles } from "../../constants/styles";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { DELETE_OUTLINED_ICON } from "../../themes/icons";
import CustomField from "./CustomField";
import StatusCard from "../StatusCard";
import theme from "../../themes/palette";
import PickupOrderCard from "../PickupOrderCard";
import {
  PickupOrder,
  PickupOrderDetail,
  Row,
} from "../../interfaces/pickupOrder";
import CheckInRequestContainer from "../../contexts/CheckInRequestContainer";
import { useContainer } from "unstated-next";
import { useNavigate } from "react-router-dom";

const PickupOrderForm = ({
  onClose,
  selectedRow,
}: {
  onClose?: () => void;
  selectedRow: Row | null;
}) => {
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // If the overlay is clicked (not its children), close the modal
      onClose && onClose();
    }
  };
  const navigate = useNavigate();

  const handleRowClick = (po:PickupOrder) => {
    navigate("/collector/editPickupOrder",{ state: po })
  };

  const { pickupOrder } = useContainer(CheckInRequestContainer);
  const [selectedPickupOrder, setSelectedPickupOrder] = useState<PickupOrder>();
  const [pickupOrderDetail, setPickUpOrderDetail] = useState<PickupOrderDetail[]>();

  console.log(selectedPickupOrder);

  useEffect(() => {
    if (selectedRow) {
      const poDetail = pickupOrder?.find((po) => po.picoId === selectedRow.id);

      if (poDetail) {
        setSelectedPickupOrder(poDetail);
        setPickUpOrderDetail(poDetail?.pickupOrderDetail);
      }
    }
  }, [selectedRow]);

  

  
  return (
    <>
      <Box sx={localstyles.modal} onClick={handleOverlayClick}>
        <Box sx={localstyles.container}>
          <Box sx={{ display: "flex", flex: "1", p: 4, alignItems: "center" }}>
            <Box>
              <Typography sx={styles.header4}>运单详情</Typography>
              <Typography sx={styles.header3}>{selectedPickupOrder?.picoId}</Typography>
            </Box>
            <Box sx={{ display: "flex", ml: "20px" }}>
              <StatusCard status={selectedPickupOrder?.status} />
            </Box>
            <Box sx={{ marginLeft: "auto" }}>
              <Button
                variant="outlined"
                startIcon={<DriveFileRenameOutlineIcon />}
                sx={localstyles.button}
                onClick={() => selectedPickupOrder&&handleRowClick(selectedPickupOrder)}
              >
                修改
              </Button>
              <Button
                variant="outlined"
                startIcon={<DELETE_OUTLINED_ICON />}
                sx={localstyles.button}
              >
                删除
              </Button>
              <IconButton sx={{ ml: "25px" }} onClick={onClose}>
                <KeyboardTabIcon sx={{ fontSize: "30px" }} />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <Stack spacing={2} sx={localstyles.content}>
            <Box>
              <Typography sx={localstyles.typo_header}>運輸資料</Typography>
            </Box>

            {/* <Box>
          {HeaderTitle.map((t)=>(  <Typography sx={localstyles.typo_fieldTitle}>{t.title}</Typography>))}
          
            <Typography sx={localstyles.typo_fieldContent}>
              
            </Typography>
          </Box> */}

            <CustomField label={"建立日期及時間"}>
              <Typography sx={localstyles.typo_fieldContent}>
              {new Date().toLocaleString()}
              </Typography>
            </CustomField>

            <CustomField label={"运输类别"}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.picoType}
              </Typography>
            </CustomField>

            <CustomField label={"运输有效日期"}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.effFrmDate} To{" "}
                {selectedPickupOrder?.effToDate}
              </Typography>
            </CustomField>
            <CustomField label={"回收周次"}>
              <Typography sx={localstyles.typo_fieldContent}>
              {selectedPickupOrder?.routine.map((routineItem) => routineItem).join(' ')}
              </Typography>
            </CustomField>

            <CustomField label={"车辆类别"}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.vehicleTypeId}
              </Typography>
            </CustomField>
            <CustomField label={"车牌号码"}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.platNo}
              </Typography>
            </CustomField>
            <CustomField label={"联络人号码"}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.contactNo}
              </Typography>
            </CustomField>

            <CustomField label={"寄件公司名称"}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.logisticId}
              </Typography>
            </CustomField>

            <CustomField label={"已过期操作"}>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedPickupOrder?.normalFlg ? "是" : "否"}
              </Typography>
            </CustomField>

            <Typography sx={localstyles.typo_header}>回收地点资料</Typography>

            <PickupOrderCard pickupOrderDetail={pickupOrderDetail ?? []} />
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
    justifyContent: "flex-end",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "40%",
    bgcolor: "white",
    overflowY: "scroll",
  },

  button: {
    borderColor: "lightgreen",
    color: "green",
    width: "100px",
    height: "35px",
    p: 1,
    borderRadius: "18px",
    mr: "10px",
  },
  // header: {
  //   display: "flex",
  //   flex: 1,
  //   p: 4,
  //   alignItems:'center'

  //
  content: {
    flex: 9,
    p: 4,
  },
  typo_header: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#858585",
    letterSpacing: "2px",
    mt: "10px",
  },
  typo_fieldTitle: {
    fontSize: "15px",
    color: "#ACACAC",
    letterSpacing: "2px",
  },
  typo_fieldContent: {
    fontSize: "17PX",
    letterSpacing: "2px",
  },
};

export default PickupOrderForm;
