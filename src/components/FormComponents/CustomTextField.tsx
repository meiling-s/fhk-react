import { InputAdornment, TextField } from "@mui/material";
import { styles } from "../../constants/styles";
import { FocusEventHandler } from "react";

type props = {
  id: string;
  placeholder: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?:
    | FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  endAdornment?: JSX.Element;
  error?: boolean;
  className?: string;
  multiline?: boolean;
  rows?: number;
  sx?: any;
  helperText?: any;
  disabled?: boolean;
  textarea?: boolean;
  type?: string;
  maxLength?: number;
  dataTestId?: string;
};

function CustomTextField({
  id,
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  endAdornment,
  error,
  className,
  multiline = false,
  rows,
  sx,
  helperText,
  disabled = false,
  textarea = false,
  type,
  maxLength,
  dataTestId = "",
}: props) {
  return (
    <TextField
      type={type}
      error={error}
      className={className}
      hiddenLabel
      id={id}
      data-testid={dataTestId}
      value={value}
      multiline={multiline}
      rows={multiline ? 4 : rows}
      placeholder={placeholder}
      defaultValue={defaultValue ? defaultValue : ""}
      onChange={onChange}
      onBlur={onBlur}
      sx={{
        ...styles.textField,
        ...sx,
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: error ? "red" : "", // Red border when error is true
          },
          "&:hover fieldset": {
            borderColor: error ? "red" : "",
          },
          "&.Mui-focused fieldset": {
            borderColor: error ? "red" : "",
          },
        },
      }}
      helperText={helperText}
      disabled={disabled}
      inputProps={maxLength ? { maxLength: maxLength } : undefined}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end" sx={{ height: "100%" }}>
            {endAdornment && endAdornment}
          </InputAdornment>
        ),
        sx: [
          styles.inputProps,
          {
            cursor: disabled ? "no-drop" : "",
          },
          textarea && {
            width: "100%",
            height: "100px",
            padding: "10px",
            borderColor: "#ACACAC",
            borderRadius: 5,
          },
        ],
      }}
    />
  );
}

export default CustomTextField;
