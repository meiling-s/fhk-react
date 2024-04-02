import { Axios, AxiosRequestConfig } from 'axios'

export const DOWNLOAD_WORD_REPORT = (

): AxiosRequestConfig => ({
  method: "get",
  url: `api/v1/collectors/download-word`,
});

export const DOWNLOAD_EXCEL_REPORT = (
  
): AxiosRequestConfig => ({
  method: "get",
  url: `api/v1/collectors/download-excel`,
});