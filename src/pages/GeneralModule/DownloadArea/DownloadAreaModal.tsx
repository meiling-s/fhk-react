import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Divider, Grid, Link, Typography } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import RightOverlayFormCustom from '../../../components/RightOverlayFormCustom'
import { styles } from '../../../constants/styles'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { useTranslation } from 'react-i18next'
import { format } from '../../../constants/constant'
import { localStorgeKeyName } from '../../../constants/constant'
import LabelField from '../../../components/FormComponents/CustomField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DOCUMENT_ICON } from '../../../themes/icons'
import { getDownloadExcel, getDownloadWord } from '../../../APICalls/report'
import { primaryColor } from '../../../constants/styles'
import {
  getBaseUrl,
  returnApiToken,
  getSelectedLanguange
} from '../../../utils/utils'

import axiosInstance from '../../../constants/axiosInstance'
import { AXIOS_DEFAULT_CONFIGS } from '../../../constants/configs'
import {
  DOWNLOAD_EXCEL_REPORT,
  DOWNLOAD_WORD_REPORT
} from '../../../constants/requestsReport'
import { saveAs } from 'file-saver'
import utc from 'dayjs/plugin/utc'
import i18n from '../../../setups/i18n'
import { formValidate } from '../../../interfaces/common'
import { formErr } from '../../../constants/constant'
import { FormErrorMsg } from '../../../components/FormComponents/FormErrorMsg'
import { returnErrorMsg } from '../../../utils/utils'
import CustomField from '../../../components/FormComponents/CustomField'
import CustomTextField from '../../../components/FormComponents/CustomTextField'
import { getTenantById } from '../../../APICalls/tenantManage'
dayjs.extend(utc)

interface DownloadModalProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  selectedItem?: {
    id: number
    report_name: string
    typeFile: string
    reportId: string
    dateOption?: string
    manualTenantId: boolean
    tenantId?: string
  }
  staffId: string
}

