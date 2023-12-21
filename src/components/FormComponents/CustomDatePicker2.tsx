import { Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { styles } from "../../constants/styles";
import dayjs from "dayjs";
import { useState } from "react";
import { openingPeriod } from "../../interfaces/collectionPoint";
import { format } from "../../constants/constant";
import { useTranslation } from "react-i18next";
import CustomTextField from "./CustomTextField";
import CustomField from "./CustomField";

type DatePicker = {
  setDate: (period: openingPeriod) => void;
  defaultStartDate?: Date | string;
  defaultEndDate?: Date | string;
  pickupOrderForm?: boolean;
};

function CustomDatePicker2({
  setDate,
  defaultStartDate,
  defaultEndDate,
  pickupOrderForm,
}: DatePicker) {
  const startDate = defaultStartDate ? defaultStartDate : new Date();
  const endDate = defaultEndDate ? defaultEndDate : new Date();

  const [period, setPeriod] = useState<openingPeriod>({
    startDate: dayjs(startDate),
    endDate: dayjs(endDate),
  });

  const { t } = useTranslation();

  const onChangeDate = (start: boolean, value: dayjs.Dayjs | null) => {
    if (value != null) {
      const peri = Object.assign({}, period);
      if (start) {
        peri.startDate = value;
      } else {
        peri.endDate = value;
      }
      setPeriod(peri);
      setDate(peri);
    }
  };

  return (
    <>
   
      {pickupOrderForm ? (
        <Box display={"flex"}>
      <CustomField label={"运输有效日期由"} mandatory>
       <DatePicker
         defaultValue={dayjs(startDate)}
         maxDate={period.endDate}
         onChange={(value) => onChangeDate(true, value)}
         sx={localstyles.datePicker(pickupOrderForm!)}
         format={format.dateFormat2}
       />
       </CustomField>
       <Box ml='15px'>
       <CustomField label={"至"} mandatory>
       <DatePicker
         defaultValue={dayjs(endDate)}
         minDate={period.startDate}
         onChange={(value) => onChangeDate(false, value)}
         sx={localstyles.datePicker(pickupOrderForm!)}
         format={format.dateFormat2}
       />
       </CustomField>
       </Box>
       </Box>
     
      ) : (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <DatePicker
            defaultValue={dayjs(startDate)}
            maxDate={period.endDate}
            onChange={(value) => onChangeDate(true, value)}
            sx={localstyles.datePicker(pickupOrderForm!)}
            format={format.dateFormat2}
          />
          <Typography sx={{ marginX: 1 }}>{t("to")}</Typography>
          <DatePicker
            defaultValue={dayjs(endDate)}
            minDate={period.startDate}
            onChange={(value) => onChangeDate(false, value)}
            sx={localstyles.datePicker(pickupOrderForm!)}
            format={format.dateFormat2}
          />
        </Box>
      )}
    </>
  );
}

const localstyles = {
    datePicker: (showOne: boolean) => ({
      ...styles.textField,
      width: showOne ? "310px" : "150px",
      "& .MuiIconButton-edgeEnd": {
        color: "#79CA25",
      },
    }),
  };

export default CustomDatePicker2;
