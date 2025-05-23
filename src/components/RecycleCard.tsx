import { Box, Modal, Stack, Typography } from "@mui/material";
import { useState } from "react";
import BackgroundLetterAvatars from "./CustomAvatar";
import { styles } from "../constants/styles";
import { CheckinDetailPhoto } from "../interfaces/checkin";
import { CheckoutDetailPhoto } from "src/interfaces/checkout";

type props = {
  name: string;
  packageTypeId: string;
  bgcolor: string;
  fontcolor: string;
  showImage: boolean;
  recycleName: string;
  recycleType: string;
  weight: string;
  images: CheckinDetailPhoto[] | CheckoutDetailPhoto[];
};

const RecycleCard = ({
  name,
  packageTypeId,
  bgcolor,
  fontcolor,
  showImage,
  recycleName,
  recycleType,
  weight,
  images,
}: props) => {
  const [open, setOpen] = useState<boolean>(false);

  const fakeImagae = [
    {
      imageUrl:
        "https://thanam.com.my/wp-content/uploads/2022/07/newspapers-g19e6b2746_1920.png",
    },
    {
      imageUrl:
        "https://thanam.com.my/wp-content/uploads/2022/07/newspapers-g19e6b2746_1920.png",
    },
    {
      imageUrl:
        "https://thanam.com.my/wp-content/uploads/2022/07/newspapers-g19e6b2746_1920.png",
    },
  ];
  return (
    <Box
      sx={{
        // height: "100%",
        borderRadius: "10px",
        borderColor: "#cacaca",
        borderWidth: "1px",
        borderStyle: "solid",
        p: 2,
      }}
    >
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Box flexDirection="row" display="flex">
          <Box alignSelf="center" sx={{ mr: "15px" }}>
            <BackgroundLetterAvatars
              name={packageTypeId}
              size={33}
              backgroundColor={bgcolor}
              fontColor={fontcolor}
              fontSize="15px"
              isBold={true}
            />
          </Box>
          <Box>
            <Typography fontWeight="bold" fontSize="16px">
              {recycleName}{" "}
            </Typography>
            <Typography color="#9f9f9f" fontSize="14px">
              {recycleType}{" "}
            </Typography>
          </Box>
        </Box>
        <Box alignSelf="center" fontWeight="bold">
          {weight} kg
        </Box>
      </Box>
      {showImage && (
        <Stack mt="10px" spacing={3} direction="row">
          {images.map((image: CheckinDetailPhoto | CheckoutDetailPhoto) => (
            <Box height="100px" bgcolor="red" width="100px" borderRadius="10px">
              <img
                src={image.photo}
                alt="Example Image"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  borderRadius: "5px",
                }}
                onClick={() => {
                  setOpen(true);
                }}
              />

              <Modal
                open={open}
                onClose={() => {
                  setOpen(false);
                }}
              >
                <Box sx={styles.imageContainer}>
                  <img
                    src={image.photo}
                    style={{ width: "100%", height: "100%" }}
                    alt="Example Image"
                  />
                </Box>
              </Modal>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default RecycleCard;
