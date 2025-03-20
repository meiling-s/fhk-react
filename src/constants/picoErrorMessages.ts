

  export type fieldName =
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
  | 'contractNo';

export const initialErrors: ErrorsField = {
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
  }
};

export type ErrorsField = Record<
  fieldName,
  {
    type: string;
    status: boolean;
    required: boolean;
    message: string;
    messages: any;
    touch: boolean;
  }
>;

export const picoErrorMessages: Record<string, any> = {
  routine: {
    messageEn: 'Routine should not be empty',
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
    messageEn: 'Effective from date should not be later than effective to date',
    messageTc: '生效日期不能晚於結束日期',
    messageSc: '生效日期不能晚于结束日期'
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
    messageEn: 'Duplicate time period should not be allowed',
    messageTc: '不允許重複的時間段',
    messageSc: '不允许重复的时间段'
  },
  contactNo: {
    messageEn: 'Contact number The content you entered contains invalid characters.',
    messageTc: '聯絡人號碼 您輸入的內容包含無效字元',
    messageSc: '联络人号码 您输入的内容包含无效字元'
  },
  contractNo: {
    messageEn: 'should not be empty',
    messageTc: '不應留白',
    messageSc: '不应留白'
  }
};
