import { AxiosRequestConfig } from "axios";

//process records
export const GET_PROCESS_OUT = (table: string): AxiosRequestConfig => ({
  method: "get",
  url: `api/v1/collectors/processout/${table}`,
});

export const GET_PROCESS_IN_BY_ID = (
  table: string,
  processInId: number
): AxiosRequestConfig => ({
  method: "get",
  url: `api/v1/collectors/processin/${table}/${processInId}`,
});

export const GET_PROCESS_LIST: AxiosRequestConfig = {
  method: "get",
  url: `api/v1/administrator/ProcessType`,
};

export const GET_PROCESS_OUT_DETAIL = (
  table: string,
  processOutId: number
): AxiosRequestConfig => ({
  method: "get",
  url: `api/v1/collectors/processout/${table}/${processOutId}`,
});

export const CREATE_PROCESS_OUT_ITEM = (
  table: string,
  processOutId: number
): AxiosRequestConfig => ({
  method: "post",
  url: `api/v1/collectors/processout/${table}/items/${processOutId}`,
});

export const EDIT_PROCESS_OUT_DETAIL_ITEM = (
  table: string,
  processOutId: number,
  processOutDtlId: number
): AxiosRequestConfig => ({
  method: "put",
  url: `api/v1/collectors/processout/${table}/processout/${processOutId}/proecessoutDtl/${processOutDtlId}`,
});

export const DELETE_PROCESS_OUT_RECORD = (
  table: string,
  processOutId: number
): AxiosRequestConfig => ({
  method: "patch",
  url: `api/v1/collectors/processout/${table}/delete/${processOutId}`,
});

export const DELETE_PROCESS_OUT_DETAIL_ITEM = (
  table: string,
  processOutDtlId: number
): AxiosRequestConfig => ({
  method: "patch",
  url: `api/v1/collectors/processoutDetail/${table}/${processOutDtlId}/status`,
});
