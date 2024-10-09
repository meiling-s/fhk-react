import { useState } from 'react'
import { Button, Modal, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import CustomItemList from '../../components/FormComponents/CustomItemList'

import { editPickupOrderStatus } from '../../APICalls/Collector/pickupOrder/pickupOrder'
import { extractError, showErrorToast } from '../../utils/utils'
import { STATUS_CODE } from '../../constants/constant'

type rejectForm = {
  open: boolean
  onClose: () => void
  selectedRow: any
  reasonList: any
  navigate: (url: string) => void
}

const Required = () => {
  return (
    <Typography sx={{ color: 'red', ml: '5px' }}>
      *
    </Typography>
  )
}

function RejectForm({ open, onClose, selectedRow, reasonList, navigate }: rejectForm) {
  const { t } = useTranslation()
  const [rejectReasonId, setRejectReasonId] = useState<string>('')

  // Function to handle modal close and reset state
  const handleModalClose = () => {
    setRejectReasonId('') // Reset the rejectReasonId state
    onClose() // Trigger the parent's onClose callback
  }

  const handleConfirmRejectOnClick = async (rejectReasonId: string) => {
    const rejectReasonItem = reasonList.find(
      (item: { id: string }) => item.id === rejectReasonId
    )
    const reason = rejectReasonItem?.name || ''
    const updatePoStatus = {
      status: 'REJECTED',
      reason: reason,
      updatedBy: selectedRow.updatedBy,
      version: selectedRow.version
    }
    try {
      const result = await editPickupOrderStatus(selectedRow.picoId, updatePoStatus)
      if (result) {
        toast.info(t('pick_up_order.rejected_success'), {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        })
        handleModalClose() // Close the modal and reset state
      }
    } catch (error: any) {
      const { state } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      } else if (state.code === STATUS_CODE[409]) {
        showErrorToast(error.response.data.message)
      }
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleModalClose} // Use the new handleModalClose function
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: 'bold' }}
            >
              {t('pick_up_order.confirm_reject_title')}
            </Typography>
          </Box>
          <Box>
            <Typography sx={localstyles.typo}>
              {t('pick_up_order.reject_reasons')}
              <Required />
            </Typography>
            <CustomItemList items={reasonList} singleSelect={setRejectReasonId} />
          </Box>

          <Box sx={{ alignSelf: 'center' }}>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={() => {
                handleConfirmRejectOnClick(rejectReasonId)
              }}
              disabled={!rejectReasonId}
              style={{
                backgroundColor: !rejectReasonId ? '#e0e0e0' : '#79ca25',
                color: !rejectReasonId ? '#9e9e9e' : 'white',
                cursor: !rejectReasonId ? 'not-allowed' : 'pointer',
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none'
              }}
            >
              {t('pick_up_order.confirm_reject')}
            </button>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={handleModalClose} // Use the new handleModalClose function
              style={{
                backgroundColor: 'white',
                color: '#79ca25',
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid #79ca25'
              }}
            >
              {t('pick_up_order.cancel')}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}

let localstyles = {
  btn_WhiteGreenTheme: {
    borderRadius: '20px',
    borderWidth: 1,
    borderColor: '#79ca25',
    backgroundColor: 'white',
    color: '#79ca25',
    fontWeight: 'bold',
    '&.MuiButton-root:hover': {
      bgcolor: '#F4F4F4',
      borderColor: '#79ca25'
    }
  },

  typo: {
    color: '#ACACAC',
    fontSize: 13,
    display: 'flex'
  },

  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '34%',
    height: 'fit-content',
    padding: 4,
    backgroundColor: 'white',
    border: 'none',
    borderRadius: 5
  }
}

export default RejectForm
