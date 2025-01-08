import { useEffect, useState } from 'react'

import { Box, Divider, Grid, InputAdornment } from '@mui/material'
import RightOverlayForm from '../../../components/RightOverlayForm'
import { ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import CustomItemList, {
  il_item
} from '../../../components/FormComponents/CustomItemList'
import CustomField from '../../../components/FormComponents/CustomField'

import CustomTextField from '../../../components/FormComponents/CustomTextField'
import RecyclablesListSingleSelect from '../../../components/SpecializeComponents/RecyclablesListSingleSelect'
import {
  recyclable,
  singleRecyclable
} from '../../../interfaces/collectionPoint'
import {
  CreateProcessOrderDetailPairs,
  ProcessOrderDetailRecyc,
  ProcessOrderDetailWarehouse,
  QueryEstEndDatetime
} from '../../../interfaces/processOrderQuery'
import CommonTypeContainer from '../../../contexts/CommonTypeContainer'
import { useContainer } from 'unstated-next'
import { getAllWarehouse } from '../../../APICalls/warehouseManage'
import {
  extractError,
  formatWeight,
  getThemeCustomList,
  onChangeWeight,
  returnErrorMsg
} from '../../../utils/utils'
import {
  formErr,
  localStorgeKeyName,
  STATUS_CODE
} from '../../../constants/constant'
import { useNavigate } from 'react-router-dom'
import ProductListSingleSelect, {
  singleProduct
} from '../../../components/SpecializeComponents/ProductListSingleSelect'
import RecyclablesList from 'src/components/SpecializeComponents/RecyclablesList'
import { getEstimateEndTime } from 'src/APICalls/processOrder'
import dayjs from 'dayjs'
import { formValidate } from 'src/interfaces/common'
import { FormErrorMsg } from 'src/components/FormComponents/FormErrorMsg'
import CustomButton from 'src/components/FormComponents/CustomButton'
import ConfirmModal from 'src/components/SpecializeComponents/ConfirmationModal'
import ProductListMultiSelect, {
  productsVal
} from 'src/components/SpecializeComponents/ProductListMultiSelect'
import { transformData } from './utils'

type ConfirmRemarksProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

const ConfirmRemarksModal: React.FC<ConfirmRemarksProps> = ({
  open,
  onClose,
  onConfirm
}) => {
  const { t } = useTranslation()

  return (
    <ConfirmModal
      isOpen={open}
      message={t('pick_up_order.confirm_empty_remarks')}
      onConfirm={async () => {
        onConfirm()
      }}
      onCancel={() => onClose()}
    />
  )
}

const InputProcessForm = ({
  drawerOpen,
  handleDrawerClose,
  plannedStartAtInput,
  action = 'add',
  onSave,
  dataSet,
  editedValue
}: {
  drawerOpen: boolean
  handleDrawerClose: () => void
  plannedStartAtInput: string
  action: 'add' | 'edit' | 'delete' | 'none'
  formType?: string
  onSave: (
    processOrderDtl: CreateProcessOrderDetailPairs[],
    isUpdate: boolean
  ) => void

  dataSet: CreateProcessOrderDetailPairs[]
  editedValue: CreateProcessOrderDetailPairs[] | null
}) => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const {
    getProcessTypeList,
    processTypeListData,
    recycType,
    getProductType,
    productType,
    decimalVal
  } = useContainer(CommonTypeContainer)
  const role = localStorage.getItem(localStorgeKeyName.role) || 'collectoradmin'
  const customListTheme = getThemeCustomList(role) || '#E4F6DC'
  const [warehouseOption, setWarehouseOption] = useState<il_item[]>([])
  const [processTypeList, setProcessTypeList] = useState<il_item[]>([])
  const [processTypeId, setProcessTypeId] = useState<string>('')
  const [modalRemark, setModalRemarks] = useState<boolean>(false)
  const itemCategory = () => {
    const colList: il_item[] = [
      {
        name: t('processOrder.create.recycling'),
        id: 'recycling'
      },
      {
        name: t('processOrder.create.product'),
        id: 'product'
      }
    ]
    return colList
  }
  const [trySubmited, setTrySubmited] = useState<boolean>(false)
  const [validation, setValidation] = useState<formValidate[]>([])

  const initDetail: CreateProcessOrderDetailPairs[] = [
    {
      processIn: {
        idPair: 0,
        processTypeId: '',
        itemCategory: 'recycling',
        processAction: 'PROCESS_IN',
        estInWeight: '0',
        plannedStartAt: plannedStartAtInput,
        processOrderDetailProduct: [],
        processOrderDetailRecyc: [],
        processOrderDetailWarehouse: []
      },
      processOut: {
        idPair: 0,
        processTypeId: '',
        itemCategory: 'product',
        processAction: 'PROCESS_OUT',
        estOutWeight: '0',
        plannedEndAt: '',
        processOrderDetailProduct: [],
        processOrderDetailRecyc: [],
        processOrderDetailWarehouse: []
      }
    }
  ]

  const [processOrderDetail, setProcessOrderDetail] =
    useState<CreateProcessOrderDetailPairs[]>(initDetail)

  const mappingData = () => {
    if (editedValue) {
      const mappedData = editedValue.map((item) => ({
        processIn: {
          idPair: item.processIn?.idPair ?? 0,
          processTypeId: item.processIn?.processTypeId || '',
          itemCategory: item.processIn?.itemCategory || 'recycling',
          processAction: item.processIn?.processAction || 'PROCESS_IN',
          estInWeight: item.processIn?.estInWeight || '0',
          plannedStartAt: item.processIn?.plannedStartAt || plannedStartAtInput,
          processOrderDetailProduct: item.processIn.processOrderDetailProduct,
          processOrderDetailRecyc:
            item.processIn?.processOrderDetailRecyc || [],
          processOrderDetailWarehouse:
            item.processIn?.processOrderDetailWarehouse || []
        },
        processOut: {
          idPair: item.processOut?.idPair ?? 0,
          processTypeId: item.processOut?.processTypeId || '',
          itemCategory: item.processOut?.itemCategory || 'product',
          processAction: item.processOut?.processAction || 'PROCESS_OUT',
          estOutWeight: item.processOut?.estOutWeight || '0',
          plannedEndAt: item.processOut?.plannedEndAt || '',
          processOrderDetailProduct: item.processOut.processOrderDetailProduct,
          processOrderDetailRecyc:
            item.processOut?.processOrderDetailRecyc || [],
          processOrderDetailWarehouse:
            item.processOut?.processOrderDetailWarehouse || []
        }
      }))
      setProcessTypeId(editedValue[0].processIn.processTypeId)
      setProcessOrderDetail(mappedData)
    }
  }

  const initWarehouse = async () => {
    try {
      const result = await getAllWarehouse(0, 1000)
      if (result) {
        let warehouse: il_item[] = []
        const data = result.data.content

        data.forEach((item: any) => {
          var warehouseName =
            i18n.language === 'zhhk'
              ? item.warehouseNameTchi
              : i18n.language === 'zhch'
              ? item.warehouseNameSchi
              : item.warehouseNameEng
          warehouse.push({
            id: item.warehouseId.toString(),
            name: warehouseName
          })
        })
        setWarehouseOption(warehouse)
      }
    } catch (error: any) {
      const { state, realm } = extractError(error)
      if (state.code === STATUS_CODE[503]) {
        navigate('/maintenance')
      }
    }
  }

  const initProcessType = async () => {
    let processList: il_item[] = []
    if (processTypeListData) {
      processTypeListData?.forEach((item: any) => {
        var name =
          i18n.language === 'zhhk'
            ? item.processTypeNameTchi
            : i18n.language === 'zhch'
            ? item.processTypeNameSchi
            : item.processTypeNameEng

        processList.push({
          id: item.processTypeId.toString(),
          name: name
        })
      })
      setProcessTypeList(processList)
    }
  }

  const resetForm = () => {
    setProcessTypeId('')
    setProcessOrderDetail(initDetail)
    setValidation([])
    setModalRemarks(false)
  }

  useEffect(() => {
    getProcessTypeList()
    getProductType()
    initWarehouse()
    initProcessType()
    setValidation([])

    if (action != 'add') {
      mappingData()
    } else {
      setTrySubmited(false)
      resetForm()
    }
  }, [drawerOpen, i18n.language])

  //todo: move validation to utils
  useEffect(() => {
    const validate = async () => {
      const tempV: formValidate[] = []
      processTypeId === '' &&
        tempV.push({
          field: t('processOrder.porCategory'),
          problem: formErr.empty,
          type: 'error'
        })

      const productItemIn = processOrderDetail[0].processIn
      const recyItemIn = processOrderDetail[0].processIn
      const productItemOut = processOrderDetail[0].processOut
      const recyItemOut = processOrderDetail[0].processOut

      // 1. validation rectype and product type
      if (productItemIn.itemCategory === 'product') {
        if (productItemIn.processOrderDetailProduct.length === 0) {
          tempV.push({
            field:
              t('pick_up_order.product_type.product') +
              '- ' +
              t('processOrder.table.processIn'),

            problem: formErr.empty,
            type: 'error'
          })
        }
      }

      if (recyItemIn.itemCategory === 'recycling') {
        if (recyItemIn.processOrderDetailRecyc.length === 0) {
          tempV.push({
            field:
              t('jobOrder.main_category') +
              '- ' +
              t('processOrder.table.processIn'),
            problem: formErr.empty,
            type: 'error'
          })
        }
      }

      if (productItemOut.itemCategory === 'product') {
        if (productItemOut.processOrderDetailProduct.length === 0) {
          tempV.push({
            field:
              t('pick_up_order.product_type.product') +
              '- ' +
              t('processOrder.table.processOut'),
            problem: formErr.empty,
            type: 'error'
          })
        }
      }

      if (recyItemOut.itemCategory === 'recycling') {
        if (recyItemOut.processOrderDetailRecyc.length === 0) {
          tempV.push({
            field:
              t('jobOrder.main_category') +
              '- ' +
              t('processOrder.table.processOut'),
            problem: formErr.empty,
            type: 'error'
          })
        }
      }

      //2. validation rectype and product subtype required
      if (recyItemIn.processOrderDetailRecyc.length > 0) {
        const recyData = recyItemIn.processOrderDetailRecyc
        recyData.forEach((item) => {
          const selectedRecy = recycType?.find(
            (src) => src.recycTypeId === item.recycTypeId
          )

          if (selectedRecy) {
            if (
              selectedRecy.recycSubType.length > 0 &&
              item.recycSubTypeId === ''
            ) {
              tempV.push({
                field:
                  t('processOrder.create.recycling') +
                  ' - ' +
                  t('jobOrder.subcategory') +
                  ' - ' +
                  t('processOrder.table.processIn'),
                problem: formErr.empty,
                type: 'error'
              })
            }
          }
        })
      }

      if (productItemIn.processOrderDetailProduct.length > 0) {
        const productData = productItemIn.processOrderDetailProduct
        productData.forEach((item) => {
          const selectedProduct = productType?.find(
            (src) => src.productTypeId === item.productTypeId
          )

          if (selectedProduct) {
            //check subproduct
            if (
              selectedProduct.productSubType!!.length > 0 &&
              item.productSubTypeId === ''
            ) {
              tempV.push({
                field:
                  t('processOrder.create.product') +
                  ' - ' +
                  t('pick_up_order.product_type.subtype') +
                  ' - ' +
                  t('processOrder.table.processIn'),
                problem: formErr.empty,
                type: 'error'
              })
            }

            //check addonproduct
            const subProduct = selectedProduct.productSubType?.find(
              (src) => src.productSubTypeId === item.productSubTypeId
            )
            if (subProduct) {
              if (
                subProduct.productAddonType!!.length > 0 &&
                item.productAddonId === ''
              ) {
                tempV.push({
                  field:
                    t('processOrder.create.product') +
                    ' - ' +
                    t('pick_up_order.product_type.add-on') +
                    ' - ' +
                    t('processOrder.table.processIn'),
                  problem: formErr.empty,
                  type: 'error'
                })
              }
            }
          }
        })
      }

      if (recyItemOut.processOrderDetailRecyc.length > 0) {
        const recyData = recyItemOut.processOrderDetailRecyc
        recyData.forEach((item) => {
          const selectedRecy = recycType?.find(
            (src) => src.recycTypeId === item.recycTypeId
          )

          if (selectedRecy) {
            if (
              selectedRecy.recycSubType.length > 0 &&
              item.recycSubTypeId === ''
            ) {
              tempV.push({
                field:
                  t('processOrder.create.recycling') +
                  ' - ' +
                  t('jobOrder.subcategory') +
                  ' - ' +
                  t('processOrder.table.processOut'),
                problem: formErr.empty,
                type: 'error'
              })
            }
          }
        })
      }

      if (productItemOut.processOrderDetailProduct.length > 0) {
        const productData = productItemOut.processOrderDetailProduct

        productData.forEach((item) => {
          const selectedProduct = productType?.find(
            (src) => src.productTypeId === item.productTypeId
          )

          if (selectedProduct) {
            //check subproduct
            if (
              selectedProduct.productSubType!!.length > 0 &&
              item.productSubTypeId === ''
            ) {
              tempV.push({
                field:
                  t('processOrder.create.product') +
                  ' - ' +
                  t('pick_up_order.product_type.subtype') +
                  ' - ' +
                  t('processOrder.table.processOut'),
                problem: formErr.empty,
                type: 'error'
              })
            }

            //check addonproduct
            const subProduct = selectedProduct.productSubType?.find(
              (src) => src.productSubTypeId === item.productSubTypeId
            )
            if (subProduct) {
              if (
                subProduct.productAddonType!!.length > 0 &&
                item.productAddonId === ''
              ) {
                tempV.push({
                  field:
                    t('processOrder.create.product') +
                    ' - ' +
                    t('pick_up_order.product_type.add-on') +
                    ' - ' +
                    t('processOrder.table.processOut'),
                  problem: formErr.empty,
                  type: 'error'
                })
              }
            }
          }
        })
      }

      //warehouse validation
      processOrderDetail[0].processIn.processOrderDetailWarehouse.length ===
        0 &&
        tempV.push({
          field:
            t('processOrder.create.warehouse') +
            ' - ' +
            t('processOrder.table.processIn'),
          problem: formErr.empty,
          type: 'error'
        })

      processOrderDetail[0].processOut.processOrderDetailWarehouse.length ===
        0 &&
        tempV.push({
          field:
            t('processOrder.create.warehouse') +
            ' - ' +
            t('processOrder.table.processOut'),
          problem: formErr.empty,
          type: 'error'
        })

      //weight validation
      if (
        parseFloat(processOrderDetail[0].processIn.estInWeight as string) <= 0
      )
        tempV.push({
          field:
            t('pick_up_order.recyclForm.weight') +
            ' - ' +
            t('processOrder.table.processIn'),
          problem: formErr.empty,
          type: 'error'
        })

      if (
        parseFloat(processOrderDetail[0].processOut.estOutWeight as string) <= 0
      )
        tempV.push({
          field:
            t('pick_up_order.recyclForm.weight') +
            ' - ' +
            t('processOrder.table.processOut'),
          problem: formErr.empty,
          type: 'error'
        })

      setValidation(tempV)
    }

    validate()
  }, [
    processTypeId,
    processOrderDetail,
    processOrderDetail[0].processIn.estInWeight,
    processOrderDetail[0].processOut.estOutWeight
  ])

  const onChangeItemCategory = (
    key: 'processIn' | 'processOut',
    selectedItem: string
  ) => {
    setProcessOrderDetail((prev) =>
      prev.map((item) => ({
        ...item,
        [key]: {
          ...item[key],
          itemCategory: selectedItem
        }
      }))
    )
  }

  const transformToSingleProducts = (
    products: productsVal[]
  ): singleProduct[] => {
    const singleProducts: singleProduct[] = []

    products.forEach((product) => {
      if (product.productSubType && product.productSubType.length > 0) {
        product.productSubType.forEach((subType) => {
          subType.productAddon.forEach((addon) => {
            singleProducts.push({
              productTypeId: product.productTypeId,
              productSubTypeId: subType.productSubTypeId,
              productAddonId: addon.productAddonId,
              productSubTypeRemark: subType.productSubTypeRemark,
              productAddonTypeRemark: addon.productAddonTypeRemark,
              isProductSubTypeOthers: subType.isProductSubTypeOthers,
              isProductAddonTypeOthers: addon.isProductAddonTypeOthers
            })
          })

          if (subType.productAddon.length === 0) {
            singleProducts.push({
              productTypeId: product.productTypeId,
              productSubTypeId: subType.productSubTypeId,
              productAddonId: '',
              productSubTypeRemark: subType.productSubTypeRemark,
              productAddonTypeRemark: '',
              isProductSubTypeOthers: subType.isProductSubTypeOthers,
              isProductAddonTypeOthers: false
            })
          }
        })
      } else {
        // Handle cases where productSubType is null or empty
        singleProducts.push({
          productTypeId: product.productTypeId,
          productSubTypeId: '',
          productAddonId: '',
          productSubTypeRemark: '',
          productAddonTypeRemark: '',
          isProductSubTypeOthers: false,
          isProductAddonTypeOthers: false
        })
      }
    })
    return singleProducts
  }

  const handleProductChange = (type: string, value: productsVal[]) => {
    const singleProducts: singleProduct[] = transformToSingleProducts(value)

    setProcessOrderDetail((prevDetails) =>
      prevDetails.map((detail) => ({
        ...detail,
        [type]: {
          ...detail[type as keyof CreateProcessOrderDetailPairs],
          processOrderDetailProduct: singleProducts
        }
      }))
    )
  }

  const handleRecycChange = (type: string, value: recyclable[]) => {
    if (value.length > 0) {
      let tempRecy: any[] = []
      tempRecy = value.flatMap((item) =>
        item.recycSubTypeId.length > 0
          ? item.recycSubTypeId.map((subType) => ({
              recycTypeId: item.recycTypeId,
              recycSubTypeId: subType
            }))
          : [
              {
                recycTypeId: item.recycTypeId,
                recycSubTypeId: ''
              }
            ]
      )

      tempRecy = tempRecy.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.recycTypeId === item.recycTypeId &&
              t.recycSubTypeId === item.recycSubTypeId
          )
      )

      setProcessOrderDetail((prevDetails) =>
        prevDetails.map((detail) => {
          const existingRecyc =
            detail[type as keyof CreateProcessOrderDetailPairs]
              ?.processOrderDetailRecyc || []

          // Check if new tempRecy is different from the existing one
          const isDifferent =
            tempRecy.length !== existingRecyc.length ||
            tempRecy.some(
              (item) =>
                !existingRecyc.some(
                  (existing) =>
                    existing.recycTypeId === item.recycTypeId &&
                    existing.recycSubTypeId === item.recycSubTypeId
                )
            )

          // Only update if different
          if (!isDifferent) {
            return detail
          }

          return {
            ...detail,
            [type]: {
              ...detail[type as keyof CreateProcessOrderDetailPairs],
              processOrderDetailRecyc: tempRecy
            }
          }
        })
      )
    }
  }

  const updateWarehouseIds = (
    newWarehouseIds: string[],
    key: 'processIn' | 'processOut'
  ) => {
    const parsedWarehouseIds = newWarehouseIds.map((id) => parseInt(id, 10))

    setProcessOrderDetail((prevDetails) =>
      prevDetails.map((detail) => ({
        ...detail,
        [key]: {
          ...detail[key],
          processOrderDetailWarehouse: parsedWarehouseIds.map((id) => ({
            warehouseId: id
          }))
        }
      }))
    )
  }

  const handleWeightChange = (
    value: string,
    field: 'estInWeight' | 'estOutWeight',
    idx: number
  ) => {
    console.log('handleWeightChange', value)
    setProcessOrderDetail((prevState) => {
      const newState = [...prevState]

      if (field === 'estInWeight') {
        newState[idx].processIn.estInWeight = value
      } else if (field === 'estOutWeight') {
        newState[idx].processOut.estOutWeight = value
      }

      return newState
    })
  }

  const checkString = (s: string) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s == ''
  }

  const valLength = (s: string[] | ProcessOrderDetailWarehouse[]) => {
    if (!trySubmited) {
      //before first submit, don't check the validation
      return false
    }
    return s.length === 0
  }

  const getEstimateEndDate = async (plannedStartAt: string) => {
    const params: QueryEstEndDatetime = {
      processTypeId: processTypeId,
      estInWeight: Number(processOrderDetail[0].processIn.estInWeight),
      plannedStartAt: dayjs.utc(plannedStartAt).format('YYYY-MM-DDTHH:mm:ss')
    }
    let plannedEndAt = ''
    const result = await getEstimateEndTime(params)
    if (result) {
      plannedEndAt = result.data
    }

    return plannedEndAt
  }

  const checkingRemarks = () => {
    const productItemIn = processOrderDetail[0].processIn
    const productItemOut = processOrderDetail[0].processOut
    //validate if others product showing
    if (productItemIn.itemCategory === 'product') {
      const productData = productItemIn.processOrderDetailProduct

      for (const item of productData) {
        if (
          (item.isProductSubTypeOthers && !item.productSubTypeRemark) ||
          (item.isProductAddonTypeOthers &&
            !item.productAddonTypeRemark &&
            trySubmited)
        ) {
          setModalRemarks(true)
          return true
        }
      }
    }

    if (productItemOut.itemCategory === 'product') {
      const productData = productItemOut.processOrderDetailProduct
      for (const item of productData) {
        if (
          (item.isProductSubTypeOthers && !item.productSubTypeRemark) ||
          (item.isProductAddonTypeOthers &&
            !item.productAddonTypeRemark &&
            trySubmited)
        ) {
          setModalRemarks(true)
          return true
        }
      }
    }

    return false
  }

  const validateRemark = () => {
    const modalTriggered = checkingRemarks()
    if (modalTriggered) {
      return
    }

    handleSaveItem()
  }

  const handleSaveItem = async () => {
    //console.log('handleSaveItem', processOrderDetail[0].processIn)
    if (validation.length !== 0) {
      setTrySubmited(true)
      return
    }

    let tempRandomId = Math.floor(Math.random() * 90000) + 10000
    let isUpdate = false
    if (processOrderDetail[0].processIn.idPair) {
      tempRandomId = processOrderDetail[0].processIn.idPair
      isUpdate = true
    }

    /** note :
     * eg: PAIR A
     * plannedEndAtData = plannedStartAt(from input) + duration (from api)
     * next pair eg: PAIR B
     * plannedStartAt = plannedEndAtData B
     * plannedEndAtData = plannedEndAtData B + duration
     * and continues sequence
     * **/

    if (!isUpdate) {
      const plannedStartAtData =
        dataSet.length === 0
          ? plannedStartAtInput
          : dataSet[dataSet.length - 1].processOut.plannedEndAt

      const estEndTime = await getEstimateEndDate(plannedStartAtData)
      const plannedEndAtData = dayjs(estEndTime).format(
        'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
      )

      // Only update processOrderDetail's plannedStartAt and plannedEndAt when not updating
      processOrderDetail[0].processIn.plannedStartAt = plannedStartAtData
      processOrderDetail[0].processOut.plannedEndAt = plannedEndAtData
    }

    Object.entries(processOrderDetail[0]).map(([key, value]) => {
      value.processTypeId = processTypeId
      value.idPair = tempRandomId
    })
    console.log('onsave', processOrderDetail)

    onSave(processOrderDetail, isUpdate)

    handleDrawerClose()
  }

  const getDefaultWarehouse = (key: string) => {
    if (action === 'edit') {
      const warehouseIds =
        key === 'processIn'
          ? processOrderDetail[0]?.processIn?.processOrderDetailWarehouse
              ?.map((item) => item.warehouseId?.toString() || '')
              .filter(Boolean)
          : processOrderDetail[0]?.processOut?.processOrderDetailWarehouse
              ?.map((item) => item.warehouseId?.toString() || '')
              .filter(Boolean)
      return warehouseIds
    }
  }

  const getDefaultProduct = (key: string) => {
    const selectedProduct =
      key === 'processIn'
        ? processOrderDetail[0].processIn.processOrderDetailProduct
        : processOrderDetail[0].processOut.processOrderDetailProduct

    if (selectedProduct.length > 0) {
      const product = transformData(selectedProduct, productType)
      return product
    }

    return []
  }

  const getDefaultRecy = (key: string) => {
    const dataRecy =
      key === 'processIn'
        ? processOrderDetail[0].processIn?.processOrderDetailRecyc
        : processOrderDetail[0].processOut?.processOrderDetailRecyc

    const defaultData: recyclable[] = dataRecy.map((item) => ({
      recycTypeId: item.recycTypeId,
      recycSubTypeId: Array.isArray(item.recycSubTypeId)
        ? item.recycSubTypeId
        : [item.recycSubTypeId]
    }))

    return defaultData
  }

  const isSubProductRequired = (key: string) => {
    const typeProcess =
      key === 'processIn'
        ? t('processOrder.table.processIn')
        : t('processOrder.table.processOut')
    const currfield =
      t('processOrder.create.product') +
      ' - ' +
      t('pick_up_order.product_type.subtype') +
      ' - ' +
      typeProcess
    return validation.some((item) => item.field === currfield)
  }

  const isAddonRequired = (key: string) => {
    const typeProcess =
      key === 'processIn'
        ? t('processOrder.table.processIn')
        : t('processOrder.table.processOut')
    const currfield =
      t('processOrder.create.product') +
      ' - ' +
      t('pick_up_order.product_type.add-on') +
      ' - ' +
      typeProcess

    return validation.some((item) => item.field === currfield)
  }

  const isSubRecyleRequired = (key: string) => {
    const typeProcess =
      key === 'processIn'
        ? t('processOrder.table.processIn')
        : t('processOrder.table.processOut')

    const currfield =
      t('processOrder.create.recycling') +
      ' - ' +
      t('jobOrder.subcategory') +
      ' - ' +
      typeProcess
    return validation.some((item) => item.field === currfield)
  }

  return (
    <>
      <Box>
        <ToastContainer></ToastContainer>
        <RightOverlayForm
          open={drawerOpen}
          onClose={handleDrawerClose}
          anchor={'right'}
          action={action}
          headerProps={{
            title: t('top_menu.add_new'),
            subTitle: t('processOrder.porCategory'),
            submitText: t('add_warehouse_page.save'),
            cancelText: t('common.cancel'),
            onCloseHeader: handleDrawerClose,
            onSubmit: validateRemark,
            onDelete: handleDrawerClose
          }}
        >
          <Divider></Divider>
          <Box sx={{ PaddingX: 2 }}>
            <Grid
              container
              direction={'column'}
              spacing={4}
              sx={{
                width: { xs: '100%' },
                marginTop: { sm: 2, xs: 6 },
                marginLeft: {
                  xs: 0
                },
                paddingRight: 2
              }}
              className="sm:ml-0 mt-o w-full"
            >
              <Grid item>
                <CustomField label={t('processOrder.porCategory')} mandatory>
                  <CustomItemList
                    items={processTypeList}
                    singleSelect={(selectedItem) => {
                      setProcessTypeId(selectedItem)
                    }}
                    defaultSelected={processTypeId}
                    needPrimaryColor={true}
                    error={trySubmited && checkString(processTypeId)}
                  />
                </CustomField>
              </Grid>
              {/* item card */}
              {Object.entries(processOrderDetail[0]).map(([key, value]) => {
                const processKey = key as keyof CreateProcessOrderDetailPairs
                return (
                  <Grid item key={key}>
                    <div className="p-4 bg-[#D1D1D1] rounded-t-lg max-w-max text-white font-bold">
                      {key === 'processIn'
                        ? t('processOrder.create.itemToProcessIn')
                        : t('processOrder.create.itemToProcessOut')}
                    </div>
                    <Box
                      sx={{
                        border: '1px solid #D1D1D1',
                        padding: 2,
                        borderTopRightRadius: '16px',
                        borderBottomLeftRadius: '16px',
                        WebkitBorderBottomRightRadius: '16px'
                      }}
                    >
                      {/* item category */}
                      <Grid item sx={{ marginBottom: 2 }}>
                        <CustomField
                          label={t('processOrder.create.itemCategory')}
                          mandatory
                        >
                          <CustomItemList
                            items={itemCategory()}
                            singleSelect={(selectedItem) => {
                              onChangeItemCategory(processKey, selectedItem)
                            }}
                            defaultSelected={value.itemCategory}
                            needPrimaryColor={true}
                          />
                        </CustomField>
                      </Grid>
                      {/* item category product / recyle */}
                      {value.itemCategory === 'recycling' ? (
                        <Grid item>
                          <CustomField label={t('col.recycType')} mandatory>
                            <RecyclablesList
                              recycL={recycType || []}
                              setState={(value) => {
                                const keyType =
                                  key === 'processIn'
                                    ? 'processIn'
                                    : 'processOut'
                                handleRecycChange(keyType, value)
                              }}
                              showError={
                                (key === 'processIn'
                                  ? processOrderDetail?.[0]?.processIn
                                  : processOrderDetail?.[0]?.processOut
                                )?.processOrderDetailRecyc?.length === 0 &&
                                trySubmited
                              }
                              showErrorSubtype={
                                isSubRecyleRequired(key) && trySubmited
                              }
                              subTypeRequired={true}
                              defaultRecycL={getDefaultRecy(key)}
                            />
                          </CustomField>
                        </Grid>
                      ) : value.itemCategory === 'product' ? (
                        <CustomField
                          label={t('pick_up_order.product_type.product')}
                          mandatory
                        >
                          <ProductListMultiSelect
                            options={productType || []}
                            setState={(value) => {
                              const keyType =
                                key === 'processIn' ? 'processIn' : 'processOut'
                              handleProductChange(keyType, value)
                            }}
                            itemColor={{
                              bgColor: customListTheme
                                ? customListTheme.bgColor
                                : '#E4F6DC',
                              borderColor: customListTheme
                                ? customListTheme.border
                                : '79CA25'
                            }}
                            showError={
                              (key === 'processIn'
                                ? processOrderDetail?.[0]?.processIn
                                : processOrderDetail?.[0]?.processOut
                              )?.processOrderDetailProduct?.length === 0 &&
                              trySubmited
                            }
                            showErrorSubtype={
                              isSubProductRequired(key) && trySubmited
                            }
                            showErrorAddon={isAddonRequired(key) && trySubmited}
                            defaultProduct={getDefaultProduct(key)}
                          />
                        </CustomField>
                      ) : (
                        <div></div>
                      )}

                      {/* warehouse */}
                      <Grid item sx={{ marginBottom: 2, marginTop: 2 }}>
                        <CustomField
                          label={t('processOrder.create.warehouse')}
                          mandatory
                        >
                          <CustomItemList
                            items={warehouseOption ?? []}
                            multiSelect={(selectedItems: string[]) =>
                              updateWarehouseIds(
                                selectedItems,
                                key as keyof CreateProcessOrderDetailPairs
                              )
                            }
                            defaultSelected={getDefaultWarehouse(key)}
                            needPrimaryColor={false}
                            error={
                              trySubmited &&
                              valLength(
                                key === 'processIn'
                                  ? processOrderDetail[0].processIn
                                      .processOrderDetailWarehouse
                                  : processOrderDetail[0].processOut
                                      .processOrderDetailWarehouse
                              )
                            }
                          />
                        </CustomField>
                      </Grid>

                      {/* weight */}
                      <Grid item sx={{ marginBottom: 2 }}>
                        <CustomField
                          label={t('pick_up_order.recyclForm.weight')}
                          mandatory
                        >
                          <CustomTextField
                            id="weight"
                            placeholder={t('userAccount.pleaseEnterNumber')}
                            onChange={(event) => {
                              onChangeWeight(
                                event.target.value,
                                decimalVal,
                                (value: string) => {
                                  const field =
                                    key === 'processIn'
                                      ? 'estInWeight'
                                      : 'estOutWeight'
                                  const idx = key === 'processIn' ? 0 : 1
                                  handleWeightChange(value, field, 0)
                                }
                              )
                            }}
                            onBlur={(event) => {
                              const value = event.target.value
                                ? formatWeight(event.target.value, decimalVal)
                                : '0'
                              const field =
                                key === 'processIn'
                                  ? 'estInWeight'
                                  : 'estOutWeight'
                              const idx = key === 'processIn' ? 0 : 1
                              handleWeightChange(value, field, 0)
                            }}
                            value={
                              key === 'processIn'
                                ? processOrderDetail[0].processIn.estInWeight
                                : processOrderDetail[0].processOut.estOutWeight
                            }
                            error={
                              (trySubmited &&
                                (key === 'processOut'
                                  ? parseFloat(
                                      processOrderDetail[0].processOut
                                        .estOutWeight as string
                                    ) === 0
                                  : parseFloat(
                                      processOrderDetail[0].processIn
                                        .estInWeight as string
                                    ) === 0)) ||
                              undefined
                            }
                            sx={{ width: '100%' }}
                            endAdornment={
                              <InputAdornment position="end">kg</InputAdornment>
                            }
                          ></CustomTextField>
                        </CustomField>
                      </Grid>
                    </Box>
                  </Grid>
                )
              })}
              <Grid item>
                {trySubmited &&
                  validation.map((val, index) => (
                    <FormErrorMsg
                      key={index}
                      field={t(val.field)}
                      errorMsg={returnErrorMsg(val.problem, t)}
                      type={val.type}
                      dataTestId={val.dataTestId}
                    />
                  ))}
              </Grid>
            </Grid>
            <ConfirmRemarksModal
              open={modalRemark}
              onConfirm={() => {
                handleSaveItem()
                setModalRemarks(false)
              }}
              onClose={() => setModalRemarks(false)}
            />
          </Box>
        </RightOverlayForm>
      </Box>
    </>
  )
}

export default InputProcessForm
