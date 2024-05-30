import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Divider, Grid, Link, Typography } from '@mui/material'
import dayjs from 'dayjs'
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

dayjs.extend(utc)

interface DownloadModalProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  selectedItem?: {
    id: number
    report_name: string
    typeFile: string
    reportId: string
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
  const defaultLang =
    localStorage.getItem(localStorgeKeyName.selectedLanguage) || 'zhhk'

  useEffect(() => {
    const isAfter = dayjs(endDate).isAfter(startDate)
    const isSame = dayjs(endDate).isSame(startDate)

    if (isAfter || isSame) {
      getReport()
    }
  }, [startDate, endDate, i18n.language])

  useEffect(() => {
    //defaultReport()
    getReport()
  }, [selectedItem?.id, i18n.language])

  const formatToUtc = (value: dayjs.Dayjs) => {
    return dayjs(value).utc().format('YYYY-MM-DDTHH:mm:ss[Z]')
  }

  const generateCollectorLink = (reportId: string) => {
    return (
      getBaseUrl() +
      `api/v1/${realmApiRoute}/${reportId}/${tenantId}?frmDate=${formatToUtc(
        startDate
      )}&toDate=${formatToUtc(
        endDate
      )}&staffId=${staffId}&language=${getSelectedLanguange(i18n.language)}`
    )
  }

  const getReport = async () => {
    let url = ''
    if (selectedItem) {
      switch (selectedItem?.id) {
        // case 1:
        //   url = generateCollectorLink(selectedItem.reportId)
        //   break
        // case 2:
        //   url = generateCollectorLink(selectedItem.reportId)
        //   break
        // case 3:
        //   break
        // case 4:
        //   break
        // case 5:
        //   break
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
          url = generateCollectorLink(selectedItem.reportId)
          break
      }

      console.log("urllll", url)

      setDownloads((prev) => {
        return [{ date: dayjs(startDate).format('YYYY/MM/DD'), url: url }]
      })
    }
  }

  const onCloseDrawer = () => {
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
                <LabelField label={t('generate_report.start_date')} />
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
            {downloads.map((item) => (
              <DownloadItem
                key={item.url}
                date={item.date}
                url={item.url}
                typeFile={selectedItem?.typeFile}
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
}> = ({ date, url, typeFile }) => {
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
        href={url}
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
      color: '#79CA25'
    }
  },
  DateItem: {
    display: 'flex',
    height: 'fit-content'
  }
}

export default DownloadAreaModal
