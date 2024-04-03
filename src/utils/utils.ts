import { ImageListType } from 'react-images-uploading'
import { formErr, localStorgeKeyName, format, Roles, Realm } from '../constants/constant'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

export const returnApiToken = () => {
  const decodeKeycloack =
    localStorage.getItem(localStorgeKeyName.decodeKeycloack) || ''
  const authToken = localStorage.getItem(localStorgeKeyName.keycloakToken) || ''
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId) || ''
  const loginId = localStorage.getItem(localStorgeKeyName.username) || ''
  const realmApiRoute = localStorage.getItem(localStorgeKeyName.realmApiRoute) || ''
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
  images.map((image) => {
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
  console.log(error)
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
    collectoradmin: '#79CA25',
    logisticadmin: '#7CE495',
    manufactureradmin: '#6BC7FF'
  }

  return colorList[role as keyof typeof colorList]
}

export const getThemeCustomList = (role: string) => {
  const customListRole = {
    collectoradmin: {
      border: '#79CA25',
      bgColor: '#E4F6DC'
    },
    logisticadmin: {
      border: '#63D884',
      bgColor: '#ECF5EE'
    },
    manufactureradmin: {
      border: '#6BC7FF',
      bgColor: '#F0F9FF'
    }
  }

  return  customListRole[role as keyof typeof customListRole]
}

export const dynamicpath = () => {
  const userRole = localStorage.getItem("userRole") || "";
  let pathRole: string = "";

  switch(userRole){
    case(Roles.collectoradmin):
      pathRole = Realm.collector;
      break;
    case(Roles.logisticadmin):
      pathRole = Realm.logistic;
      break
    default:
      break;
  }
  
  return {
    pathRole
  }
}