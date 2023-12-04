export const localStorgeKeyName = {
  keycloakToken: 'keycloakToken',
  role: 'userRole',
  username: 'username',
  firstTimeLogin: 'false'
};

export const defaultPath = {
  origin: window.location.protocol+'://'+window.location.hostname+':'+window.location.port,
  tenantRegisterPath: origin+'/register/details/'
}

export const layout = {
  drawerWidth: 246,
  appbarHeight: "64px",
  innerScreen_padding: "32px"
}

export const format = {
  //format for date-fns
  dateFormat1: "yyyy/MM/dd",
  dateFormat2: "yyyy/MM/dd HH:mm",
  dateFormat3: "YYYY/MM/DD"
}

export const formErr = {
  empty: "empty",
  wrongFormat: "wrongFormat",
  numberSmallThanZero: "numSmallerThanZero",
  withInColPt_Period: "withIn_ColPt_EffectivePeriod",
  notWithInContractEffDate: "isNotWithIn_ContractEffDate",
  alreadyExist: "alreadyExist",
  hasBeenUsed: "hasBeenUsed"
}