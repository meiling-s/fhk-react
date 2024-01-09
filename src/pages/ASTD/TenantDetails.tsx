import { FunctionComponent, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import CheckIcon from '@mui/icons-material/Check'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import RightOverlayForm from '../../components/RightOverlayForm'
import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import CustomField from '../../components/FormComponents/CustomField'
import CustomTextField from '../../components/FormComponents/CustomTextField'
import CommonTypeContainer from '../../contexts/CommonTypeContainer'
import CustomItemList, {
  il_item
} from '../../components/FormComponents/CustomItemList'
import { useContainer } from 'unstated-next'

import dayjs from 'dayjs'
import { format } from '../../constants/constant'

interface Company {}

interface CheckOutDetailsProps {
  selectedTenant?: Company
  drawerOpen: boolean
  handleDrawerClose: () => void
}

const TenantDetails: FunctionComponent<CheckOutDetailsProps> = ({
  selectedTenant,
  drawerOpen = false,
  handleDrawerClose
}) => {
  const { t } = useTranslation()

  const poNumber = '343536'
  const messageCheckout = `[UserID] ${t('check_out.approved_on')} `
  const mainInfoFields = [
    {
      label: t('tenant.detail.company_category'),
      value: 'test'
    },
    {
      label: t('tenant.detail.company_name_traditional_chinese'),
      value: 'test'
    },
    {
      label: t('tenant.detail.company_name_simplified_chinese'),
      value: 'test'
    },
    {
      label: t('tenant.detail.company_english_name'),
      value: 'test'
    },
    {
      label: t('tenant.detail.business_registration_number'),
      value: 'test'
    }
  ]

  const statuses: il_item[] = [
    { id: '1', name: t('status.enable') },
    { id: '2', name: t('status.not_enabled') },
    { id: '3', name: t('status.terminated') }
  ]

  const setStatus = () => {}

  useEffect(() => {}, [])

  const handleReasonDeact = () => {}

  const handleChangeAccount = () => {}

  return (
    <div className="checkin-request-detail">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={'none'}
        headerProps={{
          title: t('check_out.request_check_out'),
          subTitle: poNumber,
          onCloseHeader: handleDrawerClose
        }}
      >
        <div
          style={{ borderTop: '1px solid lightgrey' }}
          className="content p-6"
        >
          <Stack spacing={4}>
            <Box>
              {mainInfoFields.map((field, index) => (
                <div className="field mb-6" key={index}>
                  <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                    {field.label}
                  </div>
                  <div className=" text-sm text-black font-bold tracking-widest">
                    {field.value}
                  </div>
                </div>
              ))}
            </Box>
            <Box>
              <div className="img-contract">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-4">
                  {t('tenant.detail.business_reg_number_picture')}
                </div>
                <div className="">
                  <img
                    src={'/Image.png'}
                    alt="logo_company"
                    style={{ width: '70px' }}
                  />
                </div>
              </div>
            </Box>
            <Box>
              <div className="field-contact-person">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t('tenant.detail.contact_person_name')}
                </div>
                <div className=" text-sm text-black font-bold tracking-widest">
                  test
                </div>
              </div>
            </Box>
            <Box>
              <div className="field-phone-number mt-6">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t('tenant.detail.contact_phone_number')}
                </div>
                <div className=" text-sm text-black font-bold tracking-widest">
                  test
                </div>
              </div>
            </Box>
            <Box>
              <div className="epd_contract mt-6">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-4">
                  {t('tenant.detail.epd_contract')}
                </div>
                <div className="">
                  <img
                    src={'/Image.png'}
                    alt="logo_company"
                    style={{ width: '70px' }}
                  />
                </div>
              </div>
            </Box>
            <Box>
              <div className="field-creation-date mt-6">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t('tenant.detail.creation_date')}
                </div>
                <div className=" text-sm text-black font-bold tracking-widest">
                  test
                </div>
              </div>
            </Box>
            <Box>
              <div className="logo mt-6">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-4">
                  {t('tenant.detail.epd_contract')}
                </div>
                <div className="">
                  <img
                    src={'/Image.png'}
                    alt="logo_company"
                    style={{ width: '70px' }}
                  />
                </div>
              </div>
            </Box>
            <Box>
              <div className="field-remark mt-6">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t('tenant.detail.remark')}
                </div>
                <div className=" text-sm text-black font-bold tracking-widest">
                  -
                </div>
              </div>
            </Box>
            <Box>
              <div className="field-status">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t('tenant.detail.number_of_accounts')}
                </div>
                <div className="items">
                  <FormControl sx={dropDown}>
                    <InputLabel>{t('tenant.detail.number_of_accounts')}</InputLabel>
                    <Select
                      labelId="company-label"
                      id="company"
                      value={2}
                      label={t('check_out.any')}
                      onChange={handleChangeAccount}
                    >
                      {/* {filterCheckOut.map((item) => ( */}
                      <MenuItem value={2}>{2}</MenuItem>
                      {/* ))} */}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </Box>
            <Box>
              <div className="field-status">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t('tenant.detail.ways_of_entry_and_exit')}
                </div>
                <div className="items">
                  <CustomItemList items={statuses} singleSelect={setStatus} />
                </div>
              </div>
            </Box>
            <Box>
              <div className="field-status">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t('tenant.detail.number_of_photos_uploaded')}
                </div>
                <div className="items">
                  <FormControl sx={dropDown}>
                    <InputLabel>{t('tenant.detail.number_of_photos_uploaded')}</InputLabel>
                    <Select
                      labelId="company-label"
                      id="company"
                      value={2}
                      label={t('check_out.any')}
                      onChange={handleChangeAccount}
                    >
                      {/* {filterCheckOut.map((item) => ( */}
                      <MenuItem value={2}>{2}</MenuItem>
                      {/* ))} */}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </Box>
            <Box>
              <CustomField
                mandatory
                label={t('tenant.detail.max_photo_upload_capacity')}
              >
                <CustomTextField
                  id={'please_enter_capacity_mb'}
                  placeholder={t('tenant.detail.please_enter_capacity_mb')}
                  rows={1}
                  onChange={handleReasonDeact}
                  value={''}
                  sx={{ width: '100%' }}
                ></CustomTextField>
              </CustomField>
            </Box>
            <Box>
              <div className="field-status">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t('tenant.detail.account_status')}
                </div>
                <div className="items">
                  <CustomItemList items={statuses} singleSelect={setStatus} />
                </div>
              </div>
            </Box>
            <Box>
              <CustomField
                mandatory
                label={t('tenant.detail.reason_for_deactivation')}
              >
                <CustomTextField
                  id={'reason_for_deactivation'}
                  placeholder={t('tenant.detail.please_enter_the_reason')}
                  multiline={true}
                  rows={4}
                  onChange={handleReasonDeact}
                  value={''}
                  sx={{ width: '100%' }}
                ></CustomTextField>
              </CustomField>
            </Box>
            <Box>
              <div className="field-remark">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {messageCheckout}
                </div>
              </div>
            </Box>
          </Stack>
        </div>
      </RightOverlayForm>
    </div>
  )
}

const categoryRecyle: React.CSSProperties = {
  height: '25px',
  width: '25px',
  padding: '4px',
  textAlign: 'center',
  background: 'lightskyblue',
  lineHeight: '25px',
  borderRadius: '25px',
  color: 'darkblue'
}

let dropDown = {
  mt: 3,
  borderRadius: '10px',
  width: '100%',
  bgcolor: 'white',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.23)'
    },
    '&:hover fieldset': {
      borderColor: '#79CA25'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#79CA25'
    }
  }
}

export default TenantDetails
