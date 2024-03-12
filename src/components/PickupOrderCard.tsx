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
import { useTranslation } from 'react-i18next'

const PickupOrderCard = ({
  pickupOrderDetail,
}: {
  pickupOrderDetail: PickupOrderDetail[];
}) => {
  const [picoitemDetail, setPicoItemDetail] = useState<PicoDetail[]>([]);
  const { t } = useTranslation()
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
  console.log(pickupOrderDetail);
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
              {/* {recyc
                ?.filter(
                  (item, index, self) =>
                    index ===
                    self.findIndex(
                      (t) =>
                        t.recycType === item.recycType &&
                        t.recycSubType === item.recycSubType
                    )
                )
                .map((a, index) => ( */}
                {recyc && (
                   <Box key={index}>
                   <CustomField label={t('pick_up_order.card_detail.main_category')}>
                     <Typography>{recyc[index].recycType}</Typography>
                   </CustomField>
                   <CustomField label={t('pick_up_order.card_detail.subcategory')}>
                     <Typography>{recyc[index].recycSubType}</Typography>
                   </CustomField>
                 </Box>
                )}
                 
                {/* ))} */}
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
              <Typography>{t('pick_up_order.card_detail.shipping_time')}</Typography>
            </Box>
            <Typography ml="60px">{podetail.pickupAt}</Typography>
          </Box>
          <Box display="flex">
            <Box display="flex" width={"150px"}>
              <Icon sx={{ justifySelf: "center", display: "flex", mr: "5px" }}>
                <MonitorWeightOutlinedIcon />
              </Icon>
              <Typography>{t('pick_up_order.card_detail.weight')}</Typography>
            </Box>
            <Typography ml="60px">{podetail.weight} kg</Typography>
          </Box>
          <Box display="flex">
            <Box display="flex" width={"150px"}>
              <Icon sx={{ justifySelf: "center", display: "flex", mr: "5px" }}>
                <Inventory2OutlinedIcon />
              </Icon>
              <Typography>{t('pick_up_order.card_detail.shipping_receiver')}</Typography>
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
              <Typography>{t('pick_up_order.card_detail.deliver_location')}</Typography>
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
