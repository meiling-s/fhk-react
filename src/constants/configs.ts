export const AXIOS_DEFAULT_CONFIGS = Object.freeze({
  baseURL: {
    account: 'http://10.166.22.107:8001/',
    administrator: 'http://10.166.22.107:8002/',
    collector: 'http://10.166.22.107:8003/',
  },
  timeout: 100000,
  headers: {
    post: {
      'Conetent-Type': 'application/json',
    },
    put: {
      'Conetent-Type': 'application/json',
    },
  },
});

export const TENANT_REGISTER_CONFIGS = Object.freeze({
  maxBRNImages: 3,
  maxEPDImages: 3,
  maxImageSize: 3 * 1000 * 1000   //In bytes, MB contains 1000 KB, 1 KB contains 1000 bytes
})