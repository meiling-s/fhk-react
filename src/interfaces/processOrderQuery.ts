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

export type DeleteOrCancelForm = {
  status: string
  updatedBy: string
  processOrderRejectReason: PorReason[]
  version: 0
}

type ProcessOrderDetailWarehouse = {
  warehouseId: number
}

type ProcessOrderDetailRecyc = {
  recycTypeId: string
  recycSubTypeId: string
}

type ProcessOrderDetailProduct = {
  productTypeId: string
  productSubTypeId: string
  productAddonTypeId: string
}

type ProcessOrderDetail = {
  processOrderDtlId: number
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
}

type ProcessOrderRejectReason = {
  processOrderId: 0
  reasonId: 0
  remark: 'string'
}

export type ProcessOrderItem = {
  processOrderId: number
  labelId: string
  tenantId: number
  factoryId: number
  processStartAt: string
  status: string
  createdBy: string
  updatedBy: string | null
  processOrderDetail: ProcessOrderDetail[]
  processOrderRejectReason: ProcessOrderRejectReason[]
}

export type CreateProcessOrderDetail = {
  processTypeId: string
  estInWeight: number
  estOutWeight: number
  plannedStartAt: string
  processOrderDetailProduct: ProcessOrderDetailProduct[]
  processOrderDetailRecyc: ProcessOrderDetailRecyc[]
  processOrderDetailWarehouse: ProcessOrderDetailWarehouse[]
}

export type CreatePorForm = {
  factoryId: number
  processStartAt: string
  createdBy: string
  processOrderDetail: CreateProcessOrderDetail[]
}

export type PorDetail = {
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
