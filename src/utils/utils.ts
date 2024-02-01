import { ImageListType } from 'react-images-uploading'
import { formErr } from '../constants/constant'
import { useTranslation } from 'react-i18next'

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
    }
    return msg;
  };
