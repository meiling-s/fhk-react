import { FunctionComponent, useState, useEffect } from 'react'
import {
  Box,
  Divider,
  Grid,
  Typography,
  InputLabel,
  MenuItem,
  FormControl
} from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import CustomField from '../../../components/FormComponents/CustomField'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import CustomItemList from '../../../components/FormComponents/CustomItemList'
import { styles } from '../../../constants/styles'

import { useTranslation } from 'react-i18next'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { formValidate } from '../../../interfaces/common'
import { formErr } from '../../../constants/constant'
import { returnErrorMsg } from '../../../utils/utils'
import { il_item } from '../../../components/FormComponents/CustomItemList'

import { localStorgeKeyName } from '../../../constants/constant'
import Switches from '../../../components/FormComponents/CustomSwitch'
import LabelField from '../../../components/FormComponents/CustomField'
import { getUserGroup } from '../../../APICalls/commonManage'
import { CreateUserAccount, UserAccount } from '../../../interfaces/userAccount'
import { ToastContainer, toast } from 'react-toastify'
import {
  postUserAccount,
  updateUserAccount,
  deleteUserAccount
} from '../../../APICalls/userAccount'

interface ApproveRejectForgetPassProps {
  drawerOpen: boolean
  handleDrawerClose: () => void

  onSubmitData: () => void
  rowId?: number
  selectedItem?: UserAccount | null
}

const ApproveRejectForgetPass: FunctionComponent<
  ApproveRejectForgetPassProps
> = ({ drawerOpen, handleDrawerClose, onSubmitData, selectedItem }) => {
  const { t } = useTranslation()

  useEffect(() => {
    //getUserGroupList()
  }, [drawerOpen])

  const handleApprove = () => {}

  const handleReject = async () => {}

  return (
    <div className="add-user-account">
      <ToastContainer></ToastContainer>
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={'edit'}
        headerProps={{
          title: 'forget pss',
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
              <Typography
                sx={{ ...localstyles.typo_fieldTitle, marginBottom: 1 }}
              >
                {t('userAccount.userGroup')}
              </Typography>
              <Typography sx={{ ...localstyles.typo_fieldContent }}>
                {t('userAccount.userGroup')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                sx={{ ...localstyles.typo_fieldTitle, marginBottom: 1 }}
              >
                {t('userAccount.userGroup')}
              </Typography>
              <Typography sx={{ ...localstyles.typo_fieldContent }}>
                {t('userAccount.userGroup')}
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
