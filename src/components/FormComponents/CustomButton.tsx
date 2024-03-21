import React from 'react';
import { Button } from '@mui/material';
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
          backgroundColor: outlined ? '#fff' : '#7CE495',
          color: outlined ? '#7CE495' : '#fff',
          borderColor: '#7CE495'
        };
        break;
      case 'blue':
        style = {
          backgroundColor: outlined ? '#fff' : '#6BC7FF',
          color: outlined ? '#6BC7FF' : '#fff',
          borderColor: outlined ? '#BEE1E8' : '#6BC7FF'
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
