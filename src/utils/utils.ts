import { ImageListType } from 'react-images-uploading'
import {
  formErr,
  localStorgeKeyName,
  format,
  Roles,
  Realm,
  RealmApi,
  STATUS_CODE,
  fieldNameRecycables
} from '../constants/constant'
import dayjs, { Dayjs } from 'dayjs'
import { toast } from 'react-toastify'
import { errorState } from '../interfaces/common'
import i18n from '../setups/i18n'
import { recycType } from '../interfaces/common'

export const returnApiToken = () => {
  const decodeKeycloack =
    localStorage.getItem(localStorgeKeyName.decodeKeycloack) || ''
  const authToken = localStorage.getItem(localStorgeKeyName.keycloakToken) || ''
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ''
  const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
  const realmApiRoute =
    localStorage.getItem(localStorgeKeyName.realmApiRoute) || ''
  return {
    decodeKeycloack: decodeKeycloack,
    authToken: authToken,
    tenantId: tenantId,
    loginId: loginId,
    realmApiRoute
  }
}

export const ImageToBase64 = (images: ImageListType) => {
  var base64: string[] = []
  images.forEach((image) => {
    if (image['data_url']) {
      var imageBase64: string = image['data_url'].toString()
      imageBase64 = imageBase64.split(',')[1]
      base64.push(imageBase64)
    }
  })
  return base64
}

export const returnErrorMsg = (error: string, t: (key: string) => string) => {
  var msg = ''
  switch (error) {
    case formErr.empty:
      msg = t('form.error.shouldNotBeEmpty')
      break
    case formErr.wrongFormat:
      msg = t('form.error.isInWrongFormat')
      break
    case formErr.numberSmallThanZero:
      msg = t('form.error.shouldNotSmallerThanZero')
      break
    case formErr.wrongFormat:
      msg = t('form.error.isInWrongFormat')
      break
    case formErr.minMoreOneImgUploded:
      msg = t('form.error.minMoreOneImgUploded')
      break
    case formErr.alreadyExist:
      msg = t('form.error.alreadyExist')
      break
    case formErr.startDateBehindEndDate:
      msg = t('form.error.startDateBehindEndDate')
      break
    case formErr.endDateEarlyThanStartDate:
      msg = t('form.error.endDateEarlyThanStartDate')
      break
    case formErr.loginIdCantContainAdmin:
      msg = t('form.error.loginIdCantContainAdmin')
      break
    case formErr.hasBeenUsed:
      msg = t('form.error.hasBeenUsed')
      break
    case formErr.startDateIsLaterThanToDate:
      msg = t('form.error.startDateIsLaterThanToDate')
      break
    case formErr.toDateIsEarlierThanStartDate:
      msg = t('form.error.toDateIsEarlierThanStartDate')
      break
    case formErr.tenantIdShouldBeSixDigit:
      msg = t('form.error.tenatIdShouldBeSixDigit')
      break
    case formErr.tenantIdNotFound:
      msg = t('form.error.tenantIdNotFound')
      break
    case formErr.mustDifferent:
      msg = t('form.error.mustDifferent')
      break
    case formErr.loginIdProhibited:
      msg = t('form.error.loginIdProhibited')
      break
    case formErr.incorrectAddress:
      msg = t('form.error.incorrectAddress')
      break
    case formErr.cannotBeSame:
      msg = t('form.error.cannotBeSame')
      break
    case formErr.cantBeSame:
      msg = t('form.error.cantBeSame')
      break
  }
  return msg
}

export const displayCreatedDate = (valueDate: string) => {
  const utcOffset = 8 * 60 * 60 * 1000 // UTC+8 in milliseconds
  const dateWithOffset = new Date(valueDate).getTime() + utcOffset
  const formattedDate = dayjs(dateWithOffset).format(format.dateFormat1)

  return formattedDate
}

export const displayLocalDate = (valueDate: string) => {
  const utcOffset = 8 * 60 * 60 * 1000 // UTC+8 in milliseconds
  const dateWithOffset = new Date(valueDate).getTime() + utcOffset
  const formattedDate = dayjs(dateWithOffset).format(format.dateFormat2)

  return formattedDate
}

export const displayLocalDateWitoutOffset = (valueDate: string) => {
  const dateWithOffset = new Date(valueDate).getTime()
  const formattedDate = dayjs(dateWithOffset).format(format.dateFormat2)

  return formattedDate
}

export const showErrorToast = (msg: string) => {
  toast.error(msg, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light'
  })
}

export const showSuccessToast = (msg: string) => {
  toast.info(msg, {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light'
  })
}

