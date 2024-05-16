import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Divider, Grid, Typography } from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import { styles } from '../../../constants/styles'

import { useTranslation } from 'react-i18next'
import {
  ForgetPassUser,
  UserAccount,
  ForgetPassForm
} from '../../../interfaces/userAccount'
import { ToastContainer, toast } from 'react-toastify'
import { getUserAccountById } from '../../../APICalls/Collector/userGroup'
import {
  approveForgetPasswordRequest,
  rejectForgetPasswordRequest
} from '../../../APICalls/forgetPassword'
import { localStorgeKeyName } from '../../../constants/constant'
import { showErrorToast, showSuccessToast } from '../../../utils/utils'

interface ApproveRejectForgetPassProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  onSubmitData: () => void
  rowId?: number
  selectedItem?: ForgetPassUser | null
}

const ApproveRejectForgetPass: FunctionComponent<
  ApproveRejectForgetPassProps
> = ({ drawerOpen, handleDrawerClose, onSubmitData, selectedItem }) => {
  const { t } = useTranslation()
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null)
  const loginName = localStorage.getItem(localStorgeKeyName.username) || ''

  useEffect(() => {
    if (selectedItem) {
      getUserAccount()
    }
  }, [drawerOpen])

  const getUserAccount = async () => {
    if (selectedItem) {
      const result = await getUserAccountById(selectedItem.loginId)
      if (result) {
        setUserAccount(result.data)
      }
    }
  }

  const handleApprove = async () => {
    if (selectedItem) {
      const form: ForgetPassForm = {
        forgetPWId: selectedItem?.forgetPWId,
        userName: selectedItem?.loginId,
        updatedBy: loginName
      }
      const result = await approveForgetPasswordRequest(form)
      if (result) {
        showSuccessToast(t('common.approveSuccess'))
        handleDrawerClose()
        onSubmitData()
      } else {
        showErrorToast(t('common.approveFailed'))
      }
    }
  }

  const handleReject = async () => {
    if (selectedItem) {
      const form: ForgetPassForm = {
        forgetPWId: selectedItem?.forgetPWId,
        userName: selectedItem?.loginId,
        updatedBy: loginName
      }
      const result = await rejectForgetPasswordRequest(form)
      if (result) {
        showSuccessToast(t('common.rejectSuccess'))
        handleDrawerClose()
        onSubmitData()
      } else {
        showErrorToast(t('common.rejectFailed'))
      }
    }
  }

  return (
    <div className="add-user-account">
      <ToastContainer></ToastContainer>
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={'edit'}
        headerProps={{
          title: t('userAccount.resetPassword'),
          subTitle: '',
          submitText: t('check_in.approve'),
          cancelText: t('check_in.reject'),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleApprove,
          onDelete: handleReject
        }}
      >
        <Divider></Divider>
        <Box sx={{ PaddingX: 2 }}>
          <Grid
            container
            direction={'column'}
            spacing={4}
            sx={{
              width: { xs: '100%' },
              marginTop: { sm: 2, xs: 6 },
              marginLeft: {
                xs: 0
              },
              paddingRight: 2
            }}
            className="sm:ml-0 mt-o w-full"
          >
            <Grid item>
              <Typography sx={{ ...localstyles.typo_fieldTitle }}>
                {t('userAccount.staffId')}
              </Typography>
              <Typography sx={{ ...localstyles.typo_fieldContent }}>
                {userAccount?.staffId}
              </Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ ...localstyles.typo_fieldTitle }}>
                {t('userAccount.loginName')}
              </Typography>
              <Typography sx={{ ...localstyles.typo_fieldContent }}>
                {selectedItem?.loginId}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </RightOverlayForm>
    </div>
  )
}

const localstyles = {
  typo_fieldTitle: {
    fontSize: '13px',
    color: '#ACACAC',
    letterSpacing: '1px'
  },
  typo_fieldContent: {
    fontSize: '15px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    marginTop: '2px'
  }
}

export default ApproveRejectForgetPass
