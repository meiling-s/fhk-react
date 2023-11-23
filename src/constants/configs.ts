export const AXIOS_DEFAULT_CONFIGS = Object.freeze({
  baseURL: {
    account: 'http://localhost:8001/',
    administrator: 'http://localhost:8002/',
    collector: 'http://localhost:8003/',
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