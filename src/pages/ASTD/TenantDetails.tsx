import { FunctionComponent, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import RightOverlayForm from '../../components/RightOverlayForm'
import {
  Box,
  Stack,
  FormControl,
  Typography,
  MenuItem,
  Grid,
  ButtonBase,
  ImageList,
  ImageListItem,
  Card,
  Modal,
  Divider
} from '@mui/material'
import { CAMERA_OUTLINE_ICON } from '../../themes/icons'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import CustomField from '../../components/FormComponents/CustomField'
import CustomTextField from '../../components/FormComponents/CustomTextField'
import CustomItemList, {
  il_item
} from '../../components/FormComponents/CustomItemList'
import {
  displayCreatedDate,
  showSuccessToast,
  showErrorToast
} from '../../utils/utils'
import { styles } from '../../constants/styles'
import { ImageToBase64 } from '../../utils/utils'
import CommonTypeContainer from '../../contexts/CommonTypeContainer'
import {
  getTenantById,
  updateTenantDetail,
  updateTenantStatus
} from '../../APICalls/tenantManage'
import { Tenant, UpdateTenantForm } from '../../interfaces/account'
import { getReasonTenant } from '../../APICalls/Collector/denialReason'
import { useContainer } from 'unstated-next'
import { localStorgeKeyName } from '../../constants/constant'
import { ToastContainer, toast } from 'react-toastify'

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

type closedTenantModalProps = {
  tenantId: number
  open: boolean
  onClose: () => void
  onSubmit: () => void
  reasons: il_item[]
}

function ClosedTenantModal({
  tenantId,
  open,
  onClose,
  onSubmit,
  reasons = []
}: closedTenantModalProps) {
  const { t } = useTranslation()
  const [reasonId, setReasonId] = useState<string | null>(null)
  const loginId = localStorage.getItem(localStorgeKeyName.username) || ''

  const handleRejectRequest = async () => {
    const statData: any = {
      status: 'CLOSED',
      reasonId: reasonId,
      updatedBy: loginId
    }

    const result = await updateTenantStatus(statData, tenantId)
    const data = result?.data
    onSubmit()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={localstyles.modal}>
        <Stack spacing={2}>
          <Box sx={{ paddingX: 3, paddingTop: 3 }}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h3"
              sx={{ fontWeight: 'bold' }}
            >
              {t('tenant.closed_tenant_title')}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ paddingX: 3, paddingTop: 3 }}>
            <Typography sx={localstyles.typo}>
              {t('check_out.reject_reasons')}
            </Typography>
            <CustomItemList items={reasons} singleSelect={setReasonId} />
          </Box>

          <Box sx={{ alignSelf: 'center', paddingY: 3 }}>
            <button
              className="primary-btn mr-2 cursor-pointer"
              onClick={() => {
                handleRejectRequest()
                onClose()
              }}
            >
              {t('check_in.confirm')}
            </button>
            <button
              className="secondary-btn mr-2 cursor-pointer"
              onClick={() => {
                onClose()
              }}
            >
              {t('check_in.cancel')}
            </button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}
interface TenantDetailsProps {
  tenantId: number
  drawerOpen: boolean
  handleDrawerClose: () => void
  onChangeStatus: () => void
}

