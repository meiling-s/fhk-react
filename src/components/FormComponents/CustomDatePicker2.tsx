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
import { useContainer } from "unstated-next";
import CommonTypeContainer from "../../contexts/CommonTypeContainer";

type DatePicker = {
  setDate: (period: openingPeriod) => void;
  defaultStartDate?: Date | string;
  defaultEndDate?: Date | string;
  pickupOrderForm?: boolean;
  iconColor?: string
};

function CustomDatePicker2({
  setDate,
  defaultStartDate,
  defaultEndDate,
  pickupOrderForm,
  iconColor
}: DatePicker) {
  const startDate = defaultStartDate? new Date(defaultStartDate): new Date();
  const endDate = defaultEndDate ? new Date(defaultEndDate) : new Date();
  const {dateFormat} = useContainer(CommonTypeContainer)
  
  const [period, setPeriod] = useState<any>({
    startDate: dayjs(startDate),
    endDate: dayjs(endDate),
  });
 //console.log(period)
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

  const localstyles = {
    datePicker: (showOne: boolean) => ({
      ...styles.textField,
      width: showOne ? '310px' : '150px',
      '& .MuiIconButton-edgeEnd': {
        color: iconColor ? iconColor : '#79CA25'
      }
    })
  }

  return (
    <>
   
      {pickupOrderForm ? (
        <Box display={"flex"}>
      <CustomField label={t('common.start_date_at')} mandatory>
       <DatePicker
         defaultValue={dayjs(startDate)}
         maxDate={period.endDate}
         onChange={(value) => onChangeDate(true, value)}
         sx={localstyles.datePicker(pickupOrderForm!)}
         format={dateFormat}
       />
       </CustomField>
       <Box ml='15px'>
       <CustomField label={t('pick_up_order.to')} mandatory>
       <DatePicker
         defaultValue={dayjs(endDate)}
         minDate={period.startDate}
         onChange={(value) => onChangeDate(false, value)}
         sx={localstyles.datePicker(pickupOrderForm!)}
         format={dateFormat}
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
            format={dateFormat}
          />
          <Typography sx={{ marginX: 1 }}>{t("to")}</Typography>
          <DatePicker
            defaultValue={dayjs(endDate)}
            minDate={period.startDate}
            onChange={(value) => onChangeDate(false, value)}
            sx={localstyles.datePicker(pickupOrderForm!)}
            format={dateFormat}
          />
        </Box>
      )}
    </>
  );
}

export default CustomDatePicker2;