const DownloadAreaModal: FunctionComponent<DownloadModalProps> = ({
  drawerOpen,
  handleDrawerClose,
  selectedItem,
  staffId
}) => {
  const { t } = useTranslation()
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs())
  const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs())
  const { tenantId, decodeKeycloack } = returnApiToken()
  const [downloads, setDownloads] = useState<{ date: string; url: any }[]>([])
  const realmApiRoute =
    localStorage.getItem(localStorgeKeyName.realmApiRoute) || ''
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])
  const [tenant, setTenant] = useState<string>('')

  useEffect(() => {
    if (validation.length === 0 && selectedItem?.dateOption != 'daterange') {
      getReport()
    } else {
      setTrySubmited(true)
    }
  }, [startDate, endDate, i18n.language, validation])

  useEffect(() => {
    getReport()
  }, [selectedItem?.id, i18n.language])

  const isValidDayjsISODate = (date: Dayjs): boolean => {
    if (!date.isValid()) {
      return false
    }
    // Convert to ISO string and check if it matches the original input
    const isoString = date.toISOString()
    // Regex to ensure ISO 8601 format with 'Z' (UTC time)
    const iso8601Pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    return iso8601Pattern.test(isoString)
  }

  useEffect(() => {
    const validate = async () => {
      
      const tempV: formValidate[] = []
      startDate > endDate &&
        selectedItem?.dateOption != 'datetime' &&
        tempV.push({
          field: t('general_settings.start_date'),
          problem: formErr.startDateBehindEndDate,
          type: 'error'
        })
      if (selectedItem?.dateOption != 'datetime') {
        console.log('startDate', selectedItem?.dateOption)
        endDate < startDate &&
          tempV.push({
            field: t('generate_report.end_date'),
            problem: formErr.endDateEarlyThanStartDate,
            type: 'error'
          })
      }

      startDate == null &&
        tempV.push({
          field: t('general_settings.start_date'),
          problem: formErr.empty,
          type: 'error'
        })
      endDate == null  &&
        tempV.push({
          field: t('generate_report.end_date'),
          problem: formErr.empty,
          type: 'error'
        })

      startDate &&
        !isValidDayjsISODate(startDate) &&
        tempV.push({
          field: t('general_settings.start_date'),
          problem: formErr.wrongFormat,
          type: 'error'
        })
      endDate &&
        selectedItem?.dateOption != 'datetime' &&
        !isValidDayjsISODate(endDate) &&
        tempV.push({
          field: t('generate_report.end_date'),
          problem: formErr.wrongFormat,
          type: 'error'
        })

      setValidation(tempV)
    }

    validate()
  }, [startDate, endDate, i18n.language])

  const formatUtcStartDate = (value: dayjs.Dayjs) => {
    return dayjs(value).utc().format('YYYY-MM-DD[T]00:00:00.000[Z]')
  }
  const formatUtcEndDate = (value: dayjs.Dayjs) => {
    return dayjs(value).utc().format('YYYY-MM-DD[T]23:59:59.999[Z]')
  }

  const generateDateRangeLink = (reportId: string) => {
    return (
      getBaseUrl() +
      `api/v1/${realmApiRoute}/${reportId}/${tenantId}?frmDate=${formatUtcStartDate(
        startDate
      )}&toDate=${formatUtcEndDate(
        endDate
      )}&staffId=${staffId}&language=${getSelectedLanguange(i18n.language)}`
    )
  }

  const generateNoDateLink = (reportId: string) => {
    return (
      getBaseUrl() +
      `api/v1/${realmApiRoute}/${reportId}/${tenantId}?staffId=${staffId}&language=${getSelectedLanguange(
        i18n.language
      )}`
    )
  }

  const generateDatetimeLink = (reportId: string) => {
    return (
      getBaseUrl() +
      `api/v1/${realmApiRoute}/${reportId}/${tenantId}?frmDate=${formatUtcStartDate(
        startDate
      )}&staffId=${staffId}&language=${getSelectedLanguange(i18n.language)}`
    )
  }

  const generateNoDateLinkManualTenantId = (
    reportId: string,
    tenant: string
  ) => {
    return (
      getBaseUrl() +
      `api/v1/${realmApiRoute}/${reportId}/${tenant}?staffId=${staffId}&language=${getSelectedLanguange(
        i18n.language
      )}`
    )
  }

  const generateNoDateNoTenandIdLink = (reportId: string) => {
    return (
      getBaseUrl() +
      `api/v1/${realmApiRoute}/${reportId}?staffId=${staffId}&language=${getSelectedLanguange(
        i18n.language
      )}`
    )
  }

  const onChangeTenantId = (value: string) => {
    const isNumber = Number(value)
    if (
      typeof isNumber === 'number' &&
      isNumber.toString() !== 'NaN' &&
      value.length <= 6
    ) {
      setTenant(value)
    }
  }

  const getTenantDetail = async () => {
    try {
      const tenantDetail = await getTenantById(Number(tenant))
      if (tenantDetail && selectedItem?.reportId) {
        const url = generateNoDateLinkManualTenantId(
          selectedItem?.reportId,
          tenant
        )
        setDownloads([
          { date: dayjs(startDate).format('YYYY/MM/DD'), url: url }
        ])
        setValidation([])
      }
    } catch (error) {
      setValidation([
        {
          field: t('report.invalidTenantId'),
          problem: formErr.tenantIdNotFound,
          type: 'error'
        }
      ])
    }
  }

  useEffect(() => {
    if (tenant.length === 6) {
      getTenantDetail()
    } else if (
      selectedItem?.manualTenantId &&
      tenant.length >= 1 &&
      tenant.length < 6
    ) {
      setValidation([
        {
          field: t('report.invalidTenantId'),
          problem: formErr.tenantIdShouldBeSixDigit,
          type: 'error'
        }
      ])
    } else if (selectedItem?.manualTenantId && tenant.length === 6) {
      setValidation([])
    }
  }, [tenant])

  const getReport = async () => {
    if (selectedItem?.manualTenantId) return
    let url = ''
    if (selectedItem) {
      switch (selectedItem?.id) {
        case 6:
          url =
            window.baseURL.collector +
            `api/v1/collectors/downloadWord/${decodeKeycloack}?from=${dayjs(
              startDate
            ).format('YYYY-MM-DD 00:00:00')}&to=${dayjs(endDate).format(
              'YYYY-MM-DD 23:59:59'
            )}`
          break
        case 7:
          url =
            window.baseURL.collector +
            `api/v1/collectors/downloadExcel/${tenantId}?frmDate=${dayjs(
              startDate
            ).format('YYYY-MM-DD 00:00:00')}&toDate=${dayjs(endDate).format(
              'YYYY-MM-DD 23:59:59'
            )}`
          break
        default:
          url =
            selectedItem.dateOption === 'none' &&
            selectedItem.tenantId === 'none'
              ? generateNoDateNoTenandIdLink(selectedItem.reportId)
              : selectedItem?.dateOption === 'none'
              ? generateNoDateLink(selectedItem.reportId)
              : selectedItem?.dateOption === 'datetime'
              ? generateDatetimeLink(selectedItem.reportId)
              : generateDateRangeLink(selectedItem.reportId)
          break
      }

      setDownloads((prev) => {
        return [{ date: dayjs(startDate).format('YYYY/MM/DD'), url: url }]
      })
    }
  }

  const resetData = () => {
    setValidation([])
    setTrySubmited(false)
    setStartDate(dayjs())
    setEndDate(dayjs())
  }

  const onCloseDrawer = () => {
    resetData()
    handleDrawerClose()
  }

  return (
    <div className="add-vehicle">
      <RightOverlayFormCustom
        open={drawerOpen}
        onClose={onCloseDrawer}
        anchor={'right'}
        headerProps={{
          title: t('report.report'),
          subTitle: selectedItem?.report_name,
          onCloseHeader: onCloseDrawer,
          isButtonCancel: false,
          isButtonFinish: false
        }}
      >
        <Divider></Divider>
        <Box sx={{ marginX: 2 }}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="zh-cn"
          >
            {selectedItem?.dateOption == 'datetime' ? (
              <Box
                sx={{
                  ...localstyles.DateItem,
                  flexDirection: 'column',
                  marginY: 2
                }}
              >
                <LabelField label={t('general_settings.start_date')} />
                <DatePicker
                  defaultValue={dayjs(startDate)}
                  format={format.dateFormat2}
                  onChange={(value) => setStartDate(value!!)}
                  sx={{ ...localstyles.datePicker, width: '100%' }}
                  maxDate={selectedItem?.dateOption != 'datetime' ? dayjs(endDate) : null}
                />
              </Box>
            ) : selectedItem?.manualTenantId &&
              selectedItem.dateOption === 'none' ? (
              <CustomField label={t('report.tenantId')} mandatory>
                <CustomTextField
                  id="tenantId"
                  placeholder={t('report.tenantIdPlaceHolder')}
                  sx={{ ...localstyles.textFieldTenantId }}
                  onChange={(event) => {
                    if (event.target.value) {
                      onChangeTenantId(event.target.value)
                    } else {
                      setTenant('')
                    }
                  }}
                  value={tenant}
                ></CustomTextField>
              </CustomField>
            ) : selectedItem?.dateOption == 'none' ? (
              <></>
            ) : (
              <Box
                className="filter-date"
                sx={{
                  marginY: 2,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly'
                }}
              >
                <Box sx={{ ...localstyles.DateItem, flexDirection: 'column' }}>
                  <LabelField label={t('general_settings.start_date')} />
                  <DatePicker
                    defaultValue={dayjs(startDate)}
                    format={format.dateFormat2}
                    onChange={(value) => setStartDate(value!!)}
                    sx={{ ...localstyles.datePicker }}
                    maxDate={dayjs(endDate)}
                  />
                </Box>
                <Box sx={{ ...localstyles.DateItem, flexDirection: 'column' }}>
                  <LabelField label={t('generate_report.end_date')} />
                  <DatePicker
                    defaultValue={dayjs(endDate)}
                    format={format.dateFormat2}
                    onChange={(value) => setEndDate(value!!)}
                    sx={{ ...localstyles.datePicker }}
                    minDate={dayjs(startDate)}
                  />
                </Box>
              </Box>
            )}
          </LocalizationProvider>
          <Grid
            sx={{ borderBottom: 1, borderBottomColor: '#E2E2E2' }}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'right',
              marginLeft: '10px',
              marginRight: '10px',
              height: '48px',
              padding: '8px, 12px, 8px, 12px',
              alignItems: 'center'
            }}
          >
            {validation.length === 0 &&
              selectedItem?.manualTenantId &&
              tenant.length === 6 &&
              downloads.map((item) => (
                <DownloadItem
                  key={item.url}
                  date={item.date}
                  url={item.url}
                  typeFile={selectedItem?.typeFile}
                  validation={validation}
                />
              ))}

            {validation.length === 0 &&
              !selectedItem?.manualTenantId &&
              downloads.map((item) => (
                <DownloadItem
                  key={item.url}
                  date={item.date}
                  url={item.url}
                  typeFile={selectedItem?.typeFile}
                  validation={validation}
                />
              ))}
          </Grid>
          <Grid item>
            {trySubmited &&
              validation.map((val, index) => (
                <FormErrorMsg
                  key={index}
                  field={t(val.field)}
                  errorMsg={returnErrorMsg(val.problem, t)}
                  type={val.type}
                />
              ))}
          </Grid>
        </Box>
      </RightOverlayFormCustom>
    </div>
  )
}

