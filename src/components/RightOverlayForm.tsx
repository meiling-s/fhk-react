import React, { useState, useEffect, ReactNode } from 'react'
import Drawer from '@mui/material/Drawer'

type HeaderProps = {
  title?: string
  subTitle?: string
  submitText?: string
  cancelText?: string
  onCloseHeader?: () => void
  onSubmit?: () => void
  onDelete?: () => void
  action?: 'add' | 'edit' | 'delete' | 'none'
}

type RightOverlayFormProps = {
  open: boolean
  onClose?: () => void
  children?: ReactNode
  anchor?: 'left' | 'right'
  showHeader?: boolean
  headerProps?: HeaderProps
  action?: 'add' | 'edit' | 'delete' | 'none'
}

const HeaderSection: React.FC<HeaderProps> = ({
  title,
  subTitle,
  submitText,
  cancelText,
  onCloseHeader,
  onSubmit,
  onDelete,
  action = 'add'
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
        {action !== 'none' && (
          <div className="h-9 flex flex-row items-start justify-start gap-[12px] text-smi text-white">
            <button
              onClick={onSubmit}
              disabled={action === 'delete'}
              className={`${
                action === 'delete' ? 'cursor-not-allowed  bg-green-primary border-gray' : ' bg-green-primary cursor-pointer'
              } rounded-6xl flex flex-row items-center  text-white justify-center py-2 px-5 gap-[5px] border-[1px] border-solid border-green-primary`}
            >
              {submitText}
            </button>
            <button
              onClick={onDelete}
              disabled={action === 'add'}
              className={`${
                action === 'add' 
                  ? 'cursor-not-allowed text-gray border-gray'
                  : 'cursor-pointer'
              } rounded-6xl  overflow-hidden flex flex-row items-center justify-center py-2 px-5 gap-[5px] text-green-primary border-[1px] border-solid border-green-pale`}
            >
              {cancelText}
            </button>
          </div>
        )}

        <div className="close-icon ml-2 cursor-pointer">
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
  headerProps,
  action = 'add'
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
            <HeaderSection {...headerProps} action={action} />
          </div>
        ) : null}

        <div className="">{children}</div>
      </div>
    </Drawer>
  )
}

export default RightOverlayForm
