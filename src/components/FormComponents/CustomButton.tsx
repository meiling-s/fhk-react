import React from 'react';
import { Button } from '@mui/material';
import { getPrimaryColor } from '../../utils/utils';
interface ButtonProps {
  id?: string;
  text?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  color?: string;
  outlined?: Boolean;
  style?: object;
}

const CustomButton: React.FC<ButtonProps> = ({
  id = '',
  text = '',
  disabled = false,
  className,
  onClick,
  color = 'green',
  outlined = false,
  style = {}
}) => {
  const getStyle = () => {
    let style = {};
    switch (color) {
      case 'green':
        style = {
          backgroundColor: outlined ? '#fff' : getPrimaryColor(),
          color: outlined ? getPrimaryColor() : '#fff',
          borderColor: getPrimaryColor()
        };
        break;
      case 'blue':
        style = {
          backgroundColor: outlined ? '#fff' : getPrimaryColor(),
          color: outlined ? getPrimaryColor() : '#fff',
          borderColor: outlined ? getPrimaryColor() : getPrimaryColor()
        };
        break;
      default:
        break;
    }
    return style
  };

  return (
    <Button
      id={id}
      disabled={disabled}
      className={className}
      onClick={(event) => {
        event.stopPropagation()
        onClick && onClick()
      }}
      variant={outlined ? 'outlined' : 'contained'}
      style={{...getStyle(), ...style}}
      sx={{
        fontSize: '13px',
        fontWeight: '700',
        letterSpacing: '1px',
        padding: '8px 20px',
        borderRadius: '20px',
        boxShadow: 'none'
      }}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
