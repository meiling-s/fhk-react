import { Box, Icon, Stack, Typography } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { PickupOrderDetail } from "../interfaces/pickupOrder";
import LocalizeRecyctype from "./TableComponents/LocalizeRecyctype";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { DriverDetail } from "../interfaces/JobOrderInterfaces";
import { formatWeight } from "../utils/utils";
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../contexts/CommonTypeContainer";
import { useTranslation } from "react-i18next";

const JobOrderCard = ({
  plateNo,
  pickupOrderDetail,
  driverDetail
}: {
  plateNo: String | undefined
  pickupOrderDetail: PickupOrderDetail[];
  driverDetail: DriverDetail | undefined;
}) => {
  const recyc = LocalizeRecyctype(pickupOrderDetail);
  const { decimalVal } = useContainer(CommonTypeContainer)
  const {i18n} = useTranslation()
  return (
    <>
      {pickupOrderDetail.map((podetail, index) => (
        <Stack
          key={index}
          borderColor="#e2e2e2"
          p={2}
          borderRadius="12px"
          sx={{ borderWidth: "1px", borderStyle: "solid" }}
          spacing={1}
        >
          <Box width='100%'>
            <Typography style={localstyles.pickup_at}>{podetail.pickupAt}</Typography>
            {recyc && (
              <Box width={'100%'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Box key={index}>
                  <Typography sx={localstyles.title}>{recyc[index].recycType}</Typography>
                  <Typography sx={localstyles.mini_value}>{recyc[index].recycSubType}</Typography>
                </Box>
                <Typography sx={localstyles.title}>{formatWeight(podetail.weight, decimalVal)}kg</Typography>
              </Box>
            )}
          </Box>
          <Box display="flex">
            <Box display="flex" flexShrink={0}>
              <Icon sx={{ justifySelf: "center", display: "flex", mr: "5px", color: '#acacac' }}>
                <Inventory2OutlinedIcon />
              </Icon>
            </Box>
            <Box
              sx={{ overflowWrap: "break-word" }}
            >
              <Typography sx={{ overflowWrap: "break-word" }} style={localstyles.mini_value}>
                {podetail?.senderName} - {podetail?.receiverName}
              </Typography>
            </Box>
          </Box>
          <Box display="flex">
            <Box display="flex" height={"30px"} flexShrink={0}>
              <Icon sx={{ justifySelf: "center", display: "flex", mr: "5px", color: '#acacac' }}>
                <PlaceOutlinedIcon />
              </Icon>
            </Box>
            <Box
              sx={{ overflowWrap: "break-word" }}
            >
              <Typography style={localstyles.mini_value}>
                {podetail?.senderAddr} --- {podetail.receiverAddr}
              </Typography>
            </Box>
          </Box>
          <Box display={"flex"} justifyContent={"space-between"} borderRadius={'12px'} borderColor={"#8AF3A3"} border={1} bgcolor={"#F4FBF6"} paddingInline={"20px"} paddingTop={"12px"} paddingBottom={"12px"}>
            <Box display={"flex"} alignItems={"center"}>
              <img src={driverDetail?.photo[0]} alt="" />
              <Box display={"flex"} flexDirection={"column"}>
                <Typography style={localstyles.driver_name}>
                  {i18n.language === 'enus' ? driverDetail?.driverNameEng : i18n.language === 'zhch' ? driverDetail?.driverNameSchi : driverDetail?.driverNameTchi}
                </Typography>
                <Typography style={localstyles.plate_no}>
                  {plateNo}
                </Typography>
              </Box>
            </Box>
            <BorderColorIcon style={{color: '#acacac'}} />
          </Box>
        </Stack>
      ))}
    </>
  );
};

export default JobOrderCard;

const localstyles = {
  pickup_at: {
    fontSize: '16px',
    color: '#535353',
    marginBottom: '8px'
  },
  title: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#000',
    letterSpacing: '1.5px',
  },
  mini_value: {
    fontSize: '12px',
    color: '#717171',
    letterSpacing: '1px'
  },
  driver_name: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#535353',
    letterSpacing: '1.5px'
  },
  plate_no: {
    fontSize: '15px',
    color: '#717171',
  },
}