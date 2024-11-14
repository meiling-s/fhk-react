import React from 'react'
import ConfirmModal from './SpecializeComponents/ConfirmationModal'
import { useTranslation } from 'react-i18next'

type TypeModalConfirmRemarksEmpty = {
  openConfirmModal: TypeModalState
  setOpenConfirmModal: (params: TypeModalState) => void
  values?: {
    productSubTypeRemark?: string,
    productAddOnTypeRemark?: string,
  }
}


const validateRemarks = ({ openConfirmModal, setOpenConfirmModal, values }: TypeModalConfirmRemarksEmpty): boolean => {

  try {

    let isValid = true

    const {
      isProductSubTypeOthers,
      isProductAddonTypeOthers,
      isConfirmed,
    } = openConfirmModal?.tempData

    const isTypeOthers = (isProductSubTypeOthers || isProductAddonTypeOthers)

    let isRemarksMissing = false

    if (isProductSubTypeOthers) {
      isRemarksMissing = !Boolean(values?.productSubTypeRemark)
    }
    if (isProductAddonTypeOthers) {
      isRemarksMissing = !Boolean(values?.productAddOnTypeRemark)
    }

    if (isTypeOthers && !isConfirmed && isRemarksMissing) {

      isValid = false
      setOpenConfirmModal({
        ...openConfirmModal,
        isOpen: true,
      })

    }
    return isValid

  }
  catch (err) {

    return true

  }

}

const initialState = {
  openConfirmModal: {
    isOpen: false,
    tempData: {
      isConfirmed: false,
      isProductSubTypeOthers: false,
      isProductAddonTypeOthers: false,
    }
  }
}

type TypeModalState = {
  isOpen: boolean,
  tempData: {
    isConfirmed: boolean,
    isProductSubTypeOthers: boolean
    isProductAddonTypeOthers: boolean
  }
}

type TypeComponentModal =
  TypeModalConfirmRemarksEmpty &
  {
    onConfirm: (params?: any) => void | Promise<void>
  }

const Component = ({
  openConfirmModal,
  setOpenConfirmModal,
  onConfirm,
}: TypeComponentModal) => {

  const { t } = useTranslation()

  return (
    <ConfirmModal
      isOpen={openConfirmModal?.isOpen}
      message={t('pick_up_order.confirm_empty_remarks')}
      onConfirm={async () => {
        setOpenConfirmModal({
          isOpen: false,
          tempData: {
            ...openConfirmModal.tempData,
            isConfirmed: true,
          }
        })
        onConfirm()
      }}
      onCancel={() => setOpenConfirmModal({
        ...openConfirmModal,
        isOpen: false,
      })}
    />
  )

}

export default function useModalConfirmRemarksEmpty({ onConfirm }: {
  onConfirm: (params?: any) => void
}) {

  const [openConfirmModal, setOpenConfirmModal] = React.useState<TypeModalState>(initialState.openConfirmModal)


  const resetModal = () =>{
    setOpenConfirmModal(initialState.openConfirmModal)
  }

  return {
    openConfirmModal,
    setOpenConfirmModal,
    resetModal,
    validateRemarks,
    ModalConfirmRemarksEmpty: () => (
      <Component
        openConfirmModal={openConfirmModal}
        setOpenConfirmModal={setOpenConfirmModal}
        onConfirm={onConfirm}
      />
    )
  }
}