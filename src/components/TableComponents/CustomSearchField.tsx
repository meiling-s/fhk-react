import { IconButton, InputAdornment, MenuItem, TextField } from "@mui/material";
import React, {useEffect, useState} from "react";
import { SEARCH_ICON } from "../../themes/icons";
import { t } from "i18next";
import { localStorgeKeyName } from "../../constants/constant";

interface Option {
  value: string;
  label: string;
}

const CustomSearchField = ({ label, width, options, onChange, field, placeholder, handleSearch }: { 
  label: string; 
  width: string; 
  options?: Option[]; 
  onChange?: (labelField: string, value: string) => void;
  field?: string;
  placeholder?: string;
  handleSearch?: (value: string) => void;
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
  const [primaryColor, setPrimaryColor] = useState<string>('#79CA25')
  const role = localStorage.getItem(localStorgeKeyName.role)

  useEffect(() => {
    setPrimaryColor(role === 'manufacturer' || role === 'customer' ? '#6BC7FF' : '#79CA25')
  }, [role])

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
            borderColor: primaryColor,
          },
          "&.Mui-focused fieldset": {
            borderColor: primaryColor,
          },
          "& label.Mui-focused": {
            color: primaryColor, // Change label color when input is focused
          },
        },
      }}
     
      label={label}
      InputLabelProps={{
        style: { color: primaryColor },
        focused: true,
      }}
      value={selectedValue}
      placeholder={placeholder ? placeholder : t("pick_up_order.filter.search")}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
           {!hasOptions && ( 
            <IconButton onClick={handleSearch ? () => handleSearch(selectedValue) : undefined}>
              <SEARCH_ICON style={{ color: primaryColor }} />
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