export const getThemeColorRole = (role: string) => {
  const colorList = {
    astd: '#79CA25',
    collector: '#79CA25',
    logistic: '#63D884',
    manufacturer: '#6BC7FF',
    customer: '#199BEC'
  }

  return colorList[role as keyof typeof colorList]
}

export const getThemeCustomList = (role: string) => {
  const customListRole = {
    astd: {
      border: '#79CA25',
      bgColor: '#E4F6DC'
    },
    collector: {
      border: '#79CA25',
      bgColor: '#E4F6DC'
    },
    logistic: {
      border: '#63D884',
      bgColor: '#ECF5EE'
    },
    manufacturer: {
      border: '#6BC7FF',
      bgColor: '#F0F9FF'
    },
    customer: {
      border: '#6BC7FF',
      bgColor: '#F0F9FF'
    }
  }

  return customListRole[role as keyof typeof customListRole]
}

export const dynamicpath = () => {
  const userRole = localStorage.getItem(localStorgeKeyName.role) || ''
  let pathRole: string = ''

  switch (userRole) {
    case Roles.collectorAdmin:
      pathRole = RealmApi.collector
      break
    case Roles.logisticAdmin:
      pathRole = RealmApi.logistic
      break
    case Roles.manufacturerAdmin:
      pathRole = RealmApi.manufacturer
      break
    case Roles.astd:
      pathRole = RealmApi.astd
      break
    case Roles.customerAdmin:
      pathRole = RealmApi.customer
      break
    default:
      break
  }

  return {
    pathRole,
    userRole
  }
}

export const getBaseUrl = () => {
  const realm = localStorage.getItem(localStorgeKeyName.realm)
  let baseURL: string = ''
  switch (realm) {
    case Realm.collector:
      baseURL = window.baseURL.collector
      break
    case Realm.customer:
      baseURL = window.baseURL.customer
      break
    case Realm.logistic:
      baseURL = window.baseURL.logistic
      break
    case Realm.manufacturer:
      baseURL = window.baseURL.manufacturer
      break
    case Realm.astd:
      baseURL = window.baseURL.account
      break
    default:
      baseURL = window.baseURL.administrator
      break
  }
  return baseURL
}

// 格式化重量
export const formatWeight = (weight: string | number, decimalVal: number) => {
  if (decimalVal === 0) {
    return Math.round(parseFloat(weight.toString())).toString() // 返回整數類型的字串
  } else {
    const decimalStr = decimalVal.toString()
    const zeroCount = decimalStr.substring(decimalStr.indexOf('.') + 1).length
    return parseFloat(weight.toString()).toFixed(zeroCount) // 返回浮點數類型的字串
  }
}

//  重量輸入框change事件，並根據decimalVal格式化重量及限制小數位
export const onChangeWeight = (
  value: string,
  decimalVal: number,
  cb: (arg0: string) => void
) => {
  let regexStr
  if (decimalVal === 0) {
    regexStr = '^\\d*$' // 只匹配整數
  } else {
    const newValue = value.split('.')
    if (newValue[0].length < 9) {
      const decimalStr = decimalVal.toString()
      const zeroCount = decimalStr.substring(decimalStr.indexOf('.') + 1).length
      regexStr = '^(?!\\.$)\\d*\\.?\\d{0,' + zeroCount + '}$' // 匹配小數，但首字符不能是小數點
      const regex = new RegExp(regexStr)
      if (regex.test(value) || value === '') {
        cb(value)
      }
    }
  }
}

export const getBackgroundColor = (fieldName: fieldNameRecycables): string => {
  const backgroundColors = {
    'Rechargeable Batteries': '#FF9FB7',
    'Glass Bottles': '#7ADFF1',
    Paper: '#F9B8FF',
    'Fluorescent Lamps and Tubes': '#4FB5F5',
    'Small Electrical Appliances': '#5AE9D8',
    Plastics: '#87FDA7',
    'Non-recyclable': '#EFE72F',
    Cardboard: '#ECAB05',
    Metals: '#C69AFF'
  }

  return backgroundColors[fieldName]
}

export const randomBackgroundColor = (): string => {
  const x = Math.floor(Math.random() * (256 - 150) + 150)
  const y = Math.floor(Math.random() * (256 - 150) + 150)
  const z = Math.floor(Math.random() * (256 - 150) + 150)
  const bgColor = 'rgb(' + x + ',' + y + ',' + z + ')'
  return bgColor
}

