import React from "react";
import { Button } from "@mui/material";
import { getPrimaryColor } from "../../utils/utils";
interface ButtonProps {
  id?: string;
  text?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  color?: string;
  outlined?: Boolean;
  style?: object;
  dataTestId?: string;
}

const CustomButton: React.FC<ButtonProps> = ({
  id = "",
  text = "",
  disabled = false,
  className,
  onClick,
  color = "green",
  outlined = false,
  style = {},
  dataTestId = "",
}) => {
  const getStyle = React.useMemo(() => {
    let btnStyle: React.CSSProperties = {
      cursor: disabled ? "not-allowed" : "pointer",
    };

    if (color === "green") {
      btnStyle = {
        backgroundColor: disabled
          ? "lightgray"
          : outlined
          ? "#fff"
          : getPrimaryColor(),
        color: disabled ? "#A9A9A9" : outlined ? getPrimaryColor() : "#fff",
        borderColor: disabled ? "lightgray" : getPrimaryColor(),
      };
    } else if (color === "blue") {
      btnStyle = {
        backgroundColor: disabled
          ? "lightgray"
          : outlined
          ? "#fff"
          : getPrimaryColor(),
        color: disabled ? "#A9A9A9" : outlined ? getPrimaryColor() : "#fff",
        borderColor: disabled ? "lightgray" : getPrimaryColor(),
      };
    }

    return btnStyle;
  }, [disabled, outlined, color]);

  return (
    <Button
      id={id}
      disabled={disabled}
      className={className}
      onClick={(event) => {
        event.stopPropagation();
        onClick && onClick();
      }}
      data-testid={dataTestId}
      variant={outlined ? "outlined" : "contained"}
      sx={{
        fontSize: "13px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: "700",
        letterSpacing: "1px",
        padding: "8px 20px",
        borderRadius: "20px",
        boxShadow: "none",
        backgroundColor: disabled
          ? "lightgray"
          : outlined
          ? "#fff"
          : getPrimaryColor(),
        color: disabled ? "#A9A9A9" : outlined ? getPrimaryColor() : "#fff",
        borderColor: disabled ? "lightgray" : getPrimaryColor(),
        margin: "0 8px", // <-- Add margin to separate buttons
      }}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
