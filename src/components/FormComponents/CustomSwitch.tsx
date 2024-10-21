import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { red } from "@mui/material/colors";

type Props = {
  onText: string;
  offText: string;
  setState: (b: boolean) => void;
  defaultValue?: boolean;
  disabled?: boolean;
  value?: string;
  helperText?: string;
};

export default function Switches({
  onText,
  offText,
  defaultValue,
  setState,
  disabled,
  value,
  helperText,
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
      <Button
        sx={localStyles.container}
        onClick={handleSwitchChange}
        disabled={disabled}
      >
        <Box
          sx={[
            disabled ? localStyles.switch_disabled : localStyles.switch,
            { ml: onOff ? "5px" : "105px" },
          ]}
        />
        <Typography sx={localStyles.onOffLabel}>{onText}</Typography>
        <Typography sx={localStyles.onOffLabel}>{offText}</Typography>
      </Button>
      {helperText && (
        <Typography color={red[500]} ml="15px">
          {helperText}
        </Typography>
      )}
    </>
  );
}

const sharedSwitchStyles = {
  width: "90px",
  height: "50px",
  position: "absolute",
  borderRadius: "50px",
  transition: "transform 0.3s ease",
};

const localStyles = {
  container: {
    display: "flex",
    flexDirection: "row",
    width: "200px",
    height: "60px",
    backgroundColor: "#E2E2E2",
    borderRadius: "50px",
    justifyContent: "flex-start",
    padding: 0,
    position: "relative",
  },
  switch: {
    ...sharedSwitchStyles,
    backgroundColor: "white",
  },
  switch_disabled: {
    ...sharedSwitchStyles,
    backgroundColor: "#CBCBCB",
  },
  onOffLabel: {
    zIndex: 1,
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    color: "#717171",
    fontWeight: "bold",
  },
};
