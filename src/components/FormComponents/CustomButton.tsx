import React from 'react'
import { Button } from '@mui/material'
import { getPrimaryColor } from '../../utils/utils'
interface ButtonProps {
  id?: string
  text?: string
  disabled?: boolean
  className?: string
  onClick?: () => void
  color?: string
  outlined?: Boolean
  style?: object
  dataTestId?: string
}

const CustomButton: React.FC<ButtonProps> = ({
  id = '',
  text = '',
  disabled = false,
  className,
  onClick,
  color = 'green',
  outlined = false,
  style = {},
  dataTestId = ''
}) => {
  const getStyle = () => {
    let style = {}
    switch (color) {
      case 'green':
        style = {
          backgroundColor: disabled
            ? 'light-gray'
            : outlined
            ? '#fff'
            : getPrimaryColor(),
          color: disabled
            ? 'light-gray'
            : outlined
            ? getPrimaryColor()
            : '#fff',
          borderColor: disabled ? 'light-gray' : getPrimaryColor(),
          cursor: disabled ? 'not-allowed' : 'pointer'
        }
        break
      case 'blue':
        style = {
          backgroundColor: disabled
            ? 'light-gray'
            : outlined
            ? '#fff'
            : getPrimaryColor(),
          color: disabled
            ? 'light-gray'
            : outlined
            ? getPrimaryColor()
            : '#fff',
          borderColor: disabled
            ? 'light-gray'
            : outlined
            ? getPrimaryColor()
            : getPrimaryColor(),
          cursor: disabled ? 'not-allowed' : 'pointer'
        }
        break
      default:
        break
    }
    return style
  }

  return (
    <Button
      id={id}
      disabled={disabled}
      className={className}
      onClick={(event) => {
        event.stopPropagation()
        onClick && onClick()
      }}
      data-testid={dataTestId}
      variant={outlined ? 'outlined' : 'contained'}
      style={{ ...getStyle(), ...style }}
      sx={{
        fontSize: '13px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: '700',
        letterSpacing: '1px',
        padding: '8px 20px',
        borderRadius: '20px',
        boxShadow: 'none'
      }}
    >
      {text}
    </Button>
  )
}

export default CustomButton
