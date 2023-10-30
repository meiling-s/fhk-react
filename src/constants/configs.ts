export const AXIOS_DEFAULT_CONFIGS = Object.freeze({
  baseURL: 'http://localhost:8000/',
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