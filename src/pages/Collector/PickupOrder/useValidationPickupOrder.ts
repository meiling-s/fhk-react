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

type fieldName =
  | 'effFrmDate'
  | 'effToDate'
  | 'routine'
  | 'logisticName'
  | 'vehicleTypeId'
  | 'platNo'
  | 'reason'
  | 'createPicoDetail'
  | 'AD_HOC'
  | 'weeklyDate'
  | 'contactNo'
  | 'contractNo'

const initialErrors = {
  effFrmDate: {
    type: 'string',
    status: false,
    required: true,
    message: '',
    messages: {},
    touch: false
  },
  effToDate: {
    type: 'string',
    status: false,
    required: true,
    message: '',
    messages: {},
    touch: false
  },
  routine: {
    type: 'string',
    status: false,
    required: true,
    message: '',
    messages: {},
    touch: false
  },
  logisticName: {
    type: 'string',
    status: false,
    required: true,
    message: '',
    messages: {},
    touch: false
  },
  vehicleTypeId: {
    type: 'string',
    status: false,
    required: true,
    message: '',
    messages: {},
    touch: false
  },
  platNo: {
    type: 'string',
    status: false,
    required: true,
    message: '',
    messages: {},
    touch: false
  },
  reason: {
    type: 'string',
    status: false,
    required: true,
    message: '',
    messages: {},
    touch: false
  },
  createPicoDetail: {
    type: 'array',
    status: false,
    required: true,
    message: '',
    messages: {},
    touch: false
  },
  AD_HOC: {
    type: 'string',
    status: false,
    required: true,
    message: '',
    messages: {},
    touch: false
  },
  weeklyDate: {
    type: 'string',
    status: false,
    required: true,
    message: '',
    messages: {},
    touch: false
  },
  contactNo: {
    type: 'number',
    status: false,
    required: true,
    message: '',
    messages: {},
    touch: false
  },
  contractNo: {
    type: 'string',
    status: false,
    required: false,
    message: '',
    messages: {},
    touch: false
  },
}

type ErrorsField = Record<
  fieldName,
  {
    type: string
    status: boolean
    required: boolean
    message: string
    messages: any
    touch: boolean
  }
>

