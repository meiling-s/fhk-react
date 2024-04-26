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
  realmApiRoute: 'realmApiRoute'
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
  timeCantDuplicate: 'timeCantDuplicate'
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
  CREATED : 'CREATED'
}

export const Languages = {
  ENUS : 'enus',
  ZHCH : 'zhch',
  ZHHK : 'zhhk'
}
