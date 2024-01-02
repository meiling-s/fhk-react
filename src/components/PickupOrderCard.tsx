import { Box, Icon, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomField from "./FormComponents/CustomField";
import StatusCard from "./StatusCard";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { PickupOrderDetail, PicoDetail } from "../interfaces/pickupOrder";
import { getDtlById } from "../APICalls/Collector/pickupOrder/pickupOrder";
import LocalizeRecyctype from "./TableComponents/LocalizeRecyctype";

const PickupOrderCard = ({
  pickupOrderDetail,
}: {
  pickupOrderDetail: PickupOrderDetail[];
}) => {
  const [picoitemDetail, setPicoItemDetail] = useState<PicoDetail[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const picoDtl: PicoDetail[] = [];
      if (pickupOrderDetail) {
        for (const podetail of pickupOrderDetail) {
          const data = await getDtlById(podetail.picoDtlId);
          picoDtl.push(data);
        }
        setPicoItemDetail(picoDtl);
      }
    };
    fetchData();
  }, [pickupOrderDetail]);

  const recyc = LocalizeRecyctype(pickupOrderDetail);
  console.log(recyc);

  return (
    <>
      {pickupOrderDetail.map((podetail, index) => (
        <Stack
          borderColor="#ACACAC"
          p={2}
          borderRadius="10px"
          sx={{ borderWidth: "1px", borderStyle: "solid" }}
          spacing={1}
        >
          <Box display="flex" justifyContent="space-between">
            <Box>
           
                  <Box >
                    <CustomField label="主类别">
                      <Typography>{podetail.recycType}</Typography>
                    </CustomField>
                    <CustomField label="次类别">
                      <Typography>{podetail.recycSubType}</Typography>
                    </CustomField>
                  </Box>
             
            </Box>
            <Box>
              <StatusCard status={podetail?.status} />
            </Box>
          </Box>
          <Box display="flex">
            <Box display="flex" width={"150px"}>
              <Icon sx={{ justifySelf: "center", display: "flex", mr: "5px" }}>
                <AccessTimeIcon />
              </Icon>
              <Typography>预计运送时间</Typography>
            </Box>
            <Typography ml="60px">{podetail.pickupAt}</Typography>
          </Box>
          <Box display="flex">
            <Box display="flex" width={"150px"}>
              <Icon sx={{ justifySelf: "center", display: "flex", mr: "5px" }}>
                <MonitorWeightOutlinedIcon />
              </Icon>
              <Typography>重量</Typography>
            </Box>
            <Typography ml="60px">{podetail.weight} kg</Typography>
          </Box>
          <Box display="flex">
            <Box display="flex" width={"150px"}>
              <Icon sx={{ justifySelf: "center", display: "flex", mr: "5px" }}>
                <Inventory2OutlinedIcon />
              </Icon>
              <Typography>寄件及收件公司</Typography>
            </Box>
            <Box
              ml={"60px"}
              width={"400px"}
              sx={{ overflowWrap: "break-word" }}
            >
              <Typography sx={{ overflowWrap: "break-word" }}>
                {podetail?.senderName} - {podetail?.receiverName}
              </Typography>
            </Box>
          </Box>
          <Box display="flex">
            <Box display="flex" width={"150px"} height={"30px"}>
              <Icon sx={{ justifySelf: "center", display: "flex", mr: "5px" }}>
                <PlaceOutlinedIcon />
              </Icon>
              <Typography>送出及到达地点</Typography>
            </Box>
            <Box
              ml={"60px"}
              width={"400px"}
              sx={{ overflowWrap: "break-word" }}
            >
              <Typography>
                {podetail?.senderAddr} --- {podetail.receiverAddr}
              </Typography>
            </Box>
          </Box>
        </Stack>
      ))}
    </>
  );
};

export default PickupOrderCard;
