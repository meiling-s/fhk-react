import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

type Props = {
  onText: string;
  offText: string;
  setState: (b: boolean) => void;
  defaultValue?: boolean;
  disabled?: boolean;
  value?: string;
  helperText?: string;
  styles?: object;
};

export default function Switcher({
  onText,
  offText,
  defaultValue,
  setState,
  disabled,
  value,
  helperText,
  styles,
}: Props) {
  const [onOff, setOnOff] = useState<boolean>(defaultValue !== undefined ? defaultValue : false);

  useEffect(() => {
    if (defaultValue !== undefined) {
      setOnOff(defaultValue);
    }
  }, [defaultValue]);

  const handleSwitchChange = () => {
    if (disabled) return;
    setState(!onOff);
    setOnOff(!onOff);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "200px",
          height: "50px",
          borderRadius: "50px",
          backgroundColor: "#E2E2E2",
          cursor: disabled ? "not-allowed" : "pointer",
          padding: "5px",
          justifyContent: "space-between", 
          marginTop: "5px"
        }}
        onClick={handleSwitchChange}
      >
        <Box
          sx={{
            position: "absolute",
            left: onOff ? "5px" : "calc(100% - 100px)",
            width: "95px",
            height: "100%",
            backgroundColor: "white",
            borderRadius: "50px",
            transition: "left 0.3s ease",
            zIndex: 0,
          }}
        />

        {/* On Text */}
        <Typography
          sx={{
            zIndex: 1, 
            fontWeight: "bold",
            color: onOff ? "#000" : "#717171", 
            width: "90px",
            textAlign: "center",
            fontSize: 14
          }}
        >
          {onText}
        </Typography>

        {/* Off Text */}
        <Typography
          sx={{
            zIndex: 1,
            fontWeight: "bold",
            color: !onOff ? "#000" : "#717171",
            width: "90px",
            textAlign: "center",
            fontSize: 14
          }}
        >
          {offText}
        </Typography>
      </Box>

      {/* Helper text */}
      {helperText && (
        <Typography color="red" ml="15px">
          {helperText}
        </Typography>
      )}
    </>
  );
}
