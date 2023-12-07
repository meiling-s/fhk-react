import { IconButton, InputAdornment, MenuItem, TextField } from "@mui/material";
import React from "react";
import { SEARCH_ICON } from "../../themes/icons";
import { t } from "i18next";

interface Option {
  value: string;
  label: string;
}

const CustomSearchField = ({ label, width, options }: { label: string; width: string; options?: Option[] }) => {
  const hasOptions = options && options.length>0
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
      placeholder={t("input_po_no")}
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