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
  }
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
  const { dateFormat } = useContainer(CommonTypeContainer)

  const errorMessages: any = {
    routine: {
      mesageEn: 'Routine is Required',
      messageTc: '需要規律的生活',
      messageSc: '例行公事是必需的'
    },
    logistic: {
      messageEn: 'Logistic Company is Required',
      messageTc: '需要物流公司',
      messageSc: '需要物流公司'
    },
    vehicleType: {
      messageEn: 'Vehicle type is Required',
      messageTc: '車輛類型為必填',
      messageSc: '车辆载货量为必填项'
    },
    vehiclePlatNo: {
      messageEn: 'Vehicle plate number is Required',
      messageTc: '車輛編碼為必填項',
      messageSc: '车辆编码为必填项'
    },
    pickupDetail: {
      messageEn: 'Pickup order detail is Required',
      messageTc: '取貨訂單詳細資料為必填項',
      messageSc: '需要提供取货订单详细信息'
    },
    addHocReason: {
      messageEn: 'Ad-hoc reason is Required',
      messageTc: '特殊原因為必填項',
      messageSc: '需要临时理由'
    },
    shippingtoDateNotValid: {
      messageEn: 'Shipping validity to date not valid',
      messageTc: '迄今為止的運送有效期限無效',
      messageSc: '迄今为止的运输有效期无效'
    },
    shippingFromDateNotValid: {
      messageEn: 'Shipping validity date from not valid',
      messageTc: '出貨有效期限自無效',
      messageSc: '运输有效期从无效'
    },
    specificDate: {
      messageEn: 'Specific Date is Required',
      messageTc: '需要具體日期',
      messageSc: '需要具体日期'
    },
    invalidDate: {
      messageEn:
        'Shipping validity start date should be lower than shipping validity end date',
      messageTc: '运输有效期开始日期应低于运输有效期结束日期',
      messageSc: '出貨有效期限開始日期應早於出貨有效期限結束日期'
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
      messageEn: 'Weekly Date is Required',
      messageTc: '每週日期為必填項',
      messageSc: '每周日期为必填项'
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

  const validateData = (): boolean => {
    let isValid = true

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
            effFrmDate: {
              ...prev.effFrmDate,
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
      const fromDate = dayjs(pico.effFrmDate).startOf('day')

      const toDate = dayjs(pico.effToDate).startOf('day')

      const invalidFormatDates: string[] = []
      const outOfRangeDates: string[] = []

      pico.routine.map((item: any) => {
        const date = dayjs(item).startOf('day')

        // Check if date is in the correct format
        // if (date === 'Invalid Date') {
        //   invalidFormatDates.push(item)
        //   return false
        // }

        // Check if date is within the valid range
        if (date < fromDate || date > toDate) {
          outOfRangeDates.push(item)
          return false
        }
      })

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
        // } else if (routine.includes(false)) {
        //   console.log('routine', routine)
        //   isValid = false
        //   setErrorsField((prev) => {
        //     return {
        //       ...prev,
        //       routine: {
        //         ...prev.routine,
        //         status: true,
        //         messages: errorMessages['out_of_date_range'],
        //         message: getTranslationMessage('out_of_date_range')
        //       }
        //     }
        //   })
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
      } else if (invalidFormatDates.length > 0) {
        isValid = false
        setErrorsField((prev) => {
          return {
            ...prev,
            routine: {
              ...prev.routine,
              status: true,
              messages: errorMessages['specified_date_invalid'],
              message: getTranslationMessage('specified_date_invalid')
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
      pico.picoType === 'picoType' &&
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
      pico.picoType === 'picoType' &&
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
    // if(pico.vehicleTypeId === ''){
    //   isValid = false;
    //   setErrorsField(prev => {
    //     return {
    //       ...prev,
    //       vehicleTypeId: {
    //         ...prev.vehicleTypeId,
    //         status: true,
    //         messages: errorMessages['vehicleType'],
    //         message: getTranslationMessage('vehicleType')
    //       }
    //     }
    //   })
    // } else {
    //   setErrorsField(prev => {
    //     return {
    //       ...prev,
    //       vehicleTypeId: {
    //         ...prev.vehicleTypeId,
    //         status: false,
    //       }
    //     }
    //   })
    // }

    // if(pico.platNo === ''){
    //   isValid = false;
    //   setErrorsField(prev => {
    //     return {
    //       ...prev,
    //       platNo: {
    //         ...prev.platNo,
    //         status: true,
    //         messages: errorMessages['vehiclePlatNo'],
    //         message: getTranslationMessage('vehiclePlatNo')
    //       }
    //     }
    //   })
    // } else {
    //   setErrorsField(prev => {
    //     return {
    //       ...prev,
    //       platNo: {
    //         ...prev.platNo,
    //         status: false,
    //       }
    //     }
    //   })
    // }

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

    return isValid
  }

  const validateDataChange = () => {
    const fromDate = dayjs(pico.effFrmDate)

    const toDate = dayjs(pico.effToDate)
    if (!isValidDayjsISODate(fromDate)) {
      const fromDate = dayjs(pico.effFrmDate)
      // if(!isValidDayjsISODate(fromDate)) {
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
    if (!isValidDayjsISODate(toDate)) {
      // if(!isValidDayjsISODate(toDate)) {
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
            effFrmDate: {
              ...prev.effFrmDate,
              status: false,
              message: ''
            }
          }
        })
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
        const fromDate = dayjs(pico.effFrmDate).startOf('day')

        const toDate = dayjs(pico.effToDate).startOf('day')
        const invalidFormatDates: string[] = []
        const outOfRangeDates: string[] = []

        pico.routine.map((item: any) => {
          const date = dayjs(item).startOf('day')

          // Check if date is in the correct format
          // if (date === 'Invalid Date') {
          //   invalidFormatDates.push(item)
          //   return false
          // }

          // Check if date is within the valid range
          if (date < fromDate || date > toDate) {
            outOfRangeDates.push(item)
            return false
          }
        })

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
          //} else if (routine.includes(false)) {
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
        } else if (invalidFormatDates.length > 0) {
          setErrorsField((prev) => {
            return {
              ...prev,
              routine: {
                ...prev.routine,
                status: true,
                messages: errorMessages['specified_date_invalid'],
                message: getTranslationMessage('specified_date_invalid')
              }
            }
          })
        } else {
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
        pico.routineType === 'weekly' &&
        pico.routine.length === 0 &&
        errorsField.routine.touch
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
      } else if (
        pico.routineType === 'weekly' &&
        pico.routine.length >= 0 &&
        errorsField.routine.touch
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
    // if(pico.platNo === '' && errorsField.platNo.touch){

    //   setErrorsField(prev => {
    //     return {
    //       ...prev,
    //       platNo: {
    //         ...prev.platNo,
    //         status: true,
    //         messages: errorMessages['vehiclePlatNo'],
    //         message: getTranslationMessage('vehiclePlatNo')
    //       }
    //     }
    //   })
    // } else {
    //   setErrorsField(prev => {
    //     return {
    //       ...prev,
    //       platNo: {
    //         ...prev.platNo,
    //         status: false,
    //       }
    //     }
    //   })
    // }

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
  }

  useEffect(() => {
    validateDataChange()
  }, [pico])
  // console.log('ErrorsField', errorsField)
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
