export const localStorgeKeyName = {
  keycloakToken: 'keycloakToken',
  refreshToken: 'refreshToken',
  role: 'userRole',
  realm: 'realm',
  username: 'username',
  firstTimeLogin: 'firstTimeLogin',
  decodeKeycloack: 'decodeKeycloack',
  // 20240129 add function list daniel keung start
  functionList: 'functionList',
  // 20240129 add function list daniel keung end
  tenantId: 'tenantId',
  realmApiRoute: 'realmApiRoute',
  selectedLanguage: 'selectedLanguage'
}

export const defaultPath = {
  origin:
    window.location.protocol +
    '://' +
    window.location.hostname +
    ':' +
    window.location.port,
  tenantRegisterPath: origin + '/register/details/'
}

export const layout = {
  drawerWidth: 246,
  appbarHeight: '64px',
  innerScreen_padding: '32px'
}

export const format = {
  dateFormat1: 'YYYY/MM/DD HH:mm',
  dateFormat2: 'YYYY/MM/DD',
  dateFormat3: 'YYYY-MM-DD',
  dateFormat4: 'yyyy/MM/dd',
  timeFormat: 'HH:mm:ss'
}

export const formErr = {
  empty: 'empty',
  wrongFormat: 'wrongFormat',
  numberSmallThanZero: 'numSmallerThanZero',
  withInColPt_Period: 'withIn_ColPt_EffectivePeriod',
  notWithInContractEffDate: 'isNotWithIn_ContractEffDate',
  alreadyExist: 'alreadyExist',
  hasBeenUsed: 'hasBeenUsed',
  exceedsMaxLength: 'exceedsMaxLength',
  minMoreOneImgUploded: 'minMoreOneImgUploded',
  startDateBehindEndDate: 'startDateBehidEndDate',
  endDateEarlyThanStartDate: 'endDateEarlyThanStartDate',
  timeCantDuplicate: 'timeCantDuplicate',
  loginIdCantContainAdmin: 'loginIdCantContainAdmin',
  startDateIsLaterThanToDate: 'startDateIsLaterThanToDate',
  toDateIsEarlierThanStartDate: 'toDateIsEarlierThanStartDate',
  tenantIdShouldBeSixDigit: 'tenantIdShouldBeSixDigit',
  tenantIdNotFound: 'tenantIdNotFound',
  mustDifferent: 'mustDifferent',
  loginIdProhibited: 'loginIdProhibited',
  incorrectAddress: 'incorrectAddress',
  dateOutOfRange: 'dateOutOfRange',
  dateSpesificIsWrong: 'dateSpesificIsWrong',
  effectiveDateLess: 'effectiveDateLess',
  cannotBeSame: 'cannotBeSame'
}

export const Notiftemplate = {
  email: 'email',
  app: 'app',
  sms: 'sms',
  broadcast: 'broadcast'
}

export const Roles = {
  collectorAdmin: 'collector',
  logisticAdmin: 'logistic',
  astd: 'astd',
  manufacturerAdmin: 'manufacturer',
  customerAdmin: 'customer'
}

export const Realm = {
  collector: 'collector',
  logistic: 'logistic',
  astd: 'astd',
  manufacturer: 'manufacturer',
  customer: 'customer'
}

export const RealmApi = {
  collector: 'collectors',
  logistic: 'logistic',
  astd: 'astd',
  manufacturer: 'manufacturer',
  customer: 'customer'
}

export const Status = {
  CREATED : 'CREATED',
  CONFIRMED : "CONFIRMED",
  REJECTED : "REJECTED"
}

export const Languages = {
  ENUS : 'enus',
  ZHCH : 'zhch',
  ZHHK : 'zhhk'
}

export type fieldNameRecycables = 'Rechargeable Batteries' | 'Glass Bottles' | 'Paper' | 'Fluorescent Lamps and Tubes' | 'Small Electrical Appliances'| 'Plastics' | 'Non-recyclable' | 'Cardboard' | 'Metals';
type ColorNameRecycables = '#EFE72F' | '#4FB5F5' | '#7ADFF1' | '#ECAB05' | '#5AE9D8'| '#FF9FB7' | '#F9B8FF' | '#C69AFF';
export type months = 'January' | 'February' | 'March' | 'April' | 'May'| 'June' | 'Juli' | 'August'| 'September'| 'October' | 'November' | 'December';
export type monthSequence = 0| 1 | 2| 3 | 4| 5| 6 | 7 | 8 | 9| 10 | 11;
type TypeRecycable = {
  'RECHARGEABLE_BATTERIES'?: fieldNameRecycables;
  'GLASS_BOTTLES'?: fieldNameRecycables;
  'PAPER'?: fieldNameRecycables;
  'FLUORESCENT_LAMPS_AND_TUBES'?: fieldNameRecycables;
  'SMALL_ELETRICAL_APPLIANCES'?: fieldNameRecycables;
  'PLASTICS'?: fieldNameRecycables;
  'NON_RECYCLABLE'?: fieldNameRecycables;
  'CARDBOARD'?: fieldNameRecycables;
  'Metals'?: fieldNameRecycables;
};

export const TypeRecycables:TypeRecycable = {
  RECHARGEABLE_BATTERIES: 'Rechargeable Batteries',
  GLASS_BOTTLES: 'Glass Bottles',
  PAPER: 'Paper',
  FLUORESCENT_LAMPS_AND_TUBES: 'Fluorescent Lamps and Tubes',
  SMALL_ELETRICAL_APPLIANCES: 'Small Electrical Appliances',
  PLASTICS: 'Plastics',
  NON_RECYCLABLE: 'Non-recyclable',
  CARDBOARD: 'Cardboard',
  Metals: 'Metals'
}

export const indexMonths: string[] = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export const MAINTENANCE_STATUS = {
  NOT_UNDER_MAINTENANCE : 'NOT_UNDER_MAINTENANCE',
  UNDER_MAINTENANCE : 'UNDER_MAINTENANCE'
}

export const STATUS_CODE = {
  200: 200,
  201: 201,
  400: 400,
  401: 401,
  402: 402,
  403: 403,
  404: 404,
  408: 408,
  500: 500,
  501: 501,
  502: 502,
  503: 503,
  504: 504,
  511: 511,
}