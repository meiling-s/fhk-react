import { FunctionComponent, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import RightOverlayForm from '../../components/RightOverlayForm'
import {
  Box,
  Stack,
  FormControl,
  InputLabel,
  Typography,
  MenuItem,
  Grid
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import CustomField from '../../components/FormComponents/CustomField'
import CustomTextField from '../../components/FormComponents/CustomTextField'
import CustomItemList, {
  il_item
} from '../../components/FormComponents/CustomItemList'
import { displayCreatedDate } from '../../utils/utils'
import { styles } from '../../constants/styles'

import { getTenantById } from '../../APICalls/tenantManage'
import { Tenant } from '../../interfaces/account'
import dayjs from 'dayjs'
import { format } from '../../constants/constant'

interface Company {}

interface TenantDetailsProps {
  tenantId: number
  drawerOpen: boolean
  handleDrawerClose: () => void
}

const TenantDetails: FunctionComponent<TenantDetailsProps> = ({
  tenantId,
  drawerOpen = false,
  handleDrawerClose
}) => {
  const { t } = useTranslation()
  const [tenantDetail, setTenantDetails] = useState<Tenant>()
  const [companyLogo, setCompanyLogo] = useState<string | null>(null)
  const [numOfAccount, setNumOfAccount] = useState<number>(1)
  const [inventoryMethod, setInventoryMethod] = useState<string>('')
  const [numOfUplodedPhoto, setNumOfUplodedPhoto] = useState<number>(0)
  const [maxUploadSize, setMaxUploadSize] = useState<string>('1')
  const [defaultLang, setDefaultLang] = useState<string>('ZH-HK')
  const [selectedStatus, setSelectedStatus] = useState<string>('CREATED')
  const [deactiveReason, setDeactiveReason] = useState<string>('-')

  const footerTenant = `[${tenantDetail?.tenantId}] ${t(
    `status.${tenantDetail?.status.toLocaleLowerCase()}`
  )} ${displayCreatedDate(tenantDetail?.updatedAt || '')} `

  useEffect(() => {
    getCompanyDetail()
  }, [])

  const getCompanyDetail = async () => {
    const result = await getTenantById(tenantId)
    const data = result?.data
    setTenantDetails(data)

    ///mapping data
    setNumOfAccount(data.decimalPlace)
    setNumOfUplodedPhoto(data.allowImgNum)
    setMaxUploadSize(data.allowImgSize.toString())
  }

  const mainInfoFields = [
    {
      label: t('tenant.detail.company_category'),
      value: tenantDetail?.tenantType
    },
    {
      label: t('tenant.detail.company_name_traditional_chinese'),
      value: tenantDetail?.companyNameTchi
    },
    {
      label: t('tenant.detail.company_name_simplified_chinese'),
      value: tenantDetail?.companyNameSchi
    },
    {
      label: t('tenant.detail.company_english_name'),
      value: tenantDetail?.companyNameEng
    },
    {
      label: t('tenant.detail.business_registration_number'),
      value: tenantDetail?.brNo
    }
  ]

  const statuses: il_item[] = [
    { id: 'CREATED', name: t('status.created') },
    { id: 'CONFIRMED', name: t('status.confirmed') },
    { id: 'REJECTED', name: t('status.rejected') }
  ]

  const ways_of_exits: il_item[] = [
    { id: '', name: t('tenant.detail.no_preference') },
    { id: 'FIFO', name: t('tenant.detail.fifo') },
    { id: 'LIFO', name: t('tenant.detail.lifo') }
  ]

  const lang_option: il_item[] = [
    { id: 'EN-US', name: 'EN-US' },
    { id: 'ZH-HK', name: 'ZH-HK' },
    { id: 'ZH-CH', name: 'ZH-CH' }
  ]

  const num_option: il_item[] = [
    { id: '0', name: '0' },
    { id: '1', name: '1' },
    { id: '2', name: '2' },
    { id: '3', name: '3' },
    { id: '4', name: '4' },
    { id: '5', name: '5' }
  ]

  return (
    <div className="checkin-request-detail">
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={'none'}
        headerProps={{
          title: t('check_out.request_check_out'),
          subTitle: tenantId.toString(),
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
                  {tenantDetail?.brPhoto.map((item, index) => (
                    <img
                      key={index}
                      src={item}
                      alt="business_reg_number_picture"
                      style={{ width: '70px' }}
                    />
                  ))}
                </div>
              </div>
            </Box>
            <Box>
              <div className="field-contact-person">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t('tenant.detail.contact_person_name')}
                </div>
                <div className=" text-sm text-black font-bold tracking-widest">
                  {tenantDetail?.contactName}
                </div>
              </div>
            </Box>
            <Box>
              <div className="field-phone-number mt-6">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t('tenant.detail.contact_phone_number')}
                </div>
                <div className=" text-sm text-black font-bold tracking-widest">
                  {tenantDetail?.contactNo}
                </div>
              </div>
            </Box>
            <Box>
              <div className="epd_contract mt-6">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-4">
                  {t('tenant.detail.epd_contract')}
                </div>
                <div className="">
                  {tenantDetail?.epdPhoto.map((item, index) => (
                    <img
                      key={index}
                      src={item}
                      alt="logo_company"
                      style={{ width: '70px' }}
                    />
                  ))}
                </div>
              </div>
            </Box>
            <Box>
              <div className="field-creation-date mt-6">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t('tenant.detail.creation_date')}
                </div>
                <div className=" text-sm text-black font-bold tracking-widest">
                  {displayCreatedDate(tenantDetail?.createdAt || '')}
                </div>
              </div>
            </Box>
            <Box>
              <div className="logo mt-6">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-4">
                  {t('tenant.detail.company_logo')}
                </div>
                <div className="">
                  {tenantDetail?.companyLogo ? (
                    <img
                      src={tenantDetail?.companyLogo}
                      alt="logo_company"
                      style={{ width: '70px' }}
                    />
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            </Box>
            <Box>
              <div className="field-remark mt-6">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t('tenant.detail.remark')}
                </div>
                <div className=" text-sm text-black font-bold tracking-widest">
                  {tenantDetail?.remark}
                </div>
              </div>
            </Box>
            <Grid item className="field-default-lang">
              <Typography sx={{ ...styles.header3 }}>
                {t('tenant.detail.number_of_accounts')}
              </Typography>
              <FormControl sx={{ ...localstyles.dropdown, width: '100%' }}>
                <Select
                  labelId="company-label"
                  id="company-label"
                  value={numOfAccount.toString()}
                  sx={{
                    borderRadius: '12px'
                  }}
                  onChange={(event) => {
                    const selectedValue = num_option.find(
                      (item) =>
                        parseInt(item.id) === parseInt(event.target.value)
                    )
                    if (selectedValue) {
                      setNumOfAccount(parseInt(selectedValue.id))
                    }
                  }}
                  defaultValue={tenantDetail?.decimalPlace.toString()}
                >
                  {num_option.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Box>
              <div className="field-ways_of_entry_and_exit">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {t('tenant.detail.ways_of_entry_and_exit')}
                </div>
                <div className="items">
                  <CustomItemList
                    items={ways_of_exits}
                    singleSelect={(value) => setInventoryMethod(value)}
                    value={inventoryMethod}
                    defaultSelected={tenantDetail?.inventoryMethod}
                  />
                </div>
              </div>
            </Box>
            <Grid item className="field-number-of-photo">
              <Typography sx={{ ...styles.header3 }}>
                {t('tenant.detail.number_of_photos_uploaded')}
              </Typography>
              <FormControl sx={{ ...localstyles.dropdown, width: '100%' }}>
                <Select
                  labelId="company-label"
                  id="company-label"
                  value={numOfUplodedPhoto.toString()}
                  sx={{
                    borderRadius: '12px'
                  }}
                  onChange={(event) => {
                    const selectedValue = num_option.find(
                      (item) =>
                        parseInt(item.id) === parseInt(event.target.value)
                    )
                    if (selectedValue) {
                      setNumOfUplodedPhoto(parseInt(selectedValue.id))
                    }
                  }}
                  defaultValue={tenantDetail?.allowImgNum.toString()}
                >
                  {num_option.map((item, index) => (
                    <MenuItem key={index} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Box>
              <Typography sx={{ ...styles.header3, marginBottom: 3 }}>
                {t('tenant.detail.max_photo_upload_capacity')}
              </Typography>
              <CustomField label="">
                <CustomTextField
                  id={'please_enter_capacity_mb'}
                  placeholder={t('tenant.detail.please_enter_capacity_mb')}
                  onChange={(event) => setMaxUploadSize(event.target.value)}
                  value={maxUploadSize}
                  sx={{ width: '100%' }}
                ></CustomTextField>
              </CustomField>
            </Box>
            <Grid item className="field-default-lang">
              <Typography sx={{ ...styles.header3 }}>
                {t('tenant.detail.default_lang')}
              </Typography>
              <FormControl sx={{ ...localstyles.dropdown, width: '100%' }}>
                <Select
                  labelId="company-label"
                  id="company-label"
                  value={defaultLang}
                  sx={{
                    borderRadius: '12px'
                  }}
                  onChange={(event) => setDefaultLang(event.target.value)}
                >
                  {lang_option.map((item, index) => (
                    <MenuItem key={index + item.id} value={item?.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item className="field-status">
              <Typography sx={{ ...styles.header3, marginBottom: 2 }}>
                {t('tenant.detail.account_status')}
              </Typography>
              <div className="items">
                <CustomItemList
                  items={statuses}
                  singleSelect={setSelectedStatus}
                  defaultSelected={tenantDetail?.status}
                  value={selectedStatus}
                />
              </div>
            </Grid>
            <Grid item className="field-reason_for_deactivation">
              <Typography sx={{ ...styles.header3, marginBottom: 2 }}>
                {t('tenant.detail.reason_for_deactivation')}
              </Typography>
              <CustomField label="">
                <CustomTextField
                  id={'reason_for_deactivation'}
                  placeholder={t('tenant.detail.please_enter_the_reason')}
                  multiline={true}
                  rows={4}
                  onChange={(event) => setDeactiveReason(event.target.value)}
                  value={deactiveReason}
                  sx={{ width: '100%' }}
                ></CustomTextField>
              </CustomField>
            </Grid>
            <Box>
              <div className="field-tenant-footer">
                <div className="text-[13px] text-[#ACACAC] font-normal tracking-widest mb-2">
                  {footerTenant}
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

let localstyles = {
  dropdown: {
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
}
export default TenantDetails