const useValidationPickupOrder = (
  pico: CreatePO | EditPo,
  state: CreatePicoDetail[]
) => {
  const { i18n } = useTranslation()
  const [errorsField, setErrorsField] = useState<ErrorsField>(initialErrors)
  const [skipContractNo, setSkipContractNo] = useState<boolean>(false)
  const { dateFormat } = useContainer(CommonTypeContainer)

  const errorMessages: any = {
    routine: {
      mesageEn: 'Routine should not be empty',
      messageTc: '例行公事 不應留白',
      messageSc: '例行事务 不应留空'
    },
    logistic: {
      messageEn: 'Logistic Company should not be empty',
      messageTc: '物流公司 不應留白',
      messageSc: '物流公司 不应留白'
    },
    vehicleType: {
      messageEn: 'Vehicle type should not be empty',
      messageTc: '車輛類型 不應留白',
      messageSc: '车辆类型 不应留白'
    },
    vehiclePlatNo: {
      messageEn: 'Vehicle plate number should not be empty',
      messageTc: '車牌號碼 不應留白',
      messageSc: '车牌号码 不应留空'
    },
    pickupDetail: {
      messageEn: 'Pickup order detail should not be empty',
      messageTc: '取貨訂單詳細資料 不應留白',
      messageSc: '取货订单详情 不应留白'
    },
    addHocReason: {
      messageEn: 'Ad-hoc reason should not be empty',
      messageTc: '特殊原因 不應留白',
      messageSc: '特殊原因 不应留白'
    },
    shippingtoDateNotValid: {
      messageEn: 'Shipping validity to date not valid',
      messageTc: '運輸有效日期至無效',
      messageSc: '运输有效日期至无效'
    },
    shippingFromDateNotValid: {
      messageEn: 'Shipping validity date from not valid',
      messageTc: '運輸有效日期由無效',
      messageSc: '运输有效日期由无效'
    },
    specificDate: {
      messageEn: 'Specific Date should not be empty',
      messageTc: '需具體日期 不應留白',
      messageSc: '具体日期 不应留白'
    },
    invalidDate: {
      messageEn: 'Validity Date Effective from date should not later than Effective to date',
      messageTc: '有效日期由 開始日期不能晚於截止日期',
      messageSc: '有效日期由 开始日期不能晚于截止日期'
    },
    out_of_date_range: {
      messageEn: 'Specified date(s) are out of the shipping validity range',
      messageTc: '指定日期超出運輸有效期限的資料範圍',
      messageSc: '指定日期超出运输有效期的数据范围'
    },
    specified_date_invalid: {
      messageEn: 'Specified date(s) is invalid format',
      messageTc: '指定的日期格式無效',
      messageSc: '指定的日期格式无效'
    },
    weeklyDate: {
      messageEn: 'Weekly Date should not be empty',
      messageTc: '每週日期 不應留白',
      messageSc: '每周日期 不应留白'
    },
    duplicateDateTimePeriod: {
      messageEn: 'Duplicate time periode should not be allowed',
      messageTc: '不允許重複的時間段',
      messageSc: '不允许重复的时间段'
    },
    contactNo: {
      messageEn:
        'Contact number The content you entered contains invalid characters.',
      messageTc: '聯絡人號碼 您輸入的內容包含無效字元',
      messageSc: '联络人号码 您输入的内容包含无效字元'
    },
    contractNo: {
      messageEn: 'should not be empty',
      messageTc: '不應留白',
      messageSc: '不应留白'
    }
  }

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
    const errorMessage = errorMessages[field]
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
              messages: errorMessages['shippingFromDateNotValid'],
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
              messages: errorMessages['invalidDate'],
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
              messages: errorMessages['shippingtoDateNotValid'],
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
              messages: errorMessages['invalidDate'],
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
            messages: errorMessages['routine'],
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
            messages: errorMessages['specificDate'],
            message: getTranslationMessage('specificDate')
          }
        }
      })
    } else if (
      pico.picoType === 'ROUTINE' &&
      pico.routineType === 'specificDate' &&
      pico.routine.length >= 1
    ) {
        const fromDate = dayjs(pico.effFrmDate, 'DD/MM/YY').startOf('day');
        const toDate = dayjs(pico.effToDate, 'DD/MM/YY').startOf('day');
       
        const outOfRangeDates: string[] = [];

        pico.routine.map((item: any) => {
          // Parse the item with the expected format
          const date = dayjs(item, 'DD/MM/YY').startOf('day');

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
              messages: errorMessages['duplicateDateTimePeriod'],
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
              messages: errorMessages['out_of_date_range'],
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
            messages: errorMessages['weeklyDate'],
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
            messages: errorMessages['logistic'],
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
            messages: errorMessages['pickupDetail'],
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
            messages: errorMessages['pickupDetail'],
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
            messages: errorMessages['addHocReason'],
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
            messages: errorMessages['contactNo'],
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
                messages: errorMessages['contractNo'],
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
            messages: errorMessages['shippingFromDateNotValid'],
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
              messages: errorMessages['invalidDate'],
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
            messages: errorMessages['shippingtoDateNotValid'],
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
              messages: errorMessages['invalidDate'],
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
            messages: errorMessages['routine'],
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
              messages: errorMessages['specificDate'],
              message: getTranslationMessage('specificDate')
            }
          }
        })
      } else if (
        pico.routineType === 'specificDate' &&
        pico.routine.length >= 1 &&
        errorsField.routine.touch
      ) {
        const fromDate = dayjs(pico.effFrmDate, 'DD/MM/YY').startOf('day');
        const toDate = dayjs(pico.effToDate, 'DD/MM/YY').startOf('day');
        const invalidFormatDates: string[] = [];
        const outOfRangeDates: string[] = [];

        pico.routine.map((item: any) => {
          // Parse the item with the expected format
          const date = dayjs(item, 'DD/MM/YY').startOf('day');

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
                messages: errorMessages['duplicateDateTimePeriod'],
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
                messages: errorMessages['out_of_date_range'],
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
              messages: errorMessages['weeklyDate'],
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
            messages: errorMessages['logistic'],
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
            messages: errorMessages['pickupDetail'],
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
            messages: errorMessages['pickupDetail'],
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
            messages: errorMessages['addHocReason'],
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
            messages: errorMessages['contactNo'],
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