export const extractError = (
  error: any
): { state: errorState; realm: string } => {
  const realm = localStorage.getItem(localStorgeKeyName.realm) || ''
  let message: string = ''

  switch (error?.response?.status) {
    case STATUS_CODE[401]:
      message = error?.response?.data
      break
    case STATUS_CODE[404]:
      message = error?.message
      break
    default:
      message = error?.response?.data?.message
      break
  }

  let statusCode = error?.response?.status || STATUS_CODE[404]
  if (!error?.response) {
    statusCode = STATUS_CODE[503]
  }

  const state: errorState = {
    code: statusCode,
    message: message || 'not found'
  }

  return { state, realm }
}

export const getSelectedLanguange = (lang: string) => {
  var selectedLang = 'zhhk'
  switch (lang) {
    case 'zhhk':
      selectedLang = 'ZH-HK'
      break
    case 'zhch':
      selectedLang = 'ZH-CH'
      break
    case 'enus':
      selectedLang = 'EN-US'
      break
    default:
      selectedLang = 'ZH-HK'
      break
  }

  return selectedLang
}

export const mappingRecyName = (
  recycTypeId: string,
  recycSubTypeId: string,
  recycType: recycType[]
) => {
  const matchingRecycType = recycType?.find(
    (recyc) => recycTypeId === recyc.recycTypeId
  )

  if (matchingRecycType) {
    const matchRecycSubType = matchingRecycType.recycSubType?.find(
      (subtype) => subtype.recycSubTypeId === recycSubTypeId
    )
    var name = ''
    switch (i18n.language) {
      case 'enus':
        name = matchingRecycType.recyclableNameEng
        break
      case 'zhch':
        name = matchingRecycType.recyclableNameSchi
        break
      case 'zhhk':
        name = matchingRecycType.recyclableNameTchi
        break
      default:
        name = matchingRecycType.recyclableNameTchi
        break
    }
    var subName = ''
    switch (i18n.language) {
      case 'enus':
        subName = matchRecycSubType?.recyclableNameEng ?? ''
        break
      case 'zhch':
        subName = matchRecycSubType?.recyclableNameSchi ?? ''
        break
      case 'zhhk':
        subName = matchRecycSubType?.recyclableNameTchi ?? ''
        break
      default:
        subName = matchRecycSubType?.recyclableNameTchi ?? '' //default fallback language is zhhk
        break
    }

    return { name, subName }
  }
}

export const validateEmail = (email: string) => {
  return /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(
    email
  )
}

export const getPrimaryColor = (): string => {
  const role = localStorage.getItem(localStorgeKeyName.role)
  //console.log(role, 'role')
  switch (role) {
    case 'manufacturer':
      return '#6BC7FF'
    case 'customer':
      return '#199BEC'
    case 'logistic':
      return '#63D884'
    case 'collector':
      return '#79CA25'
    default:
      return '#79CA25'
  }
}

export const getPrimaryLightColor = (): string => {
  const role = localStorage.getItem(localStorgeKeyName.role)
  switch (role) {
    case 'manufacturer':
      return '#F0F9FF'
    case 'customer':
      return '#F0F9FF'
    case 'logistic':
      return '#E4F6DC'
    case 'collector':
      return '#E4F6DC'
    default:
      return '#E4F6DC'
  }
}

export const validDayjsISODate = (date: Dayjs): boolean => {
  if (!date.isValid()) {
    return false
  }
  // Convert to ISO string and check if it matches the original input
  const isoString = date.toISOString()
  // Regex to ensure ISO 8601 format with 'Z' (UTC time)
  const iso8601Pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
  return iso8601Pattern.test(isoString)
}

export const creatioPageList = () => {
  const realm = localStorage.getItem(localStorgeKeyName.realm) || ''
  const listPage = [
    '/collector/createCollectionPoint',
    '/collector/editCollectionPoint',
    `/${realm}/createPickupOrder`,
    `/${realm}/editPickupOrder`,
    '/astd/createPicoLogistic',
    '/astd/editPicoLogistic',
    '/logistic/createJobOrder/:picoId',
    '/customer/createPurchaseOrder',
    '/customer/editPurchaseOrder'
  ]

  return listPage
}

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
) {
  let timeoutID: ReturnType<typeof setTimeout> | null

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutID) {
      clearTimeout(timeoutID)
    }
    timeoutID = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export const getFormatId = (id: string): string => {
  let initId: string = '000000';

  if (id?.length === 0 || !id) {
    initId = '';
  } else if (id?.length < 6) {
    initId = initId.slice(id?.length, initId?.length) + id
  } else {
    initId = id;
  }
  return initId
};

export const cloneData = (data: any) => {
  return JSON.parse(JSON.stringify(data))
}


export const objectFilter = (data: object, arr: string[]) => {

  try{

    const result = Object.keys(data)
      .filter(key => !arr.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = data[key as keyof object];
        return obj;
      }, {})
      return result 

  }
  catch(err){

  }
}