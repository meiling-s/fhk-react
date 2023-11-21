import { Alert, Box, Divider, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RecycleCard from "../RecycleCard";
import { FakeDataItem } from "../../interfaces/fakeData";

const RequestForm = ({
  onClose,
  fakedata,
}: {
  onClose: () => void;
  fakedata: FakeDataItem[] | null;
}) => {
  const [stockAdjust, setStockAdjust] = useState<boolean>(false);
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      // If the overlay is clicked (not its children), close the modal
      onClose();
    }
  };

  return (
    <>
      {fakedata?.map((data) => (
        <Box
          sx={{
            height: "100vh",
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={handleOverlayClick}
        >
          <Box sx={{ height: "100%", bgcolor: "white", width: "40%" }}>
            <Box sx={{ p: 4 }}>
              <Typography fontSize="25px" fontWeight="bold" letterSpacing="2px">
                送入請求
              </Typography>
              <Typography fontSize="15px" color="#979797" letterSpacing="2px">
                {data.poNumber}
              </Typography>
            </Box>
            <Divider />
            <Stack spacing={2} sx={{ p: 4 }}>
              {data.stockAdjust && (
                <Alert
                  icon={<CheckIcon fontSize="inherit" />}
                  severity="success"
                >
                  調整庫存
                </Alert>
              )}
              <Box >
                <Typography
                  fontSize="20px"
                  fontWeight="bold"
                  color="#858585"
                  letterSpacing="2px"
                  sx={{ mt: "10px" }}
                >
                  運輸資料
                </Typography>
              </Box>

              <Box>
                <Typography fontSize="17px" color="#cacaca" letterSpacing="2px">
                  物流公司
                </Typography>
                <Typography fontSize="20PX" letterSpacing="2px">
                  {data.logisticsCompany}
                </Typography>
              </Box>

              <Typography
                fontSize="20px"
                fontWeight="bold"
                color="#858585"
                letterSpacing="2px"
              >
                回收地點資料
              </Typography>
              <Box display="flex" flexDirection="row">
                <Box width="250px">
                  <Typography
                    fontSize="17px"
                    color="#cacaca"
                    letterSpacing="2px"
                  >
                    送出地點
                  </Typography>
                  <Typography fontSize="20PX" letterSpacing="2px">
                    {data.returnAddr}
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="row" sx={{ ml: "150px" }}>
                  <Box alignSelf="center" sx={{ mr: "35px" }}>
                    <ArrowForwardIcon
                      style={{ color: "#9f9f9f", fontSize: "30px" }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      fontSize="17px"
                      color="#cacaca"
                      letterSpacing="2px"
                    >
                      到達地點
                    </Typography>
                    <Typography fontSize="20PX" letterSpacing="2px">
                      {data.deliveryAddr}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Typography fontSize="17px" color="#cacaca" letterSpacing="2px">
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
      ))}
    </>
  );
};

export default RequestForm;
