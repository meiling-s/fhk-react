import React, { useState, useEffect, ReactNode } from 'react'
import Drawer from '@mui/material/Drawer'
import StatusCard from './StatusCard'
import { useContainer } from 'unstated-next'
import NotifContainer from '../contexts/NotifContainer'

type HeaderProps = {
  title?: string
  subTitle?: string
  submitText?: string
  cancelText?: string
  onCloseHeader?: () => void
  onSubmit?: () => void
  onDelete?: () => void
  action?: 'add' | 'edit' | 'delete' | 'none',
  statusLabel?: string
  isButtonCancel?: boolean,
  isButtonFinish?: boolean
}

type RightOverlayFormProps = {
  open: boolean
  onClose?: () => void
  children?: ReactNode
  anchor?: 'left' | 'right'
  showHeader?: boolean
  headerProps?: HeaderProps
  action?: 'add' | 'edit' | 'delete' | 'none',
}

const HeaderSection: React.FC<HeaderProps> = ({
  title,
  subTitle,
  submitText,
  cancelText,
  onCloseHeader,
  onSubmit,
  onDelete,
  action = 'add',
  statusLabel,
  isButtonCancel,
  isButtonFinish
}) => {
  return (
    <div className="header-section">
      <div className="flex flex-row items-center justify-between p-[25px] gap-[25px">
        <div className='md:flex items-center gap-2 sm:block'>
        <div className="flex-1 flex flex-col items-start justify-start sm:mb-2">
          <b className="md:text-sm sm:text-xs">{title}</b>
          <div className="md:text-smi sm:text-2xs text-grey-dark text-left">
            {subTitle}
          </div>
        </div>
        {statusLabel && (
          <StatusCard status={statusLabel} />
          
        )}
        </div>
        <div className='right-action flex items-center'>
        {action !== 'none' && (
          <div className="h-9 flex flex-row items-start justify-start gap-[12px] text-smi text-white">
            { isButtonFinish && <button
                onClick={onSubmit}
                disabled={action === 'delete'}
                className={`${
                  action === 'delete' ? 'cursor-not-allowed  bg-green-primary border-gray' : ' bg-green-primary cursor-pointer'
                } rounded-6xl flex flex-row items-center  text-white justify-center py-2 px-5 gap-[5px] border-[1px] border-solid border-green-primary`}
              >
                {submitText}
              </button>
            }

            {isButtonCancel &&  <button
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
            }
            
           
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
    </div>
  )
}

const RightOverlayFormCustom: React.FC<RightOverlayFormProps> = ({
  open,
  onClose,
  children,
  anchor = 'left',
  showHeader = true,
  headerProps,
  action = 'add'
}) => {
  const [isOpen, setIsOpen] = useState(open)
  const { marginTop } = useContainer(NotifContainer)

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
          isOpen ? `md:w-[550px] w-[100vw] mt-[${marginTop}]` : 'hidden'
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

export default RightOverlayFormCustom
