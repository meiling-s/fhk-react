export const localStorgeKeyName = {
  keycloakToken: 'keycloakToken',
  username: 'username',
};

export const defaultPath = {
  origin: window.location.protocol+'://'+window.location.hostname+':'+window.location.port,
  tenantRegisterPath: origin+'/register/details/'
}

export const layout = {
  drawerWidth: 246,
  appbarHeight: "64px"
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

}