const TenantDetails: FunctionComponent<TenantDetailsProps> = ({
  tenantId,
  drawerOpen = false,
  handleDrawerClose,
  onChangeStatus
}) => {
  const { t } = useTranslation()
  const { imgSettings, dateFormat } = useContainer(CommonTypeContainer)
  const [tenantDetail, setTenantDetails] = useState<Tenant>()
  const [companyLogo, setCompanyLogo] = useState<ImageListType>([])
  const [numOfAccount, setNumOfAccount] = useState<number>(1)
  const [inventoryMethod, setInventoryMethod] = useState<string>('')
  const [numOfUplodedPhoto, setNumOfUplodedPhoto] = useState<number>(0)
  const [maxUploadSize, setMaxUploadSize] = useState<string>('1')
  const [defaultLang, setDefaultLang] = useState<string>('ZH-HK')
  const [selectedStatus, setSelectedStatus] = useState<string>('CREATED')
  const [deactiveReason, setDeactiveReason] = useState<string>('-')
  const [modalClosedStatus, setModalClosed] = useState<boolean>(false)
  const loginName = localStorage.getItem(localStorgeKeyName.username) || ''
  const [reasons, setReasons] = useState<il_item[]>([])
  const { i18n } = useTranslation()
  const role = localStorage.getItem(localStorgeKeyName.role) || ''

  const footerTenant = `[${tenantDetail?.tenantId}] ${t(
    `status.${tenantDetail?.status.toLocaleLowerCase()}`
  )} ${dayjs.utc(tenantDetail?.updatedAt).tz('Asia/Hong_Kong').format(`${dateFormat} HH:mm`)} `

  useEffect(() => {
    getCompanyDetail()
    getReasonList()
  }, [])

  const getCompanyDetail = async () => {
    const result = await getTenantById(tenantId)
    const data = result?.data
    setTenantDetails(data)

    ///mapping data
    setNumOfAccount(data?.decimalPlace || 0)
    setNumOfUplodedPhoto(data?.allowImgNum || 0)
    setMaxUploadSize(data?.allowImgSize.toString())
    setDefaultLang(data?.lang || 'ZH-HK')
    setSelectedStatus(data?.status || 'CREATED')
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
    { id: 'REJECTED', name: t('status.rejected') },
    { id: 'CLOSED', name: t('status.closed') }
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

  // useEffect(() => {
  //   if (selectedStatus === 'CLOSED') {
  //     setModalClosed(true)
  //   }
  // }, [selectedStatus])

  const getReasonList = async () => {
    const result = await getReasonTenant(0, 100, tenantId.toString(), 1)
    const data = result?.data
    if (data) {
      var tempReasons: il_item[] = []
      data.content.map((item: any) => {
        tempReasons.push({
          id: item.reasonId,
          name:
            i18n.language === 'zhhk'
              ? item?.reasonNameTchi
              : i18n.language === 'zhhk'
              ? item?.reasonNameSchi
              : item?.reasonNameEng
        })
      })
      setReasons(tempReasons)
    }
  }

  const handleUpdateTenant = async () => {
    const companyLogoImg =
      companyLogo.length > 0 ? ImageToBase64(companyLogo)[0] : ''

    if (selectedStatus === 'CLOSED') {
      setModalClosed(true)
    } else {
      if (tenantDetail) {
        const dataForm: UpdateTenantForm = {
          companyNameTchi: tenantDetail.companyNameTchi,
          companyNameSchi: tenantDetail.companyNameSchi,
          companyNameEng: tenantDetail.companyNameEng,
          tenantType: tenantDetail.tenantType,
          lang: defaultLang,
          status: selectedStatus,
          brNo: tenantDetail.brNo,
          remark: tenantDetail.remark,
          contactNo: tenantDetail.contactNo,
          email: tenantDetail.email,
          contactName: tenantDetail.contactName,
          brPhoto: tenantDetail.brPhoto,
          epdPhoto: tenantDetail.epdPhoto,
          companyLogo: companyLogoImg,
          decimalPlace: numOfAccount,
          monetaryValue: tenantDetail.monetaryValue,
          inventoryMethod: inventoryMethod,
          allowImgSize: parseInt(maxUploadSize),
          allowImgNum: numOfUplodedPhoto,
          effFrmDate: tenantDetail.effFrmDate,
          effToDate: tenantDetail.effToDate,
          approvedAt: tenantDetail?.approvedAt,
          approvedBy: tenantDetail?.approvedBy,
          rejectedAt: tenantDetail?.rejectedAt,
          rejectedBy: tenantDetail?.rejectedBy,
          createdBy: tenantDetail.createdBy,
          createdAt: tenantDetail.createdAt,
          updatedAt: tenantDetail.updatedAt,
          updatedBy: loginName
        }

        const result = await updateTenantDetail(
          dataForm,
          tenantDetail.tenantId.toString()
        )
        if (result) {
          showSuccessToast(t('common.editSuccessfully'))
          getCompanyDetail()
          handleDrawerClose()
          onChangeStatus()
        } else {
          showErrorToast(t('common.editFailed'))
        }
      }
    }
  }

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setCompanyLogo(imageList)
  }

  const removeImage = (index: number) => {
    const newPictures = [...companyLogo]
    newPictures.splice(index, 1)
    setCompanyLogo(newPictures)
  }

  const onSubmitClosedTenant = () => {
    showSuccessToast(t('tenant.closes_success'))
    handleDrawerClose()
    onChangeStatus()
  }

  return (
    <div className="tenant-detail">
      <ToastContainer></ToastContainer>
      <RightOverlayForm
        open={drawerOpen}
        onClose={handleDrawerClose}
        anchor={'right'}
        action={'edit'}
        headerProps={{
          title: t('common.details'),
          subTitle: tenantId.toString(),
          submitText: t('add_warehouse_page.save'),
          cancelText: t('common.cancel'),
          onCloseHeader: handleDrawerClose,
          onSubmit: handleUpdateTenant,
          onDelete: handleDrawerClose
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
                  {dayjs.utc(tenantDetail?.createdAt).tz('Asia/Hong_Kong').format(`${dateFormat} HH:mm`) || ''}
                </div>
              </div>
            </Box>
            <Box>
              <div className="logo mt-6">
                <Typography sx={{ ...styles.header3, marginBottom: 2 }}>
                  {t('tenant.detail.company_logo')}
                </Typography>
                <ImageUploading
                  multiple
                  value={companyLogo}
                  onChange={(imageList, addUpdateIndex) =>
                    onImageChange(imageList, addUpdateIndex)
                  }
                  maxNumber={1}
                  maxFileSize={imgSettings?.ImgSize}
                  dataURLKey="data_url"
                >
                  {({ imageList, onImageUpload, onImageRemove }) => (
                    <Box className="box">
                      <Card
                        sx={{
                          ...localstyles.cardImg
                        }}
                      >
                        <ButtonBase
                          sx={localstyles.btnBase}
                          onClick={(event) => onImageUpload()}
                        >
                          <CAMERA_OUTLINE_ICON style={{ color: '#ACACAC' }} />
                          <Typography
                            sx={[styles.labelField, { fontWeight: 'bold' }]}
                          >
                            {t('report.uploadPictures')}
                          </Typography>
                        </ButtonBase>
                      </Card>
                      <ImageList sx={localstyles.imagesContainer} cols={4}>
                        {imageList.map((image, index) => (
                          <ImageListItem
                            key={image['file']?.name}
                            style={{ position: 'relative', width: '100px' }}
                          >
                            <img
                              style={localstyles.image}
                              src={image['data_url']}
                              alt={image['file']?.name}
                              loading="lazy"
                            />
                            <ButtonBase
                              onClick={(event) => {
                                onImageRemove(index)
                                removeImage(index)
                              }}
                              style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                padding: '4px'
                              }}
                            >
                              <CancelRoundedIcon className="text-white" />
                            </ButtonBase>
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Box>
                  )}
                </ImageUploading>
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
          <ClosedTenantModal
            tenantId={tenantId}
            open={modalClosedStatus}
            onClose={() => setModalClosed(false)}
            onSubmit={onSubmitClosedTenant}
            reasons={reasons}
          />
        </div>
      </RightOverlayForm>
    </div>
  )
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
  },
  imagesContainer: {
    width: '100%',
    height: 'fit-content'
  },
  image: {
    aspectRatio: '1/1',
    width: '100px',
    borderRadius: 2
  },
  cardImg: {
    borderRadius: 2,
    backgroundColor: '#E3E3E3',
    width: '100%',
    height: 150,
    boxShadow: 'none'
  },
  btnBase: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 10
  },
  imgError: {
    border: '1px solid red'
  },
  typo: {
    color: 'grey',
    fontSize: 14,
    display: 'flex'
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '34%',
    height: 'fit-content',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: 5
  }
}

export default TenantDetails
