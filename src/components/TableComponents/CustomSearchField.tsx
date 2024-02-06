import { IconButton, InputAdornment, MenuItem, TextField } from "@mui/material";
import React, {useState} from "react";
import { SEARCH_ICON } from "../../themes/icons";
import { t } from "i18next";

interface Option {
  value: string;
  label: string;
}

const CustomSearchField = ({ label, width, options, onChange, field }: { 
  label: string; 
  width: string; 
  options?: Option[]; 
  onChange?: (labelField: string, value: string) => void;
  field?: string
}) => {
  const hasOptions = options && options.length>0
  const [selectedValue, setSelectedValue] = useState<string>("")
  const handleChange = (event: React.ChangeEvent<{value: any}>) => {
    const newValue = event.target.value as string
    setSelectedValue(newValue)

    // if(options) {
    //   const selectedOpt = options?.find((item) => item.value == newValue) 
      
    // }

    if(onChange ){
      onChange(field ? field : label, newValue)
    }


  }
  return (
    <TextField
      sx={{
        mt: 3,
        m: 1,
        width: width,
        bgcolor: "white",
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#grey",
          },
          "&:hover fieldset": {
            borderColor: "#79CA25",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#79CA25",
          },
          "& label.Mui-focused": {
            color: "#79CA25", // Change label color when input is focused
          },
        },
      }}
     
      label={label}
      InputLabelProps={{
        style: { color: "#79CA25" },
        focused: true,
      }}
      value={selectedValue}
      placeholder={t("pick_up_order.filter.search")}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
           {!hasOptions && ( 
            <IconButton onClick={() => {}}>
              <SEARCH_ICON style={{ color: "#79CA25" }} />
            </IconButton>
          )}
        </InputAdornment>
      ),
    }}
      select={hasOptions}
      onChange={handleChange}
    >
      {hasOptions &&options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CustomSearchField;