const DownloadItem: FunctionComponent<{
  date: string
  url: string
  typeFile: string | undefined
  validation: formValidate[]
}> = ({ date, url, typeFile, validation = [] }) => {
  const downloadfile = (blob: any, type: string | undefined) => {
    let extention = ''
    switch (type) {
      case 'XLS':
        extention = 'xls'
        break
      case 'WORD':
        extention = 'doc'
        break
      default:
        break
    }
    saveAs(blob, `document.${extention}`)
  }

  return (
    <Grid
      sx={{ borderBottom: 1, borderBottomColor: '#E2E2E2' }}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'right',
        marginLeft: '10px',
        marginRight: '10px',
        height: '48px',
        padding: '8px, 12px, 8px, 12px',
        alignItems: 'center'
      }}
    >
      {/* <Typography style={{fontSize: '16px', fontWeight: '400', color: '#535353'}}>{date}</Typography> */}
      <Link
        style={{
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: '32px',
          width: '90px',
          background: '#E4F6DC',
          borderRadius: '24px',
          padding: '6px, 12px, 6px, 12px',
          rowGap: '4px',
          borderWidth: '1px',
          borderBottomColor: '#E2E2E2',
          cursor: 'pointer'
        }}
        underline="none"
        target="_blank"
        href={validation.length === 0 ? url : ''}
        // onClick={() => downloadfile(url, typeFile)}
      >
        <DOCUMENT_ICON style={{ color: '#79CA25' }} />
        <Typography
          style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#79CA25',
            textAlign: 'center'
          }}
        >
          {typeFile}
        </Typography>
      </Link>
    </Grid>
  )
}

const localstyles = {
  textField: {
    borderRadius: '10px',
    fontWeight: '500',
    '& .MuiOutlinedInput-input': {
      padding: '10px'
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
  datePicker: {
    ...styles.textField,
    width: '250px',
    '& .MuiIconButton-edgeEnd': {
      color: primaryColor
    }
  },
  DateItem: {
    display: 'flex',
    height: 'fit-content'
  },
  textFieldTenantId: {
    borderRadius: '12px',
    width: {
      xs: '1000px',
      md: '100%'
    },
    backgroundColor: 'white',
    '& fieldset': {
      borderRadius: '12px',
      width: '93%'
    }
  }
}

export default DownloadAreaModal
