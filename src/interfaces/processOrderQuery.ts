import { singleProduct } from '../components/SpecializeComponents/ProductListSingleSelect'
import { singleRecyclable } from './collectionPoint'

export type PorQuery = {
  labelId: string
  frmCreatedDate: string
  toCreatedDate: string
  status: 'CREATED' | 'COMPLETED' | 'DELETED' | string
}

export type PorReason = {
  reasonId: number
  remark: string
}

export type CancelFormPor = {
  status: string
  updatedBy: string
  processOrderRejectReason: PorReason[]
  version: number
}

export type ProcessOrderDetailWarehouse = {
  warehouseId: number
}

export type ProcessOrderDetailRecyc = {
  recycTypeId: string
  recycSubTypeId: string
}

export type ProcessOrderDetailProduct = {
  productTypeId: string
  productSubTypeId: string
  productAddonId: string
  productSubTypeRemark: string
  productAddonTypeRemark: string
  isProductSubTypeOthers?: boolean
  isProductAddonTypeOthers?: boolean
}

export type ProcessOrderDetail = {
  processOrderDtlId: number
  processTypeId: string
  processAction: string
  estInWeight: number
  estOutWeight: number
  plannedStartAt: string
  plannedEndAt: string
  createdBy: string
  updatedBy: string | null
  processOrderDetailProduct: ProcessOrderDetailProduct[]
  processOrderDetailRecyc: ProcessOrderDetailRecyc[]
  processOrderDetailWarehouse: ProcessOrderDetailWarehouse[]
  refProcessIn: number | null
}

type ProcessOrderRejectReason = {
  processOrderId: 0
  reasonId: 0
  remark: 'string'
}

export type ProcessOrderItem = {
  processOrderId: number
  processTypeId: string
  labelId: string
  tenantId: number
  factoryId: number
  processStartAt: string
  status: string
  createdBy: string
  updatedBy: string | null
  processOrderDetail: ProcessOrderDetail[]
  processOrderRejectReason: ProcessOrderRejectReason[]
  version: number
}

type ProcessInItem = {
  idPair: number
  processTypeId: string
  itemCategory?: string
  processAction: string
  estInWeight: string | number
  plannedStartAt: string
  processOrderDetailProduct: ProcessOrderDetailProduct[]
  processOrderDetailRecyc: ProcessOrderDetailRecyc[]
  processOrderDetailWarehouse: ProcessOrderDetailWarehouse[]
}

type ProcessOutItem = {
  idPair: number
  processTypeId: string
  itemCategory?: string
  processAction: string
  estOutWeight: string | number
  plannedEndAt: string
  processOrderDetailProduct: ProcessOrderDetailProduct[]
  processOrderDetailRecyc: ProcessOrderDetailRecyc[]
  processOrderDetailWarehouse: ProcessOrderDetailWarehouse[]
}

export type CreateProcessOrderDetailPairs = {
  processIn: ProcessInItem
  processOut: ProcessOutItem
}

export type CreatePorForm = {
  factoryId: number | null
  processStartAt: string
  createdBy: string
  processOrderDetailPairs: CreateProcessOrderDetailPairs[]
}

export type CreateProcessOrderDetailPairsPorDetail = {
  id: number
  processTypeId: string
  itemCategory: string
  estInWeight: string
  estOutWeight: number
  plannedStartAt: string
  processOrderDetailProduct: singleProduct
  processOrderDetailRecyc: singleRecyclable
  processOrderDetailWarehouse: string[]
}

export type QueryEstEndDatetime = {
  processTypeId: string
  estInWeight: number
  plannedStartAt: string
}
