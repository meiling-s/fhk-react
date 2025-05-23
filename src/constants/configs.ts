export const AXIOS_DEFAULT_CONFIGS = Object.freeze({
  baseURL: {
    // account: 'http://10.166.22.107:8001/',
    // administrator: 'http://10.166.22.107:8002/',
    // collector: 'http://10.166.22.107:8003/',

    //account: 'http://10.166.22.250/',
    //administrator: 'http://10.166.22.250/',
    //collector: 'http://10.166.22.250/',
    //logistic: 'http://10.166.22.250/',
    //manufacturer: 'http://10.166.22.250/',
    //customer: 'http://10.166.22.250/'
    //account: 'https://uat.greenhoopapp.com/',
    //administrator: 'https://uat.greenhoopapp.com/',
    //collector: 'https://uat.greenhoopapp.com/',
    //logistic: 'https://uat.greenhoopapp.com/',
    //manufacturer: 'https://uat.greenhoopapp.com/',
    //customer: 'https://uat.greenhoopapp.com/'
    //account: 'https://www.greenhoopapp.com/',
    //administrator: 'https://www.greenhoopapp.com/',
    //collector: 'https://www.greenhoopapp.com/',
    //logistic: 'https://www.greenhoopapp.com/',
    //manufacturer: 'https://www.greenhoopapp.com/',
    //customer: 'https://www.greenhoopapp.com/'
    account: 'http://not.use/',
    administrator: 'http://not.use/',
    collector: 'http://not.use/',
    logistic: 'http://not.use/',
    manufacturer: 'http://not.use/',
    customer: 'http://not.use/',
    factory: 'http://not.use/'
  },
  timeout: 100000,
  headers: {
    post: {
      'Conetent-Type': 'application/json'
    },
    put: {
      'Conetent-Type': 'application/json'
    }
  }
})

export const TENANT_REGISTER_CONFIGS = Object.freeze({
  maxBRNImages: 3,
  maxEPDImages: 3,
  maxImageSize: 3 * 1000 * 1000 //In bytes, MB contains 1000 KB, 1 KB contains 1000 bytes
})

export const EVENT_RECORDING = Object.freeze({
  maxImageNumber: 5,
  maxImageSize: 1 * 1000 * 1000 //In bytes, MB contains 1000 KB, 1 KB contains 1000 bytes
})
