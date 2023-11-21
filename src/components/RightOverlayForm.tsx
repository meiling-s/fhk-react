import React, { useState, useEffect, ReactNode } from 'react'
import Drawer from '@mui/material/Drawer'

type HeaderProps = {
  title?: string
  subTitle?: string
  submitText?: string
  cancelText?: string
  onCloseHeader?: () => void
  onSubmit?: () => void
  onCancel?: () => void
}

type RightOverlayFormProps = {
  open: boolean
  onClose?: () => void
  children?: ReactNode
  anchor?: 'left' | 'right'
  showHeader?: boolean
  headerProps?: HeaderProps
}

const HeaderSection: React.FC<HeaderProps> = ({
  title,
  subTitle,
  submitText,
  cancelText,
  onCloseHeader,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="header-section">
      <div className="flex flex-row items-center justify-start p-[25px] gap-[25px">
        <div className="flex-1 flex flex-col items-start justify-start">
          <b className="leading-[28px]">{title}</b>
          <div className="text-smi tracking-[1px] leading-[20px] text-grey-dark text-left">
            {subTitle}
          </div>
        </div>
        <div className="h-9 flex flex-row items-start justify-start gap-[12px] text-smi text-white">
          <div
            onClick={onSubmit}
            className="rounded-6xl bg-green-primary overflow-hidden flex flex-row items-center justify-center py-2 px-5 gap-[5px] cursor-pointer"
          >
            <b className="relative tracking-[1px] leading-[20px]">
              {submitText}
            </b>
          </div>
          <div
            onClick={onCancel}
            className="rounded-6xl  overflow-hidden flex flex-row items-center justify-center py-2 px-5 gap-[5px] text-green-primary border-[1px] border-solid border-green-pale"
          >
            <b className="relative tracking-[1px] leading-[20px]">
              {cancelText}
            </b>
          </div>
        </div>
        <div className="close-icon ml-2">
          <img
            className="relative w-6 h-6 overflow-hidden shrink-0"
            alt=""
            src="/collapse1.svg"
            onClick={onCloseHeader}
          />
        </div>
      </div>
    </div>
  )
}

const RightOverlayForm: React.FC<RightOverlayFormProps> = ({
  open,
  onClose,
  children,
  anchor = 'left',
  showHeader = true,
  headerProps
}) => {
  const [isOpen, setIsOpen] = useState(open)

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
    setIsOpen(false)
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
          isOpen ? 'md:w-[550px] w-[100vw]' : 'hidden'
        }`}
      >
        {showHeader ? (
          <div className="header">
            <HeaderSection {...headerProps} />
          </div>
        ) : null}

        <div className="">{children}</div>
      </div>
    </Drawer>
  )
}

export default RightOverlayForm
