import { useEffect, useState } from 'react'
import {
  CreatePO,
  CreatePicoDetail,
  EditPo
} from '../../../interfaces/pickupOrder'
import dayjs, { Dayjs } from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Languages } from '../../../constants/constant'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import { picoErrorMessages, fieldName, ErrorsField, initialErrors } from '../../../constants/picoErrorMessages'

const useValidationPickupOrder = (
  pico: CreatePO | EditPo,
  state: CreatePicoDetail[]
) => {
  const { i18n } = useTranslation()
  const [errorsField, setErrorsField] = useState<ErrorsField>(initialErrors)
  const [skipContractNo, setSkipContractNo] = useState<boolean>(false)
  const { dateFormat } = useContainer(CommonTypeContainer)

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

  const getTranslationMessage = (field: string): string => {
    let message: string = ''
    const errorMessage = picoErrorMessages[field]
    if (errorMessage && i18n.language === Languages.ENUS) {
      message = errorMessage?.messageEn ?? ''
    } else if (errorMessage && i18n.language === Languages.ZHCH) {
      message = errorMessage?.messageSc ?? ''
    } else if (errorMessage && i18n.language === Languages.ZHHK) {
      message = errorMessage?.messageTc ?? ''
    }
    return message

  }

  useEffect(() => {
    let cache: any = initialErrors
    for (let [key, value] of Object.entries(errorsField)) {
      if (value.status) {
        let message: string = ''
        if (i18n.language === Languages.ENUS) {
          message = value.messages.messageEn
        } else if (i18n.language === Languages.ZHCH) {
          message = value.messages.messageSc
        } else {
          message = value.messages?.messageTc
        }
        value.message = message
        cache[key] = value
      }
    }
    setErrorsField(cache)
  }, [i18n.language])

  const validateData = (value?: string): boolean => {
    let isValid = true

    if (value) {
      setSkipContractNo(true)
    }

    if (pico.effToDate && pico.effFrmDate) {
      const fromDate = dayjs(pico.effFrmDate).startOf('day')
      const toDate = dayjs(pico.effToDate).startOf('day')

      if (!isValidDayjsISODate(dayjs(pico.effFrmDate))) {
        isValid = false
        setErrorsField((prev) => {
          return {
            ...prev,
            effFrmDate: {
              ...prev.effFrmDate,
              status: true,
              messages: picoErrorMessages['shippingFromDateNotValid'],
              message: getTranslationMessage('shippingFromDateNotValid')
            }
          }
        })
      } else if (fromDate > toDate) {
        isValid = false
        setErrorsField((prev) => {
          return {
            ...prev,
            effFrmDate: {
              ...prev.effFrmDate,
              status: true,
              messages: picoErrorMessages['invalidDate'],
              message: getTranslationMessage('invalidDate')
            }
          }
        })
      } else {
        setErrorsField((prev) => {
          return {
            ...prev,
            effFrmDate: {
              ...prev.effFrmDate,
              status: false
            }
          }
        })
      }
      
      if (!isValidDayjsISODate(dayjs(pico.effToDate))) {
        isValid = false
        setErrorsField((prev) => {
          return {
            ...prev,
            effToDate: {
              ...prev.effToDate,
              status: true,
              messages: picoErrorMessages['shippingtoDateNotValid'],
              message: getTranslationMessage('shippingtoDateNotValid')
            }
          }
        })
      } else if (fromDate > toDate) {
        isValid = false
        setErrorsField((prev) => {
          return {
            ...prev,
            effFrmDate: {
              ...prev.effFrmDate,
              status: true,
              messages: picoErrorMessages['invalidDate'],
              message: getTranslationMessage('invalidDate')
            }
          }
        })
      } else {
        setErrorsField((prev) => {
          return {
            ...prev,
            effToDate: {
              ...prev.effToDate,
              status: false
            }
          }
        })
      }
    }

    if (pico.routineType === '') {
      isValid = false
      setErrorsField((prev) => {
        return {
          ...prev,
          routine: {
            ...prev.routine,
            status: true,
            messages: picoErrorMessages['routine'],
            message: getTranslationMessage('routine')
          }
        }
      })
    }
    
    if (
      pico.picoType === 'ROUTINE' &&
      pico.routineType === 'specificDate' &&
      pico.routine.length === 0
    ) {
      isValid = false
      setErrorsField((prev) => {
        return {
          ...prev,
          routine: {
            ...prev.routine,
            status: true,
            messages: picoErrorMessages['specificDate'],
            message: getTranslationMessage('specificDate')
          }
        }
      })
    } else if (
      pico.picoType === 'ROUTINE' &&
      pico.routineType === 'specificDate' &&
      pico.routine.length >= 1
    ) {
        const fromDate = dayjs(pico.effFrmDate, dateFormat).startOf('day');
        const toDate = dayjs(pico.effToDate, dateFormat).startOf('day');
       
        const outOfRangeDates: string[] = [];

        pico.routine.map((item: any) => {
          // Parse the item with the expected format
          const date = dayjs(item, dateFormat).startOf('day');

          // Check if date is within the valid range
          if (date < fromDate || date > toDate) {
            outOfRangeDates.push(item);
            return false;
          }
        });


      const originalLength = pico?.routine?.length
      const isDuplicatedDate = new Set([...pico?.routine]).size

      if (originalLength !== isDuplicatedDate) {
        isValid = false
        setErrorsField((prev) => {
          return {
            ...prev,
            routine: {
              ...prev.routine,
              status: true,
              messages: picoErrorMessages['duplicateDateTimePeriod'],
              message: getTranslationMessage('duplicateDateTimePeriod')
            }
          }
        })
        
      } else if (outOfRangeDates.length > 0) {
        isValid = false
        setErrorsField((prev) => {
          return {
            ...prev,
            routine: {
              ...prev.routine,
              status: true,
              messages: picoErrorMessages['out_of_date_range'],
              message: getTranslationMessage('out_of_date_range')
            }
          }
        })
     
      } else {
        setErrorsField((prev) => {
          return {
            ...prev,
            routine: {
              ...prev.routine,
              status: false
            }
          }
        })
      }
    } else if (
      pico.picoType === 'ROUTINE' &&
      pico.routineType !== 'specificDate'
    ) {
      setErrorsField((prev) => {
        return {
          ...prev,
          routine: {
            ...prev.routine,
            status: false
          }
        }
      })
    }

    if (
      pico.routineType === 'weekly' &&
      pico.routine.length === 0
    ) {
      isValid = false
      setErrorsField((prev) => {
        return {
          ...prev,
          routine: {
            ...prev.routine,
            status: true,
            messages: picoErrorMessages['weeklyDate'],
            message: getTranslationMessage('weeklyDate')
          }
        }
      })
    } else if (pico.routineType === 'weekly' && pico.routine.length >= 0) {
      setErrorsField((prev) => {
        return {
          ...prev,
          routine: {
            ...prev.routine,
            status: false
          }
        }
      })
    }

    if (pico.logisticName === '') {
      isValid = false
      setErrorsField((prev) => {
        return {
          ...prev,
          logisticName: {
            ...prev.logisticName,
            status: true,
            messages: picoErrorMessages['logistic'],
            message: getTranslationMessage('logistic')
          }
        }
      })
    } else {
      setErrorsField((prev) => {
        return {
          ...prev,
          logisticName: {
            ...prev.logisticName,
            status: false
          }
        }
      })
    }
   

    if (state.length === 0) {
      isValid = false
      setErrorsField((prev) => {
        return {
          ...prev,
          createPicoDetail: {
            ...prev.createPicoDetail,
            status: true,
            messages: picoErrorMessages['pickupDetail'],
            message: getTranslationMessage('pickupDetail')
          }
        }
      })
    } else {
      setErrorsField((prev) => {
        return {
          ...prev,
          createPicoDetail: {
            ...prev.createPicoDetail,
            status: false
          }
        }
      })
    }

    const isDetailOrderEmpty = state.filter((item) => item.status !== 'DELETED')
    if (isDetailOrderEmpty.length === 0) {
      isValid = false
      setErrorsField((prev) => {
        return {
          ...prev,
          createPicoDetail: {
            ...prev.createPicoDetail,
            status: true,
            messages: picoErrorMessages['pickupDetail'],
            message: getTranslationMessage('pickupDetail')
          }
        }
      })
    } else {
      setErrorsField((prev) => {
        return {
          ...prev,
          createPicoDetail: {
            ...prev.createPicoDetail,
            status: false
          }
        }
      })
    }

    if (pico.picoType === 'AD_HOC' && pico.reason === '') {
      isValid = false
      setErrorsField((prev) => {
        return {
          ...prev,
          AD_HOC: {
            ...prev.AD_HOC,
            status: true,
            messages: picoErrorMessages['addHocReason'],
            message: getTranslationMessage('addHocReason')
          }
        }
      })
    } else if (pico.picoType === 'AD_HOC' && pico.reason) {
      setErrorsField((prev) => {
        return {
          ...prev,
          AD_HOC: {
            ...prev.AD_HOC,
            status: false
          }
        }
      })
    }

    if (pico.contactNo !== '' && isNaN(Number(pico.contactNo))) {
      isValid = false
      setErrorsField((prev) => {
        return {
          ...prev,
          contactNo: {
            ...prev.contactNo,
            status: true,
            messages: picoErrorMessages['contactNo'],
            message: getTranslationMessage('contactNo')
          }
        }
      })
    } else {
      setErrorsField((prev) => {
        return {
          ...prev,
          contactNo: {
            ...prev.contactNo,
            status: false
          }
        }
      })
    }

    if (pico.contractNo === '' || pico.contractNo === null) {
      if (skipContractNo) {
        setErrorsField((prev) => {
          return {
            ...prev,
            contractNo: {
              ...prev.contractNo,
              status: false
            }
          }
        })
      } else {
        if (value !== undefined) {
          setErrorsField((prev) => {
            return {
              ...prev,
              contractNo: {
                ...prev.contractNo,
                status: false
              }
            }
          })
        } else {
          isValid = false
          setErrorsField((prev) => {
            return {
              ...prev,
              contractNo: {
                ...prev.contractNo,
                status: true,
                messages: picoErrorMessages['contractNo'],
                message: getTranslationMessage('contractNo')
              }
            }
          })
        }
      }
    }

    return isValid
  }

  const validateDataChange = () => {
    const fromDate = dayjs(pico.effFrmDate)

    const toDate = dayjs(pico.effToDate)
    if (!isValidDayjsISODate(fromDate)) {
      setErrorsField((prev) => {
        return {
          ...prev,
          effFrmDate: {
            ...prev.effFrmDate,
            status: true,
            messages: picoErrorMessages['shippingFromDateNotValid'],
            message: getTranslationMessage('shippingFromDateNotValid')
          }
        }
      })
      // }
    } else if (
      pico.effToDate &&
      pico.effFrmDate &&
      errorsField.effToDate.touch &&
      errorsField.effFrmDate.touch
    ) {
      const fromDate = pico.effFrmDate && dayjs(pico.effFrmDate).startOf('day')
      const toDate = pico.effFrmDate && dayjs(pico.effToDate).startOf('day')
      if (fromDate > toDate) {
        setErrorsField((prev) => {
          return {
            ...prev,
            effFrmDate: {
              ...prev.effFrmDate,
              status: true,
              messages: picoErrorMessages['invalidDate'],
              message: getTranslationMessage('invalidDate')
            }
          }
        })
      } else {
        setErrorsField((prev) => {
          return {
            ...prev,
            effFrmDate: {
              ...prev.effFrmDate,
              status: false,
              message: ''
            }
          }
        })
      }
    }
    if (!isValidDayjsISODate(toDate)) {
      setErrorsField((prev) => {
        return {
          ...prev,
          effToDate: {
            ...prev.effToDate,
            status: true,
            messages: picoErrorMessages['shippingtoDateNotValid'],
            message: getTranslationMessage('shippingtoDateNotValid')
          }
        }
      })
      // }
    } else if (
      pico.effToDate &&
      pico.effFrmDate &&
      errorsField.effToDate.touch &&
      errorsField.effFrmDate.touch
    ) {
      const fromDate = pico.effFrmDate && dayjs(pico.effFrmDate).startOf('day')
      const toDate = pico.effFrmDate && dayjs(pico.effToDate).startOf('day')
      if (fromDate > toDate) {
        setErrorsField((prev) => {
          return {
            ...prev,
            effFrmDate: {
              ...prev.effFrmDate,
              status: true,
              messages: picoErrorMessages['invalidDate'],
              message: getTranslationMessage('invalidDate')
            }
          }
        })
      } else {
        setErrorsField((prev) => {
          return {
            ...prev,
            effToDate: {
              ...prev.effToDate,
              status: false,
              message: ''
            }
          }
        })
      }
    }

    if (pico.routineType === '' && errorsField.routine.touch) {
      setErrorsField((prev) => {
        return {
          ...prev,
          routine: {
            ...prev.routine,
            status: true,
            messages: picoErrorMessages['routine'],
            message: getTranslationMessage('routine')
          }
        }
      })
    }

    if (pico.picoType !== 'AD_HOC') {
      if (
        pico.routineType === 'specificDate' &&
        pico.routine.length === 0 &&
        errorsField.routine.touch
      ) {
        setErrorsField((prev) => {
          return {
            ...prev,
            routine: {
              ...prev.routine,
              status: true,
              messages: picoErrorMessages['specificDate'],
              message: getTranslationMessage('specificDate')
            }
          }
        })
      } else if (
        pico.routineType === 'specificDate' &&
        pico.routine.length >= 1 &&
        errorsField.routine.touch
      ) {
        const fromDate = dayjs(pico.effFrmDate, dateFormat).startOf('day');
        const toDate = dayjs(pico.effToDate, dateFormat).startOf('day');
        const invalidFormatDates: string[] = [];
        const outOfRangeDates: string[] = [];

        pico.routine.map((item: any) => {
          // Parse the item with the expected format
          const date = dayjs(item, dateFormat).startOf('day');

          // Check if date is within the valid range
          if (date < fromDate || date > toDate) {
            outOfRangeDates.push(item);
            return false;
          }
        });

        const originalLength = pico?.routine?.length
        const isDuplicatedDate = new Set([...pico?.routine]).size

        if (originalLength !== isDuplicatedDate) {
          setErrorsField((prev) => {
            return {
              ...prev,
              routine: {
                ...prev.routine,
                status: true,
                messages: picoErrorMessages['duplicateDateTimePeriod'],
                message: getTranslationMessage('duplicateDateTimePeriod')
              }
            }
          })
        
        } else if (outOfRangeDates.length > 0) {
          setErrorsField((prev) => {
            return {
              ...prev,
              routine: {
                ...prev.routine,
                status: true,
                messages: picoErrorMessages['out_of_date_range'],
                message: getTranslationMessage('out_of_date_range')
              }
            }
          })
      
          setErrorsField((prev) => {
            return {
              ...prev,
              routine: {
                ...prev.routine,
                status: false,
                message: '',
                messages: {}
              }
            }
          })
        }
      } else if (pico.routineType !== 'specificDate') {
        setErrorsField((prev) => {
          return {
            ...prev,
            routine: {
              ...prev.routine,
              status: false,
            }
          }
        })
      }

      if (
        pico.picoType === 'picoType' &&
        pico.routineType === 'weekly' &&
        pico.routine.length === 0
      ) {
        setErrorsField((prev) => {
          return {
            ...prev,
            routine: {
              ...prev.routine,
              status: true,
              messages: picoErrorMessages['weeklyDate'],
              message: getTranslationMessage('weeklyDate')
            }
          }
        })
      } else if (pico.routineType === 'weekly' && pico.routine.length >= 0) {
        setErrorsField((prev) => {
          return {
            ...prev,
            routine: {
              ...prev.routine,
              status: false
            }
          }
        })
      }
    }

    if (pico.logisticName === '' && errorsField.logisticName.touch) {
      setErrorsField((prev) => {
        return {
          ...prev,
          logisticName: {
            ...prev.logisticName,
            status: true,
            messages: picoErrorMessages['logistic'],
            message: getTranslationMessage('logistic')
          }
        }
      })
    } else {
      setErrorsField((prev) => {
        return {
          ...prev,
          logisticName: {
            ...prev.logisticName,
            status: false
          }
        }
      })
    }

    if (state.length === 0 && errorsField.createPicoDetail.touch) {
      setErrorsField((prev) => {
        return {
          ...prev,
          createPicoDetail: {
            ...prev.createPicoDetail,
            status: true,
            messages: picoErrorMessages['pickupDetail'],
            message: getTranslationMessage('pickupDetail')
          }
        }
      })
    } else {
      setErrorsField((prev) => {
        return {
          ...prev,
          createPicoDetail: {
            ...prev.createPicoDetail,
            status: false
          }
        }
      })
    }

    const isDetailOrderEmpty = state.filter((item) => item.status !== 'DELETED')
    if (isDetailOrderEmpty.length === 0 && errorsField.createPicoDetail.touch) {
      setErrorsField((prev) => {
        return {
          ...prev,
          createPicoDetail: {
            ...prev.createPicoDetail,
            status: true,
            messages: picoErrorMessages['pickupDetail'],
            message: getTranslationMessage('pickupDetail')
          }
        }
      })
    } else {
      setErrorsField((prev) => {
        return {
          ...prev,
          createPicoDetail: {
            ...prev.createPicoDetail,
            status: false
          }
        }
      })
    }

    if (
      pico.picoType === 'AD_HOC' &&
      pico.reason === '' &&
      errorsField.AD_HOC.touch
    ) {
      setErrorsField((prev) => {
        return {
          ...prev,
          AD_HOC: {
            ...prev.AD_HOC,
            status: true,
            messages: picoErrorMessages['addHocReason'],
            message: getTranslationMessage('addHocReason')
          }
        }
      })
    } else if (pico.picoType === 'AD_HOC' && pico.reason) {
      setErrorsField((prev) => {
        return {
          ...prev,
          AD_HOC: {
            ...prev.AD_HOC,
            status: false
          }
        }
      })
    }

    if (pico.contactNo !== '' && isNaN(Number(pico.contactNo))) {
      setErrorsField((prev) => {
        return {
          ...prev,
          contactNo: {
            ...prev.contactNo,
            status: true,
            messages: picoErrorMessages['contactNo'],
            message: getTranslationMessage('contactNo')
          }
        }
      })
    } else {
      setErrorsField((prev) => {
        return {
          ...prev,
          contactNo: {
            ...prev.contactNo,
            status: false
          }
        }
      })
    }

    if (pico.contractNo !== '' || pico.contractNo === null) {
      setSkipContractNo(false)
    }
  }

  useEffect(() => {
    validateDataChange()
  }, [pico])


  const changeTouchField = (field: fieldName) => {
    setErrorsField((prev) => {
      return {
        ...prev,
        [field]: {
          ...prev[field],
          touch: true
        }
      }
    })
  }

  return {
    validateData,
    errorsField,
    changeTouchField
  }
}

export default useValidationPickupOrder
