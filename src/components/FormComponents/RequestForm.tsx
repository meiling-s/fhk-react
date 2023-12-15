import {
  Alert,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RecycleCard from "../RecycleCard";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import { CheckIn, CheckinDetail } from "../../interfaces/checkin";
import { styles } from "../../constants/styles";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";
import { useContainer } from "unstated-next";
import { il_item } from "./CustomItemList";
import i18n from "../../setups/i18n";

type recycItem = {
  recycType: il_item;
  recycSubtype: il_item;
  weight:number
};

type props = {
  onClose?: () => void;
  selectedItem?: CheckIn;
};

const RequestForm = ({ onClose, selectedItem }: props) => {
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // If the overlay is clicked (not its children), close the modal
      onClose && onClose();
    }
  };
  const { recycType } = useContainer(CommonTypeContainer);

  const [selectedDetail, setSelectedDetail] = useState<CheckinDetail[] | undefined>([]);

  const [recycItem, setRecycItem] = useState<recycItem[]>([]);
  
  console.log(recycItem)

  console.log("Selected: ", selectedItem)

 // ...
 

useEffect(() => {
  setSelectedDetail(selectedItem?.checkinDetail);
}, [selectedItem]);

useEffect(() => {
  if (selectedDetail && selectedDetail.length > 0) {
    const recycItems: recycItem[] = [];
    
    selectedDetail.forEach((detail) => {
      const matchingRecycType = recycType?.find(
        (recyc) => detail.recycTypeId === recyc.recycTypeId
      );
      console.log(matchingRecycType)
      if (matchingRecycType) {
        const matchRecycSubType = matchingRecycType.recycSubtype?.find(
          (subtype) => subtype.recycSubtypeId === detail.recycSubtypeId
        );
        var name = "";
        switch(i18n.language){
            case "enus":
                name = matchingRecycType.recyclableNameEng;
                break;
            case "zhch":
                name = matchingRecycType.recyclableNameSchi;
                break;
            case "zhhk":
                name = matchingRecycType.recyclableNameTchi;
                break;
            default:
                name = matchingRecycType.recyclableNameTchi;        //default fallback language is zhhk
                break;
        }
        var subName = "";
                switch(i18n.language){
                    case "enus":
                        subName = matchRecycSubType?.recyclableNameEng ?? "";
                        break;
                    case "zhch":
                        subName = matchRecycSubType?.recyclableNameSchi ?? "";
                        break;
                    case "zhhk":
                        subName = matchRecycSubType?.recyclableNameTchi ?? "";
                        break;
                    default:
                        subName = matchRecycSubType?.recyclableNameTchi ?? "";       //default fallback language is zhhk
                        break;
                }
        recycItems.push({
          recycType: {
            name: name,
            id: detail.chkInDtlId.toString(),
          },
          recycSubtype: {
            name: subName,
            id: detail.chkInDtlId.toString(),
          },
          weight:detail.weight
          

        });
      }
    });
    setRecycItem(recycItems);
  }
}, [selectedDetail, recycType]);


  return (
    <>
      <Box sx={localstyles.modal} onClick={handleOverlayClick}>
        <Box sx={localstyles.container} className="md:w-[500px] w-[100vw]">
          <Box sx={localstyles.header}>
            <Box>
              <Typography sx={styles.header4}>送入請求</Typography>
              <Typography sx={styles.header3}>
                {selectedItem?.picoDtlId}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignSelf: "center" }}>
              <IconButton onClick={onClose}>
                <KeyboardTabIcon sx={{ fontSize: "30px" }} />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <Stack spacing={2} sx={localstyles.content}>
            {selectedItem?.adjustmentFlg && (
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                調整庫存
              </Alert>
            )}
            <Box>
              <Typography sx={localstyles.typo_header}>運輸資料</Typography>
            </Box>

            <Box>
              <Typography sx={localstyles.typo_fieldTitle}>寄件公司</Typography>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedItem?.senderName}
              </Typography>
            </Box>

            <Box>
              <Typography sx={localstyles.typo_fieldTitle}>收件公司</Typography>
              <Typography sx={localstyles.typo_fieldContent}></Typography>
            </Box>

            <Box>
              <Typography sx={localstyles.typo_fieldTitle}>物流公司</Typography>
              <Typography sx={localstyles.typo_fieldContent}>
                {selectedItem?.logisticName}
              </Typography>
            </Box>

            <Typography sx={localstyles.typo_header}>回收地點資料</Typography>
            <Box display="flex" flexDirection="row">
              <Box sx={{ flex: 1 }}>
                <Typography sx={localstyles.typo_fieldTitle}>
                  送出地點
                </Typography>
                <Typography sx={localstyles.typo_fieldContent}>
                  {selectedItem?.senderAddr}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, display: "flex", flexDirection: "row" }}>
                <Box alignSelf="left" sx={{ mr: "35px" }}>
                  <ArrowForwardIcon
                    style={{ color: "#9f9f9f", fontSize: "30px" }}
                  />
                </Box>
                <Box>
                  <Typography sx={localstyles.typo_fieldTitle}>
                    到達地點
                  </Typography>
                  <Typography sx={localstyles.typo_fieldContent}></Typography>
                </Box>
              </Box>
            </Box>

            <Typography sx={localstyles.typo_fieldTitle}>
              回收類別及重量
            </Typography>
            {recycItem.map((item, index) => (
              <RecycleCard
                key={item.recycType.id}
                name={item.recycType.name}
                bgcolor="#e1f4ff"
                fontcolor="#66bff6"
                weight={item.weight}
                showImage={false}
                recycleName={item.recycSubtype.name}
                recycleType={item.recycType.name}
              />
            ))}
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
    // width: "40%",
    bgcolor: "white",
    overflowY: "scroll",
  },
  header: {
    display: "flex",
    flex: 1,
    p: 4,
    justifyContent: "space-between",
  },
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

export default RequestForm;
