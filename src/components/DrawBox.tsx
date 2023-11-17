import React, { useState, useEffect, ReactNode } from 'react'
import Drawer from '@mui/material/Drawer'
import PropTypes from 'prop-types'

type DrawerBoxProps = {
  open: boolean
  onClose?: () => void
  children?: ReactNode
  anchor?: 'left' | 'right'
}

const DrawerBox: React.FC<DrawerBoxProps> = ({
  open,
  onClose: onCloseProp,
  children,
  anchor = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(open)

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  const handleClose = () => {
    setIsOpen(false)
    if (onCloseProp) {
      onCloseProp()
    }
  }

  return (
    <Drawer
      open={isOpen}
      onClose={handleClose}
      anchor={anchor}
      variant={'temporary'}
    >
      <div
        className={`border-b-[1px] border-grey-line h-full ${
          isOpen ? 'md:w-[500px] w-[100vw]' : 'hidden'
        }`}
      >
        <div className="">{children}</div>
      </div>
    </Drawer>
  )
}

DrawerBox.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  children: PropTypes.node,
  anchor: PropTypes.oneOf(['left', 'right'])
}

export default DrawerBox
