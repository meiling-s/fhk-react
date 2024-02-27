import { ImageListType } from 'react-images-uploading'
import { formErr, localStorgeKeyName } from '../constants/constant'
import { useTranslation } from 'react-i18next'

export const returnApiToken = () => {
  const decodeKeycloack = localStorage.getItem(localStorgeKeyName.decodeKeycloack)  || ''
  const authToken = localStorage.getItem(localStorgeKeyName.keycloakToken  )|| ''
  const tenantId = localStorage.getItem(localStorgeKeyName.tenantId  )|| ''
  return {decodeKeycloack: decodeKeycloack, authToken: authToken, tenantId: tenantId}
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
    var msg = '';
    console.log(error);
    switch (error) {
      case formErr.empty:
        msg = t('form.error.shouldNotBeEmpty');
        break;
      case formErr.wrongFormat:
        msg = t('form.error.isInWrongFormat');
        break;
      case formErr.numberSmallThanZero:
        msg = t('form.error.shouldNotSmallerThanZero');
        break;
      case formErr.wrongFormat:
        msg = t('form.error.isInWrongFormat');
        break;
      case formErr.minMoreOneImgUploded:
        msg = t('form.error.minMoreOneImgUploded');
        break;
      case formErr.alreadyExist:
        msg = t('form.error.alreadyExist');
        break;
    }
    return msg;
  };
