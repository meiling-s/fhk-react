import React, { useState, useEffect, ReactNode } from 'react'
import Drawer from '@mui/material/Drawer'
import StatusCard from './StatusCard'
import { Box, Button, Typography } from '@mui/material'
import { styles } from '../constants/styles'
import { useContainer } from 'unstated-next'
import NotifContainer from '../contexts/NotifContainer'
import { Roles, localStorgeKeyName } from '../constants/constant'
import CustomButton from './FormComponents/CustomButton'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PickupOrder } from '../interfaces/pickupOrder'
import { editPickupOrderDetailStatus, editPickupOrderStatus, getPicoById } from '../APICalls/Collector/pickupOrder/pickupOrder'

type HeaderProps = {
  title?: string
  subTitle?: string
  submitText?: string
  cancelText?: string
  onCloseHeader?: () => void
  onSubmit?: () => void
  onDelete?: () => void
  action?: 'add' | 'edit' | 'delete' | 'none'
  statusLabel?: string,
  selectedRow?: PickupOrder | null | undefined,
  initPickupOrderRequest?: () => void
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
  action = 'add',
  statusLabel,
  selectedRow,
  initPickupOrderRequest,
}) => {
  const role = localStorage.getItem(localStorgeKeyName.role)
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId)
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigateToJobOrder = (picoId: string) => {
    navigate(`/logistic/createJobOrder/${picoId}?isEdit=false`)
  }
  
  const handleRowClick = async () => {
   
    const routeName = role
    const result = await getPicoById(selectedRow ? selectedRow.picoId : '')
    console.log('selectedItem', selectedRow?.picoId, result)
    if (result) {
      navigate(`/${routeName}/editPickupOrder`, { state: result.data })
    }
  }

  const onDeleteClick = async () => {
    if (selectedRow) {
      const updatePoStatus = {
        status: 'CLOSED',
        reason: selectedRow.reason,
        updatedBy: selectedRow.updatedBy
      }
      const updatePoDtlStatus = {
        status: 'CLOSED',
        updatedBy: selectedRow.updatedBy
      }
      try {
        const result = await editPickupOrderStatus(
          selectedRow.picoId,
          updatePoStatus
        )
        if (result) {
          const detailUpdatePromises =
          selectedRow.pickupOrderDetail.map((detail) =>
              editPickupOrderDetailStatus(
                detail.picoDtlId.toString(),
                updatePoDtlStatus
              )
            )
          await Promise.all(detailUpdatePromises)
          initPickupOrderRequest &&  initPickupOrderRequest()
        }
        onCloseHeader && onCloseHeader()
        navigate('/collector/PickupOrder')
      } catch (error) {
        //console.error('Error updating field:', error)
      }
    } else {
      alert('No selected pickup order')
    }
  }
  
  return (
    <div className="header-section">
      <div className="flex flex-row items-center justify-between p-[25px] gap-[25px">
      <div className="md:flex items-center gap-2 sm:block">
        <div className="flex-1 flex flex-col items-start justify-start sm:mb-2">
          <b className="md:text-sm sm:text-xs">{title}</b>
          <div className="md:text-smi sm:text-2xs text-grey-dark text-left">
            {subTitle}
          </div>
        </div>
        {statusLabel && <StatusCard status={statusLabel} />}
      </div>
      <div className="right-action flex items-center">
        {/* {action !== 'none' && (
          <div className="h-9 flex flex-row items-start justify-start gap-[12px] text-smi text-white">
            <Button
              sx={[
                styles.buttonFilledGreen,
                {
                  width: 'max-content',
                  height: '40px'
                }
              ]}
              disabled={action === 'delete'}
              onClick={onSubmit}
            >
              {submitText}
            </Button>

            {cancelText != '' && (
              <Button
                sx={[
                  styles.buttonOutlinedGreen,
                  {
                    width: 'max-content',
                    height: '40px'
                  }
                ]}
                variant="outlined"
                disabled={action === 'add'}
                onClick={onDelete}
              >
                {cancelText}
              </Button>
            )}
          </div>
        )} */}
        
         <Box sx={{ marginLeft: 'auto' }}>
          {role === 'logistic' &&
          statusLabel &&
          ['STARTED', 'OUTSTANDING'].includes(statusLabel) ? (
            <CustomButton
              text={t('pick_up_order.table.create_job_order')}
              onClick={() => {
                if(selectedRow?.picoId){
                  navigateToJobOrder(selectedRow?.picoId.toString())
                }
              }}
            ></CustomButton>
          ) : role === 'logistic' &&
            selectedRow &&
            selectedRow.status === 'CREATED' &&
            selectedRow?.tenantId === tenantId ? (
            <>
              <CustomButton
              text={t('pick_up_order.item.edit')}
              style={{ marginRight: '12px' }}
              onClick={() => {
                selectedRow && handleRowClick()
              }}
            />
              <CustomButton
                text={t('pick_up_order.item.delete')}
                outlined
                onClick={onDeleteClick}
              />
            </>
          ) : role !== 'logistic' && selectedRow?.status === 'CREATED'  ? (
            <>
              <CustomButton
                text={t('pick_up_order.item.edit')}
                style={{ marginRight: '12px' }}
                onClick={() => {
                  selectedRow && handleRowClick()
                }}
              ></CustomButton>
              <CustomButton
                text={t('pick_up_order.item.delete')}
                outlined
                onClick={onDeleteClick}
              ></CustomButton>
            </>
          ) : null}
        </Box>

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
  const { marginTop } = useContainer(NotifContainer);
  
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
      sx={{
        '& .MuiDrawer-paper': {
          marginTop: `${marginTop}`
        }
      }}
    >
      <div
        className={`border-b-[1px] border-grey-line h-full ${
          isOpen ? `md:w-[700px] w-[100vw] mt-[${marginTop}]` : 'hidden'
        }`}
      >
        {showHeader ? (
          <div className="header">
            <HeaderSection {...headerProps} action={action}  />
          </div>
        ) : null}

        <div className="">{children}</div>
      </div>
    </Drawer>
  )
}

export default RightOverlayForm
